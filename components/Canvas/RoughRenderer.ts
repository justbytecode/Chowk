// components/Canvas/RoughRenderer.ts

import { Shape, Point } from '@/components/Shapes/Shape';
import { Rectangle } from '@/components/Shapes/Rectangle';
import { Circle } from '@/components/Shapes/Circle';
import { Line } from '@/components/Shapes/Line';
import { Arrow } from '@/components/Shapes/Arrow';
import { Text } from '@/components/Shapes/Text';
import { Scene } from '@/engine/Scene';
import { getRoughCanvas } from '@/lib/rough';
import type { RoughCanvas } from 'roughjs/bin/canvas';

export class RoughRenderer {
  private rc: RoughCanvas;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.rc = getRoughCanvas(canvas);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderScene(scene: Scene) {
    this.clear();
    
    // Draw grid
    this.drawGrid();
    
    // Draw all shapes
    const shapes = scene.getAllShapes();
    for (const shape of shapes) {
      this.renderShape(shape);
    }
    
    // Draw selection boxes (not rough)
    const selected = scene.getSelectedShapes();
    for (const shape of selected) {
      this.drawSelectionBox(shape);
    }
  }

  private drawGrid() {
    const gridSize = 20;
    
    this.ctx.save();
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  private renderShape(shape: Shape) {
    const style = shape.data.style;
    
    const options = {
      stroke: style.strokeColor,
      strokeWidth: style.strokeWidth,
      fill: style.fillColor === 'transparent' ? undefined : style.fillColor,
      fillStyle: 'hachure' as const,
      roughness: style.roughness,
    };

    this.ctx.globalAlpha = style.opacity;

    try {
      if (shape instanceof Rectangle) {
        this.drawRectangle(shape, options);
      } else if (shape instanceof Circle) {
        this.drawCircle(shape, options);
      } else if (shape instanceof Line) {
        this.drawLine(shape, options);
      } else if (shape instanceof Arrow) {
        this.drawArrow(shape, options);
      } else if (shape instanceof Text) {
        this.drawText(shape);
      }
    } catch (error) {
      console.error('Error rendering shape:', error);
    }

    this.ctx.globalAlpha = 1;
  }

  private drawRectangle(rect: Rectangle, options: any) {
    const { x, y, width, height } = rect.data;
    this.rc.rectangle(x, y, width, height, options);
  }

  private drawCircle(circle: Circle, options: any) {
    const { cx, cy, radius } = circle.data;
    this.rc.circle(cx, cy, radius * 2, options);
  }

  private drawLine(line: Line, options: any) {
    const points = line.data.points;
    if (points.length < 2) return;

    if (line.data.type === 'freehand') {
      // Draw as curve for freehand
      this.rc.curve(
        points.map(p => [p.x, p.y]),
        options
      );
    } else {
      // Draw straight line
      this.rc.line(
        points[0].x,
        points[0].y,
        points[points.length - 1].x,
        points[points.length - 1].y,
        options
      );
    }
  }

  private drawArrow(arrow: Arrow, options: any) {
    const { start, end } = arrow.data;
    
    // Draw main line
    this.rc.line(start.x, start.y, end.x, end.y, options);
    
    // Draw arrowhead
    const headPoints = arrow.getArrowHeadPoints();
    this.rc.polygon(
      headPoints.map(p => [p.x, p.y]),
      { ...options, fill: options.stroke }
    );
  }

  private drawText(text: Text) {
    const { x, y, text: content, fontSize, fontFamily, style } = text.data;
    
    this.ctx.save();
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = style.strokeColor;
    this.ctx.fillText(content, x, y + fontSize);
    this.ctx.restore();
    
    // Draw bounding box when selected
    if (text.data.isSelected) {
      this.ctx.save();
      this.ctx.strokeStyle = '#999';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(x, y, text.data.width, text.data.height);
      this.ctx.restore();
    }
  }

  private drawSelectionBox(shape: Shape) {
    const bbox = shape.getBoundingBox();
    
    this.ctx.save();
    this.ctx.strokeStyle = '#0066ff';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.strokeRect(
      bbox.minX - 2,
      bbox.minY - 2,
      bbox.maxX - bbox.minX + 4,
      bbox.maxY - bbox.minY + 4
    );
    
    // Draw resize handles
    const handleSize = 8;
    const handles = [
      { x: bbox.minX, y: bbox.minY },
      { x: (bbox.minX + bbox.maxX) / 2, y: bbox.minY },
      { x: bbox.maxX, y: bbox.minY },
      { x: bbox.maxX, y: (bbox.minY + bbox.maxY) / 2 },
      { x: bbox.maxX, y: bbox.maxY },
      { x: (bbox.minX + bbox.maxX) / 2, y: bbox.maxY },
      { x: bbox.minX, y: bbox.maxY },
      { x: bbox.minX, y: (bbox.minY + bbox.maxY) / 2 },
    ];
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = '#0066ff';
    this.ctx.setLineDash([]);
    
    for (const handle of handles) {
      this.ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
      this.ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
    }
    
    this.ctx.restore();
  }
}