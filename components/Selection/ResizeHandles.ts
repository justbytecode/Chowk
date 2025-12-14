// components/Selection/ResizeHandles.ts

import { Point, AABB } from '@/components/Shapes/Shape';

export type ResizeHandle = 
  | 'nw' | 'n' | 'ne'
  | 'e' | 'se' | 's'
  | 'sw' | 'w'
  | null;

export class ResizeHandles {
  private static HANDLE_SIZE = 8;
  private static DETECTION_THRESHOLD = 12;

  static getHandlePositions(bbox: AABB): Record<ResizeHandle, Point> {
    const cx = (bbox.minX + bbox.maxX) / 2;
    const cy = (bbox.minY + bbox.maxY) / 2;

    return {
      nw: { x: bbox.minX, y: bbox.minY },
      n: { x: cx, y: bbox.minY },
      ne: { x: bbox.maxX, y: bbox.minY },
      e: { x: bbox.maxX, y: cy },
      se: { x: bbox.maxX, y: bbox.maxY },
      s: { x: cx, y: bbox.maxY },
      sw: { x: bbox.minX, y: bbox.maxY },
      w: { x: bbox.minX, y: cy },
      null: { x: 0, y: 0 },
    };
  }

  static getHandleAtPoint(bbox: AABB, point: Point): ResizeHandle {
    const positions = this.getHandlePositions(bbox);
    const threshold = this.DETECTION_THRESHOLD;

    for (const [handle, pos] of Object.entries(positions)) {
      if (handle === 'null') continue;
      
      const dx = Math.abs(point.x - pos.x);
      const dy = Math.abs(point.y - pos.y);

      if (dx <= threshold && dy <= threshold) {
        return handle as ResizeHandle;
      }
    }

    return null;
  }

  static getCursorForHandle(handle: ResizeHandle): string {
    switch (handle) {
      case 'nw':
      case 'se':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      default:
        return 'default';
    }
  }

  static computeNewBounds(
    originalBounds: AABB,
    handle: ResizeHandle,
    delta: Point,
    maintainAspectRatio: boolean = false
  ): AABB {
    let { minX, minY, maxX, maxY } = originalBounds;

    switch (handle) {
      case 'nw':
        minX += delta.x;
        minY += delta.y;
        break;
      case 'n':
        minY += delta.y;
        break;
      case 'ne':
        maxX += delta.x;
        minY += delta.y;
        break;
      case 'e':
        maxX += delta.x;
        break;
      case 'se':
        maxX += delta.x;
        maxY += delta.y;
        break;
      case 's':
        maxY += delta.y;
        break;
      case 'sw':
        minX += delta.x;
        maxY += delta.y;
        break;
      case 'w':
        minX += delta.x;
        break;
    }

    // Ensure minimum size
    const minSize = 10;
    if (maxX - minX < minSize) {
      if (handle?.includes('w')) {
        minX = maxX - minSize;
      } else {
        maxX = minX + minSize;
      }
    }
    if (maxY - minY < minSize) {
      if (handle?.includes('n')) {
        minY = maxY - minSize;
      } else {
        maxY = minY + minSize;
      }
    }

    return { minX, minY, maxX, maxY };
  }
}