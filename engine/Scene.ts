// engine/Scene.ts

import { Shape } from '@/components/Shapes/Shape';
import { Rectangle, RectangleData } from '@/components/Shapes/Rectangle';
import { Circle, CircleData } from '@/components/Shapes/Circle';
import { Line, LineData } from '@/components/Shapes/Line';
import { Arrow, ArrowData } from '@/components/Shapes/Arrow';
import { Text, TextData } from '@/components/Shapes/Text';
import { ImageShape, ImageData } from '@/components/Shapes/Image';

export type AnyShapeData = RectangleData | CircleData | LineData | ArrowData | TextData | ImageData;

export class Scene {
  private shapes: Map<string, Shape> = new Map();
  private shapeOrder: string[] = [];

  constructor(shapes: Shape[] = []) {
    shapes.forEach(shape => {
      this.shapes.set(shape.data.id, shape);
      this.shapeOrder.push(shape.data.id);
    });
  }

  addShape(shape: Shape): Scene {
    const newShapes = new Map(this.shapes);
    newShapes.set(shape.data.id, shape);
    const newOrder = [...this.shapeOrder, shape.data.id];
    
    const newScene = new Scene();
    newScene.shapes = newShapes;
    newScene.shapeOrder = newOrder;
    return newScene;
  }

  updateShape(id: string, shape: Shape): Scene {
    if (!this.shapes.has(id)) return this;
    
    const newShapes = new Map(this.shapes);
    newShapes.set(id, shape);
    
    const newScene = new Scene();
    newScene.shapes = newShapes;
    newScene.shapeOrder = [...this.shapeOrder];
    return newScene;
  }

  removeShape(id: string): Scene {
    const newShapes = new Map(this.shapes);
    newShapes.delete(id);
    const newOrder = this.shapeOrder.filter(sid => sid !== id);
    
    const newScene = new Scene();
    newScene.shapes = newShapes;
    newScene.shapeOrder = newOrder;
    return newScene;
  }

  getShape(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  getAllShapes(): Shape[] {
    return this.shapeOrder
      .map(id => this.shapes.get(id))
      .filter((s): s is Shape => s !== undefined);
  }

  getSelectedShapes(): Shape[] {
    return this.getAllShapes().filter(s => s.data.isSelected);
  }

  selectShapes(ids: string[]): Scene {
    let scene: Scene = this;
    const idSet = new Set(ids);
    
    this.getAllShapes().forEach(shape => {
      const shouldBeSelected = idSet.has(shape.data.id);
      if (shape.data.isSelected !== shouldBeSelected) {
        const updated = shouldBeSelected ? shape.select() : shape.deselect();
        scene = scene.updateShape(shape.data.id, updated);
      }
    });
    
    return scene;
  }

  deselectAll(): Scene {
    return this.selectShapes([]);
  }

  bringToFront(id: string): Scene {
    if (!this.shapes.has(id)) return this;
    
    const newOrder = this.shapeOrder.filter(sid => sid !== id);
    newOrder.push(id);
    
    const newScene = new Scene();
    newScene.shapes = new Map(this.shapes);
    newScene.shapeOrder = newOrder;
    return newScene;
  }

  sendToBack(id: string): Scene {
    if (!this.shapes.has(id)) return this;
    
    const newOrder = this.shapeOrder.filter(sid => sid !== id);
    newOrder.unshift(id);
    
    const newScene = new Scene();
    newScene.shapes = new Map(this.shapes);
    newScene.shapeOrder = newOrder;
    return newScene;
  }

  toJSON(): AnyShapeData[] {
    return this.getAllShapes().map(s => s.data);
  }

  static fromJSON(data: AnyShapeData[]): Scene {
    const shapes = data.map(shapeData => {
      switch (shapeData.type) {
        case 'rectangle':
          return new Rectangle(shapeData as RectangleData);
        case 'circle':
          return new Circle(shapeData as CircleData);
        case 'line':
        case 'freehand':
          return new Line(shapeData as LineData);
        case 'arrow':
          return new Arrow(shapeData as ArrowData);
        case 'text':
          return new Text(shapeData as TextData);
        case 'image':
          return new ImageShape(shapeData as ImageData);
        default:
          throw new Error(`Unknown shape type: ${(shapeData as any).type}`);
      }
    });
    
    return new Scene(shapes);
  }

  clone(): Scene {
    return Scene.fromJSON(this.toJSON());
  }
}