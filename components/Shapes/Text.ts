// components/Shapes/Text.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface TextData extends BaseShape {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  width: number;
  height: number;
}

export class Text extends Shape<TextData> {
  static create(
    x: number,
    y: number,
    text: string = '',
    style: Partial<ShapeStyle> = {}
  ): Text {
    return new Text({
      id: crypto.randomUUID(),
      type: 'text',
      x,
      y,
      text,
      fontSize: 20,
      fontFamily: 'Arial, sans-serif',
      width: 200,
      height: 30,
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): Text {
    return new Text({ ...this.data });
  }

  getBoundingBox(): AABB {
    return {
      minX: this.data.x,
      minY: this.data.y,
      maxX: this.data.x + this.data.width,
      maxY: this.data.y + this.data.height,
    };
  }

  containsPoint(point: Point, threshold: number = 5): boolean {
    const bbox = this.getBoundingBox();
    return (
      point.x >= bbox.minX - threshold &&
      point.x <= bbox.maxX + threshold &&
      point.y >= bbox.minY - threshold &&
      point.y <= bbox.maxY + threshold
    );
  }

  translate(dx: number, dy: number): Text {
    return this.updateData({
      x: this.data.x + dx,
      y: this.data.y + dy,
    }) as Text;
  }

  resize(bounds: AABB): Text {
    return this.updateData({
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
    }) as Text;
  }

  updateText(text: string): Text {
    return this.updateData({ text }) as Text;
  }

  updateFontSize(fontSize: number): Text {
    return this.updateData({ fontSize }) as Text;
  }
}