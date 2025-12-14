// components/Shapes/Circle.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface CircleData extends BaseShape {
  type: 'circle';
  cx: number;
  cy: number;
  radius: number;
}

export class Circle extends Shape<CircleData> {
  static create(cx: number, cy: number, radius: number, style: Partial<ShapeStyle> = {}): Circle {
    return new Circle({
      id: crypto.randomUUID(),
      type: 'circle',
      cx,
      cy,
      radius: Math.abs(radius),
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): Circle {
    return new Circle({ ...this.data });
  }

  getBoundingBox(): AABB {
    return {
      minX: this.data.cx - this.data.radius,
      minY: this.data.cy - this.data.radius,
      maxX: this.data.cx + this.data.radius,
      maxY: this.data.cy + this.data.radius,
    };
  }

  containsPoint(point: Point, threshold: number = 5): boolean {
    const dx = point.x - this.data.cx;
    const dy = point.y - this.data.cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(distance - this.data.radius) <= threshold;
  }

  translate(dx: number, dy: number): Circle {
    return this.updateData({
      cx: this.data.cx + dx,
      cy: this.data.cy + dy,
    }) as Circle;
  }

  resize(bounds: AABB): Circle {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const newRadius = Math.max(width, height) / 2;
    const newCx = bounds.minX + width / 2;
    const newCy = bounds.minY + height / 2;
    
    return this.updateData({
      cx: newCx,
      cy: newCy,
      radius: newRadius,
    }) as Circle;
  }
}