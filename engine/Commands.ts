// engine/Commands.ts

import { Scene } from './Scene';
import { Shape } from '@/components/Shapes/Shape';

export interface Command {
  execute(scene: Scene): Scene;
  undo(scene: Scene): Scene;
  description: string;
}

// Add shape command
export class AddShapeCommand implements Command {
  description: string;

  constructor(private shape: Shape) {
    this.description = `Add ${shape.data.type}`;
  }

  execute(scene: Scene): Scene {
    return scene.addShape(this.shape);
  }

  undo(scene: Scene): Scene {
    return scene.removeShape(this.shape.data.id);
  }
}

// Remove shape command
export class RemoveShapeCommand implements Command {
  description: string;

  constructor(private shape: Shape) {
    this.description = `Remove ${shape.data.type}`;
  }

  execute(scene: Scene): Scene {
    return scene.removeShape(this.shape.data.id);
  }

  undo(scene: Scene): Scene {
    return scene.addShape(this.shape);
  }
}

// Update shape command
export class UpdateShapeCommand implements Command {
  description: string;

  constructor(
    private shapeId: string,
    private oldShape: Shape,
    private newShape: Shape
  ) {
    this.description = `Update ${newShape.data.type}`;
  }

  execute(scene: Scene): Scene {
    return scene.updateShape(this.shapeId, this.newShape);
  }

  undo(scene: Scene): Scene {
    return scene.updateShape(this.shapeId, this.oldShape);
  }
}

// Move shapes command
export class MoveShapesCommand implements Command {
  description = 'Move shapes';

  constructor(
    private shapeIds: string[],
    private dx: number,
    private dy: number
  ) {}

  execute(scene: Scene): Scene {
    let newScene = scene;
    for (const id of this.shapeIds) {
      const shape = scene.getShape(id);
      if (shape) {
        const moved = shape.translate(this.dx, this.dy);
        newScene = newScene.updateShape(id, moved);
      }
    }
    return newScene;
  }

  undo(scene: Scene): Scene {
    let newScene = scene;
    for (const id of this.shapeIds) {
      const shape = scene.getShape(id);
      if (shape) {
        const moved = shape.translate(-this.dx, -this.dy);
        newScene = newScene.updateShape(id, moved);
      }
    }
    return newScene;
  }
}

// Delete shapes command
export class DeleteShapesCommand implements Command {
  description = 'Delete shapes';
  private shapes: Shape[] = [];

  constructor(shapes: Shape[]) {
    this.shapes = shapes;
  }

  execute(scene: Scene): Scene {
    let newScene = scene;
    for (const shape of this.shapes) {
      newScene = newScene.removeShape(shape.data.id);
    }
    return newScene;
  }

  undo(scene: Scene): Scene {
    let newScene = scene;
    for (const shape of this.shapes) {
      newScene = newScene.addShape(shape);
    }
    return newScene;
  }
}

// Batch command (for grouping multiple commands)
export class BatchCommand implements Command {
  description: string;

  constructor(private commands: Command[], description: string = 'Batch operation') {
    this.description = description;
  }

  execute(scene: Scene): Scene {
    let newScene = scene;
    for (const cmd of this.commands) {
      newScene = cmd.execute(newScene);
    }
    return newScene;
  }

  undo(scene: Scene): Scene {
    let newScene = scene;
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      newScene = this.commands[i].undo(newScene);
    }
    return newScene;
  }
}