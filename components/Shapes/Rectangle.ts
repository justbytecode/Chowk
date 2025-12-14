// components/Shapes/Rectangle.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface RectangleData extends BaseShape {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Rectangle extends Shape<RectangleData> {
  static create(x: number, y: number, width: number, height: number, style: Partial<ShapeStyle> = {}): Rectangle {
    return new Rectangle({
      id: crypto.randomUUID(),
      type: 'rectangle',
      x,
      y,
      width,
      height,
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): Rectangle {
    return new Rectangle({ ...this.data });
  }

  getBoundingBox(): AABB {
    const x = Math.min(this.data.x, this.data.x + this.data.width);
    const y = Math.min(this.data.y, this.data.y + this.data.height);
    const w = Math.abs(this.data.width);
    const h = Math.abs(this.data.height);
    
    return {
      minX: x,
      minY: y,
      maxX: x + w,
      maxY: y + h,
    };
  }

  containsPoint(point: Point, threshold: number = 5): boolean {
    const bbox = this.getBoundingBox();
    const expanded = {
      minX: bbox.minX - threshold,
      minY: bbox.minY - threshold,
      maxX: bbox.maxX + threshold,
      maxY: bbox.maxY + threshold,
    };
    
    return (
      point.x >= expanded.minX &&
      point.x <= expanded.maxX &&
      point.y >= expanded.minY &&
      point.y <= expanded.maxY
    );
  }

  translate(dx: number, dy: number): Rectangle {
    return this.updateData({
      x: this.data.x + dx,
      y: this.data.y + dy,
    }) as Rectangle;
  }

  resize(bounds: AABB): Rectangle {
    return this.updateData({
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
    }) as Rectangle;
  }
}