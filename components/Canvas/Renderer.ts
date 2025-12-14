// components/Canvas/Renderer.ts

import { Shape, Point } from '@/components/Shapes/Shape';
import { Rectangle } from '@/components/Shapes/Rectangle';
import { Circle } from '@/components/Shapes/Circle';
import { Line } from '@/components/Shapes/Line';
import { Arrow } from '@/components/Shapes/Arrow';
import { Text } from '@/components/Shapes/Text';
import { ImageShape } from '@/components/Shapes/Image';
import { Scene } from '@/engine/Scene';
import { Theme } from '@/lib/theme';

export class Renderer {
  private imageCache: Map<string, HTMLImageElement> = new Map();

  constructor(private ctx: CanvasRenderingContext2D, private theme: Theme) {}

  updateTheme(theme: Theme) {
    this.theme = theme;
  }

  clear() {
    const canvas = this.ctx.canvas;
    this.ctx.fillStyle = this.theme.colors.canvas;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  renderScene(scene: Scene) {
    this.clear();
    this.drawGrid();
    
    const shapes = scene.getAllShapes();
    for (const shape of shapes) {
      this.renderShape(shape);
    }
    
    const selected = scene.getSelectedShapes();
    for (const shape of selected) {
      this.drawSelectionBox(shape);
    }
  }

  private drawGrid() {
    const canvas = this.ctx.canvas;
    const gridSize = 20;
    
    this.ctx.save();
    this.ctx.strokeStyle = this.theme.colors.grid;
    this.ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvas.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvas.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  private async renderShape(shape: Shape) {
    const style = shape.data.style;
    
    this.ctx.save();
    this.ctx.strokeStyle = style.strokeColor;
    this.ctx.lineWidth = style.strokeWidth;
    this.ctx.fillStyle = style.fillColor;
    this.ctx.globalAlpha = style.opacity;
    
    if (shape instanceof Rectangle) {
      this.drawRectangle(shape);
    } else if (shape instanceof Circle) {
      this.drawCircle(shape);
    } else if (shape instanceof Line) {
      this.drawLine(shape);
    } else if (shape instanceof Arrow) {
      this.drawArrow(shape);
    } else if (shape instanceof Text) {
      this.drawText(shape);
    } else if (shape instanceof ImageShape) {
      await this.drawImage(shape);
    }
    
    this.ctx.restore();
  }

  private drawRectangle(rect: Rectangle) {
    const { x, y, width, height } = rect.data;
    
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    
    if (rect.data.style.fillColor !== 'transparent') {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawCircle(circle: Circle) {
    const { cx, cy, radius } = circle.data;
    
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    
    if (circle.data.style.fillColor !== 'transparent') {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawLine(line: Line) {
    const points = line.data.points;
    if (points.length < 2) return;
    
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    
    this.ctx.stroke();
  }

  private drawArrow(arrow: Arrow) {
    const { start, end } = arrow.data;
    
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
    
    const headPoints = arrow.getArrowHeadPoints();
    this.ctx.beginPath();
    this.ctx.moveTo(headPoints[0].x, headPoints[0].y);
    this.ctx.lineTo(headPoints[1].x, headPoints[1].y);
    this.ctx.lineTo(headPoints[2].x, headPoints[2].y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawText(text: Text) {
    const { x, y, text: content, fontSize, fontFamily } = text.data;
    
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = text.data.style.strokeColor;
    this.ctx.fillText(content, x, y + fontSize);
    
    if (text.data.isSelected) {
      this.ctx.strokeStyle = this.theme.colors.border;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(x, y, text.data.width, text.data.height);
      this.ctx.setLineDash([]);
    }
  }

  private async drawImage(imageShape: ImageShape) {
    const { x, y, width, height, src } = imageShape.data;
    
    try {
      let img = this.imageCache.get(src);
      
      if (!img) {
        img = await imageShape.loadImage();
        this.imageCache.set(src, img);
      }
      
      this.ctx.drawImage(img, x, y, width, height);
      
      // Draw border
      this.ctx.strokeStyle = this.theme.colors.border;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, width, height);
    } catch (error) {
      // Draw error placeholder
      this.ctx.fillStyle = this.theme.colors.surface;
      this.ctx.fillRect(x, y, width, height);
      this.ctx.strokeStyle = this.theme.colors.border;
      this.ctx.strokeRect(x, y, width, height);
      
      this.ctx.fillStyle = this.theme.colors.textSecondary;
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Image failed to load', x + width / 2, y + height / 2);
    }
  }

  private drawSelectionBox(shape: Shape) {
    const bbox = shape.getBoundingBox();
    
    this.ctx.save();
    this.ctx.strokeStyle = this.theme.colors.selectionBorder;
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
    
    this.ctx.fillStyle = this.theme.colors.surface;
    this.ctx.strokeStyle = this.theme.colors.selectionBorder;
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