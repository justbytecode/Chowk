// components/Shapes/Shape.ts

// ADD 'image' to this type union
export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow' | 'freehand' | 'text' | 'image';

export interface Point {
  x: number;
  y: number;
}

export interface AABB {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ShapeStyle {
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  roughness: number;
  opacity: number;
}

export const DEFAULT_STYLE: ShapeStyle = {
  strokeColor: '#000000',
  strokeWidth: 2,
  fillColor: 'transparent',
  roughness: 1,
  opacity: 1,
};

export interface BaseShape {
  id: string;
  type: ShapeType;
  style: ShapeStyle;
  isSelected: boolean;
  version: number;
}

export abstract class Shape<T extends BaseShape = BaseShape> {
  constructor(public data: T) {}

  abstract clone(): Shape<T>;
  abstract getBoundingBox(): AABB;
  abstract containsPoint(point: Point, threshold?: number): boolean;
  abstract translate(dx: number, dy: number): Shape<T>;
  abstract resize(bounds: AABB): Shape<T>;
  
  select(): Shape<T> {
    return this.updateData({ isSelected: true });
  }
  
  deselect(): Shape<T> {
    return this.updateData({ isSelected: false });
  }
  
  updateStyle(style: Partial<ShapeStyle>): Shape<T> {
    return this.updateData({
      style: { ...this.data.style, ...style }
    });
  }
  
  protected updateData(updates: Partial<T>): Shape<T> {
    const Constructor = this.constructor as new (data: T) => Shape<T>;
    return new Constructor({
      ...this.data,
      ...updates,
      version: this.data.version + 1,
    } as T);
  }
}