// lib/rough.ts

import rough from 'roughjs';
import type { RoughCanvas } from 'roughjs/bin/canvas';

let roughCanvas: RoughCanvas | null = null;

export function getRoughCanvas(canvas: HTMLCanvasElement): RoughCanvas {
  if (!roughCanvas) {
    roughCanvas = rough.canvas(canvas);
  }
  return roughCanvas;
}

export function resetRoughCanvas(): void {
  roughCanvas = null;
}