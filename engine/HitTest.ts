// engine/HitTest.ts

import { Shape, Point, AABB } from '@/components/Shapes/Shape';
import { Scene } from './Scene';

export class HitTest {
  // Find topmost shape at point
  static getShapeAtPoint(scene: Scene, point: Point, threshold: number = 5): Shape | null {
    const shapes = scene.getAllShapes();
    
    // Iterate in reverse order (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (shape.containsPoint(point, threshold)) {
        return shape;
      }
    }
    
    return null;
  }

  // Find all shapes in rectangle
  static getShapesInRect(scene: Scene, rect: AABB): Shape[] {
    const shapes = scene.getAllShapes();
    const result: Shape[] = [];
    
    for (const shape of shapes) {
      const bbox = shape.getBoundingBox();
      if (this.aabbIntersects(bbox, rect)) {
        result.push(shape);
      }
    }
    
    return result;
  }

  // Check if two AABBs intersect
  private static aabbIntersects(a: AABB, b: AABB): boolean {
    return !(
      a.maxX < b.minX ||
      a.minX > b.maxX ||
      a.maxY < b.minY ||
      a.minY > b.maxY
    );
  }

  // Check if AABB contains another AABB
  static aabbContains(outer: AABB, inner: AABB): boolean {
    return (
      inner.minX >= outer.minX &&
      inner.maxX <= outer.maxX &&
      inner.minY >= outer.minY &&
      inner.maxY <= outer.maxY
    );
  }

  // Get combined bounding box of shapes
  static getCombinedBounds(shapes: Shape[]): AABB | null {
    if (shapes.length === 0) return null;
    
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const shape of shapes) {
      const bbox = shape.getBoundingBox();
      minX = Math.min(minX, bbox.minX);
      minY = Math.min(minY, bbox.minY);
      maxX = Math.max(maxX, bbox.maxX);
      maxY = Math.max(maxY, bbox.maxY);
    }
    
    return { minX, minY, maxX, maxY };
  }

  // Check if point is near shape edge (for resize handles)
  static isNearEdge(bbox: AABB, point: Point, threshold: number = 8): {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  } {
    return {
      top: Math.abs(point.y - bbox.minY) <= threshold,
      right: Math.abs(point.x - bbox.maxX) <= threshold,
      bottom: Math.abs(point.y - bbox.maxY) <= threshold,
      left: Math.abs(point.x - bbox.minX) <= threshold,
    };
  }

  // Get cursor type for resize handle
  static getResizeCursor(edges: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  }): string {
    if ((edges.top && edges.left) || (edges.bottom && edges.right)) {
      return 'nwse-resize';
    }
    if ((edges.top && edges.right) || (edges.bottom && edges.left)) {
      return 'nesw-resize';
    }
    if (edges.top || edges.bottom) {
      return 'ns-resize';
    }
    if (edges.left || edges.right) {
      return 'ew-resize';
    }
    return 'default';
  }
}