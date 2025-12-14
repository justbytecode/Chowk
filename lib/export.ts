// lib/export.ts

import { Scene } from '@/engine/Scene';
import { Shape, AABB } from '@/components/Shapes/Shape';
import { Rectangle } from '@/components/Shapes/Rectangle';
import { Circle } from '@/components/Shapes/Circle';
import { Line } from '@/components/Shapes/Line';
import { Arrow } from '@/components/Shapes/Arrow';
import { Text } from '@/components/Shapes/Text';
import { ImageShape } from '@/components/Shapes/Image';
import { HitTest } from '@/engine/HitTest';

export class ExportUtils {
  static async exportToPNG(
    scene: Scene,
    options: {
      scale?: number;
      padding?: number;
      backgroundColor?: string;
    } = {}
  ): Promise<Blob> {
    const { scale = 2, padding = 20, backgroundColor = '#ffffff' } = options;

    const bounds = this.getSceneBounds(scene);
    if (!bounds) {
      throw new Error('Cannot export empty scene');
    }

    const width = (bounds.maxX - bounds.minX + padding * 2) * scale;
    const height = (bounds.maxY - bounds.minY + padding * 2) * scale;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.scale(scale, scale);
    ctx.translate(-bounds.minX + padding, -bounds.minY + padding);

    await this.renderShapesToContext(ctx, scene.getAllShapes());

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });
  }

  static exportToSVG(
    scene: Scene,
    options: {
      padding?: number;
      backgroundColor?: string;
    } = {}
  ): string {
    const { padding = 20, backgroundColor = '#ffffff' } = options;

    const bounds = this.getSceneBounds(scene);
    if (!bounds) {
      return '<svg></svg>';
    }

    const width = bounds.maxX - bounds.minX + padding * 2;
    const height = bounds.maxY - bounds.minY + padding * 2;

    const shapes = scene.getAllShapes();
    const shapeSVGs = shapes.map(shape => 
      this.shapeToSVG(shape, bounds.minX - padding, bounds.minY - padding)
    );

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  <g>
    ${shapeSVGs.join('\n    ')}
  </g>
</svg>`;
  }

  private static getSceneBounds(scene: Scene): AABB | null {
    const shapes = scene.getAllShapes();
    return HitTest.getCombinedBounds(shapes);
  }

  private static async renderShapesToContext(
    ctx: CanvasRenderingContext2D,
    shapes: Shape[]
  ): Promise<void> {
    for (const shape of shapes) {
      const style = shape.data.style;
      
      ctx.save();
      ctx.strokeStyle = style.strokeColor;
      ctx.lineWidth = style.strokeWidth;
      ctx.fillStyle = style.fillColor;
      ctx.globalAlpha = style.opacity;

      if (shape instanceof Rectangle) {
        const { x, y, width, height } = shape.data;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        if (style.fillColor !== 'transparent') ctx.fill();
        ctx.stroke();
      } else if (shape instanceof Circle) {
        const { cx, cy, radius } = shape.data;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (style.fillColor !== 'transparent') ctx.fill();
        ctx.stroke();
      } else if (shape instanceof Line) {
        const points = shape.data.points;
        if (points.length >= 2) {
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
      } else if (shape instanceof Arrow) {
        const { start, end } = shape.data;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        const headPoints = shape.getArrowHeadPoints();
        ctx.beginPath();
        ctx.moveTo(headPoints[0].x, headPoints[0].y);
        ctx.lineTo(headPoints[1].x, headPoints[1].y);
        ctx.lineTo(headPoints[2].x, headPoints[2].y);
        ctx.closePath();
        ctx.fill();
      } else if (shape instanceof Text) {
        const { x, y, text, fontSize, fontFamily } = shape.data;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = style.strokeColor;
        ctx.fillText(text, x, y + fontSize);
      } else if (shape instanceof ImageShape) {
        try {
          const img = await shape.loadImage();
          const { x, y, width, height } = shape.data;
          ctx.drawImage(img, x, y, width, height);
        } catch (error) {
          console.error('Failed to render image:', error);
        }
      }

      ctx.restore();
    }
  }

  private static shapeToSVG(shape: Shape, offsetX: number, offsetY: number): string {
    const style = shape.data.style;
    const commonAttrs = `stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" fill="${style.fillColor}" opacity="${style.opacity}"`;

    if (shape instanceof Rectangle) {
      const { x, y, width, height } = shape.data;
      return `<rect x="${x - offsetX}" y="${y - offsetY}" width="${width}" height="${height}" ${commonAttrs} />`;
    } else if (shape instanceof Circle) {
      const { cx, cy, radius } = shape.data;
      return `<circle cx="${cx - offsetX}" cy="${cy - offsetY}" r="${radius}" ${commonAttrs} />`;
    } else if (shape instanceof Line) {
      const points = shape.data.points
        .map(p => `${p.x - offsetX},${p.y - offsetY}`)
        .join(' ');
      return `<polyline points="${points}" ${commonAttrs} fill="none" />`;
    } else if (shape instanceof Arrow) {
      const { start, end } = shape.data;
      const line = `<line x1="${start.x - offsetX}" y1="${start.y - offsetY}" x2="${end.x - offsetX}" y2="${end.y - offsetY}" ${commonAttrs} />`;
      
      const headPoints = shape.getArrowHeadPoints();
      const headPath = headPoints.map((p, i) => 
        `${i === 0 ? 'M' : 'L'}${p.x - offsetX},${p.y - offsetY}`
      ).join(' ') + ' Z';
      const arrowhead = `<path d="${headPath}" fill="${style.strokeColor}" opacity="${style.opacity}" />`;
      
      return line + '\n    ' + arrowhead;
    } else if (shape instanceof Text) {
      const { x, y, text, fontSize, fontFamily } = shape.data;
      return `<text x="${x - offsetX}" y="${y - offsetY + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" fill="${style.strokeColor}" opacity="${style.opacity}">${this.escapeXML(text)}</text>`;
    } else if (shape instanceof ImageShape) {
      const { x, y, width, height, src } = shape.data;
      return `<image x="${x - offsetX}" y="${y - offsetY}" width="${width}" height="${height}" href="${src}" opacity="${style.opacity}" />`;
    }

    return '';
  }

  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static downloadSVG(svg: string, filename: string): void {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }
}