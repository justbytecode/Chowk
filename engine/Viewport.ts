// engine/Viewport.ts

import { Point } from '@/components/Shapes/Shape';

export class Viewport {
  // Camera position (offset)
  public x: number = 0;
  public y: number = 0;
  
  // Zoom level (1.0 = 100%)
  public zoom: number = 1.0;
  
  // Zoom limits
  private minZoom: number = 0.1;
  private maxZoom: number = 5.0;

  constructor(x: number = 0, y: number = 0, zoom: number = 1.0) {
    this.x = x;
    this.y = y;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }

  // Pan viewport
  pan(dx: number, dy: number): Viewport {
    return new Viewport(this.x + dx, this.y + dy, this.zoom);
  }

  // Zoom viewport at a specific point
  zoomAt(point: Point, delta: number): Viewport {
    const newZoom = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, this.zoom * (1 + delta))
    );

    if (newZoom === this.zoom) return this;

    // Zoom towards the point
    const scale = newZoom / this.zoom;
    const newX = point.x - (point.x - this.x) * scale;
    const newY = point.y - (point.y - this.y) * scale;

    return new Viewport(newX, newY, newZoom);
  }

  // Zoom in
  zoomIn(centerPoint?: Point): Viewport {
    const point = centerPoint || { x: this.x, y: this.y };
    return this.zoomAt(point, 0.1);
  }

  // Zoom out
  zoomOut(centerPoint?: Point): Viewport {
    const point = centerPoint || { x: this.x, y: this.y };
    return this.zoomAt(point, -0.1);
  }

  // Reset viewport
  reset(): Viewport {
    return new Viewport(0, 0, 1.0);
  }

  // Convert screen coordinates to canvas coordinates
  screenToCanvas(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.x) / this.zoom,
      y: (screenPoint.y - this.y) / this.zoom,
    };
  }

  // Convert canvas coordinates to screen coordinates
  canvasToScreen(canvasPoint: Point): Point {
    return {
      x: canvasPoint.x * this.zoom + this.x,
      y: canvasPoint.y * this.zoom + this.y,
    };
  }

  // Apply viewport transform to canvas context
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, this.x, this.y);
  }

  // Reset transform
  resetTransform(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Clone viewport
  clone(): Viewport {
    return new Viewport(this.x, this.y, this.zoom);
  }

  // Serialize
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      zoom: this.zoom,
    };
  }

  // Deserialize
  static fromJSON(data: { x: number; y: number; zoom: number }): Viewport {
    return new Viewport(data.x, data.y, data.zoom);
  }
}