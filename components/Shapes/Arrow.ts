// components/Shapes/Arrow.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface ArrowData extends BaseShape {
  type: 'arrow';
  start: Point;
  end: Point;
  arrowHeadSize: number;
}

export class Arrow extends Shape<ArrowData> {
  static create(start: Point, end: Point, style: Partial<ShapeStyle> = {}): Arrow {
    return new Arrow({
      id: crypto.randomUUID(),
      type: 'arrow',
      start,
      end,
      arrowHeadSize: 15,
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): Arrow {
    return new Arrow({ ...this.data });
  }

  getBoundingBox(): AABB {
    const minX = Math.min(this.data.start.x, this.data.end.x);
    const minY = Math.min(this.data.start.y, this.data.end.y);
    const maxX = Math.max(this.data.start.x, this.data.end.x);
    const maxY = Math.max(this.data.start.y, this.data.end.y);

    return { minX, minY, maxX, maxY };
  }

  containsPoint(point: Point, threshold: number = 5): boolean {
    const dist = this.pointToSegmentDistance(
      point,
      this.data.start,
      this.data.end
    );
    return dist <= threshold;
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

  translate(dx: number, dy: number): Arrow {
    return this.updateData({
      start: { x: this.data.start.x + dx, y: this.data.start.y + dy },
      end: { x: this.data.end.x + dx, y: this.data.end.y + dy },
    }) as Arrow;
  }

  resize(bounds: AABB): Arrow {
    return this.updateData({
      start: { x: bounds.minX, y: bounds.minY },
      end: { x: bounds.maxX, y: bounds.maxY },
    }) as Arrow;
  }

  getArrowHeadPoints(): Point[] {
    const angle = Math.atan2(
      this.data.end.y - this.data.start.y,
      this.data.end.x - this.data.start.x
    );
    const size = this.data.arrowHeadSize;

    const angle1 = angle + Math.PI + Math.PI / 6;
    const angle2 = angle + Math.PI - Math.PI / 6;

    return [
      {
        x: this.data.end.x + size * Math.cos(angle1),
        y: this.data.end.y + size * Math.sin(angle1),
      },
      this.data.end,
      {
        x: this.data.end.x + size * Math.cos(angle2),
        y: this.data.end.y + size * Math.sin(angle2),
      },
    ];
  }
}