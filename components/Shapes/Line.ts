// components/Shapes/Line.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface LineData extends BaseShape {
  type: 'line' | 'freehand';
  points: Point[];
}

export class Line extends Shape<LineData> {
  static create(startPoint: Point, type: 'line' | 'freehand' = 'line', style: Partial<ShapeStyle> = {}): Line {
    return new Line({
      id: crypto.randomUUID(),
      type,
      points: [startPoint],
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): Line {
    return new Line({
      ...this.data,
      points: [...this.data.points],
    });
  }

  addPoint(point: Point): Line {
    return this.updateData({
      points: [...this.data.points, point],
    }) as Line;
  }

  getBoundingBox(): AABB {
    if (this.data.points.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const p of this.data.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }

    return { minX, minY, maxX, maxY };
  }

  containsPoint(point: Point, threshold: number = 5): boolean {
    if (this.data.points.length < 2) return false;

    for (let i = 0; i < this.data.points.length - 1; i++) {
      const p1 = this.data.points[i];
      const p2 = this.data.points[i + 1];
      const dist = this.pointToSegmentDistance(point, p1, p2);
      if (dist <= threshold) return true;
    }

    return false;
  }

  private pointToSegmentDistance(p: Point, a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
    }

    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    const projX = a.x + t * dx;
    const projY = a.y + t * dy;

    return Math.sqrt((p.x - projX) ** 2 + (p.y - projY) ** 2);
  }

  translate(dx: number, dy: number): Line {
    return this.updateData({
      points: this.data.points.map(p => ({ x: p.x + dx, y: p.y + dy })),
    }) as Line;
  }

  resize(bounds: AABB): Line {
    const currentBounds = this.getBoundingBox();
    const scaleX = (bounds.maxX - bounds.minX) / (currentBounds.maxX - currentBounds.minX);
    const scaleY = (bounds.maxY - bounds.minY) / (currentBounds.maxY - currentBounds.minY);

    const newPoints = this.data.points.map(p => ({
      x: bounds.minX + (p.x - currentBounds.minX) * scaleX,
      y: bounds.minY + (p.y - currentBounds.minY) * scaleY,
    }));

    return this.updateData({ points: newPoints }) as Line;
  }
}