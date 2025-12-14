// components/Shapes/Image.ts

import { Shape, BaseShape, Point, AABB, DEFAULT_STYLE, ShapeStyle } from './Shape';

export interface ImageData extends BaseShape {
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  src: string; // base64 or URL
  naturalWidth: number;
  naturalHeight: number;
  scale: number;
}

export class ImageShape extends Shape<ImageData> {
  private imageElement: HTMLImageElement | null = null;

  static create(
    x: number,
    y: number,
    src: string,
    naturalWidth: number,
    naturalHeight: number,
    style: Partial<ShapeStyle> = {}
  ): ImageShape {
    const maxSize = 400;
    const scale = Math.min(maxSize / naturalWidth, maxSize / naturalHeight, 1);
    
    return new ImageShape({
      id: crypto.randomUUID(),
      type: 'image',
      x,
      y,
      width: naturalWidth * scale,
      height: naturalHeight * scale,
      src,
      naturalWidth,
      naturalHeight,
      scale,
      style: { ...DEFAULT_STYLE, ...style },
      isSelected: false,
      version: 0,
    });
  }

  clone(): ImageShape {
    const cloned = new ImageShape({ ...this.data });
    cloned.imageElement = this.imageElement;
    return cloned;
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

  translate(dx: number, dy: number): ImageShape {
    return this.updateData({
      x: this.data.x + dx,
      y: this.data.y + dy,
    }) as ImageShape;
  }

  resize(bounds: AABB): ImageShape {
    return this.updateData({
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
    }) as ImageShape;
  }

  async loadImage(): Promise<HTMLImageElement> {
    if (this.imageElement) return this.imageElement;

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.imageElement = img;
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = this.data.src;
    });
  }

  getImageElement(): HTMLImageElement | null {
    return this.imageElement;
  }
}