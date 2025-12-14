// components/Selection/SelectionBox.ts

import { Point, AABB } from '@/components/Shapes/Shape';

export class SelectionBox {
  public start: Point;
  public end: Point;

  constructor(start: Point) {
    this.start = start;
    this.end = start;
  }

  update(end: Point): SelectionBox {
    const box = new SelectionBox(this.start);
    box.end = end;
    return box;
  }

  getBounds(): AABB {
    return {
      minX: Math.min(this.start.x, this.end.x),
      minY: Math.min(this.start.y, this.end.y),
      maxX: Math.max(this.start.x, this.end.x),
      maxY: Math.max(this.start.y, this.end.y),
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    const bounds = this.getBounds();
    
    ctx.save();
    
    // Draw fill
    ctx.fillStyle = 'rgba(0, 102, 255, 0.1)';
    ctx.fillRect(
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY
    );
    
    // Draw border
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY
    );
    
    ctx.restore();
  }
}