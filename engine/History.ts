// engine/History.ts

import { Command } from './Commands';
import { Scene } from './Scene';

export class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxStackSize: number = 100;

  constructor(maxStackSize: number = 100) {
    this.maxStackSize = maxStackSize;
  }

  // Execute a command and add to history
  executeCommand(command: Command, scene: Scene): Scene {
    const newScene = command.execute(scene);
    
    // Add to undo stack
    this.undoStack.push(command);
    
    // Limit stack size
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
    
    // Clear redo stack when new command is executed
    this.redoStack = [];
    
    return newScene;
  }

  // Undo last command
  undo(scene: Scene): Scene | null {
    const command = this.undoStack.pop();
    if (!command) return null;
    
    const newScene = command.undo(scene);
    this.redoStack.push(command);
    
    return newScene;
  }

  // Redo last undone command
  redo(scene: Scene): Scene | null {
    const command = this.redoStack.pop();
    if (!command) return null;
    
    const newScene = command.execute(scene);
    this.undoStack.push(command);
    
    return newScene;
  }

  // Check if can undo
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // Check if can redo
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Get undo stack info
  getUndoStackInfo(): string[] {
    return this.undoStack.map(cmd => cmd.description);
  }

  // Get redo stack info
  getRedoStackInfo(): string[] {
    return this.redoStack.map(cmd => cmd.description);
  }

  // Clear history
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  // Clone history
  clone(): History {
    const newHistory = new History(this.maxStackSize);
    newHistory.undoStack = [...this.undoStack];
    newHistory.redoStack = [...this.redoStack];
    return newHistory;
  }
}