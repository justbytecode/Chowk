// components/Canvas/Canvas.tsx (Enhanced Version)
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Scene } from '@/engine/Scene';
import { Renderer } from './Renderer';
import { RoughRenderer } from './RoughRenderer';
import { HitTest } from '@/engine/HitTest';
import { History } from '@/engine/History';
import { Viewport } from '@/engine/Viewport';
import { AddShapeCommand, DeleteShapesCommand } from '@/engine/Commands';
import { useTool } from '@/components/Tools/ToolContext';
import { useTheme } from '@/components/Tools/ThemeContext';
import { Point, Shape, AABB } from '@/components/Shapes/Shape';
import { Rectangle } from '@/components/Shapes/Rectangle';
import { Circle } from '@/components/Shapes/Circle';
import { Line } from '@/components/Shapes/Line';
import { Arrow } from '@/components/Shapes/Arrow';
import { Text } from '@/components/Shapes/Text';
import { ImageShape } from '@/components/Shapes/Image';
import { SelectionBox } from '@/components/Selection/SelectionBox';
import { ResizeHandles, ResizeHandle } from '@/components/Selection/ResizeHandles';
import { TextEditor } from './TextEditor';
import { useSession } from 'next-auth/react';

interface CanvasProps {
  initialScene?: Scene;
  onSceneChange?: (scene: Scene) => void;
}

export function Canvas({ initialScene, onSceneChange }: CanvasProps) {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scene, setScene] = useState<Scene>(initialScene || new Scene());
  const [history] = useState<History>(new History());
  const [viewport, setViewport] = useState<Viewport>(new Viewport());
  const [renderer, setRenderer] = useState<Renderer | null>(null);
  const [roughRenderer, setRoughRenderer] = useState<RoughRenderer | null>(null);
  const [useRoughStyle, setUseRoughStyle] = useState(true);
  const { activeTool, currentStyle } = useTool();
  const { theme } = useTheme();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [draggedShapes, setDraggedShapes] = useState<Shape[]>([]);
  const [dragStartPos, setDragStartPos] = useState<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [resizingShape, setResizingShape] = useState<Shape | null>(null);
  const [originalBounds, setOriginalBounds] = useState<AABB | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [editingText, setEditingText] = useState<Text | null>(null);
  const [textEditorPos, setTextEditorPos] = useState<Point | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      setRenderer(new Renderer(ctx, theme));
      setRoughRenderer(new RoughRenderer(canvas, ctx));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  // Update theme
  useEffect(() => {
    if (renderer) renderer.updateTheme(theme);
  }, [theme, renderer]);

  // Render scene
  useEffect(() => {
    if (!renderer || !roughRenderer || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    viewport.applyTransform(ctx);

    if (useRoughStyle) {
      roughRenderer.renderScene(scene);
    } else {
      renderer.renderScene(scene);
    }

    if (selectionBox) selectionBox.render(ctx);
    viewport.resetTransform(ctx);
  }, [scene, renderer, roughRenderer, viewport, useRoughStyle, selectionBox]);

  // Notify parent of scene changes
  useEffect(() => {
    onSceneChange?.(scene);
  }, [scene, onSceneChange]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return viewport.screenToCanvas({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const point = { x: viewport.x + 100, y: viewport.y + 100 };
        const imageShape = ImageShape.create(
          point.x, point.y,
          event.target?.result as string,
          img.width, img.height,
          currentStyle
        );
        const cmd = new AddShapeCommand(imageShape);
        setScene(history.executeCommand(cmd, scene));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    setStartPoint(point);

    if (activeTool === 'image') {
      fileInputRef.current?.click();
      return;
    }

    if (activeTool === 'eraser') {
      const shape = HitTest.getShapeAtPoint(scene, point);
      if (shape) {
        const cmd = new DeleteShapesCommand([shape]);
        setScene(history.executeCommand(cmd, scene));
      }
      setIsDrawing(true);
      return;
    }

    if (activeTool === 'pan' || e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart(point);
      return;
    }

    if (activeTool === 'select') {
      const selected = scene.getSelectedShapes();
      if (selected.length === 1) {
        const bbox = selected[0].getBoundingBox();
        const handle = ResizeHandles.getHandleAtPoint(bbox, point);
        if (handle) {
          setResizeHandle(handle);
          setResizingShape(selected[0]);
          setOriginalBounds(bbox);
          setIsDrawing(true);
          return;
        }
      }

      const shape = HitTest.getShapeAtPoint(scene, point);
      if (shape) {
        if (shape instanceof Text && e.detail === 2) {
          setEditingText(shape as Text);
          const screenPos = viewport.canvasToScreen({ x: shape.data.x, y: shape.data.y });
          setTextEditorPos(screenPos);
          return;
        }

        if (!shape.data.isSelected) {
          setScene(scene.selectShapes([shape.data.id]));
          setDraggedShapes([shape]);
        } else {
          setDraggedShapes(scene.getSelectedShapes());
        }
        setDragStartPos(point);
        setIsDrawing(true);
      } else {
        setScene(scene.deselectAll());
        setSelectionBox(new SelectionBox(point));
        setIsDrawing(true);
      }
      return;
    }

    setIsDrawing(true);

    let newShape: Shape | null = null;
    switch (activeTool) {
      case 'rectangle':
        newShape = Rectangle.create(point.x, point.y, 0, 0, currentStyle);
        break;
      case 'circle':
        newShape = Circle.create(point.x, point.y, 0, currentStyle);
        break;
      case 'line':
        newShape = Line.create(point, 'line', currentStyle);
        break;
      case 'arrow':
        newShape = Arrow.create(point, point, currentStyle);
        break;
      case 'freehand':
        newShape = Line.create(point, 'freehand', currentStyle);
        break;
      case 'text':
        newShape = Text.create(point.x, point.y, '', currentStyle);
        setEditingText(newShape as Text);
        const screenPos = viewport.canvasToScreen(point);
        setTextEditorPos(screenPos);
        setIsDrawing(false);
        return;
    }
    if (newShape) setCurrentShape(newShape);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    if (activeTool === 'eraser' && isDrawing) {
      const shape = HitTest.getShapeAtPoint(scene, point);
      if (shape) {
        const cmd = new DeleteShapesCommand([shape]);
        setScene(history.executeCommand(cmd, scene));
      }
      return;
    }

    if (activeTool === 'select' && !isDrawing) {
      const selected = scene.getSelectedShapes();
      if (selected.length === 1) {
        const bbox = selected[0].getBoundingBox();
        const handle = ResizeHandles.getHandleAtPoint(bbox, point);
        if (handle && canvasRef.current) {
          canvasRef.current.style.cursor = ResizeHandles.getCursorForHandle(handle);
          return;
        }
      }
      if (canvasRef.current) canvasRef.current.style.cursor = 'default';
    }

    if (!isDrawing || !startPoint) return;

    if (isPanning && panStart) {
      const dx = point.x - panStart.x;
      const dy = point.y - panStart.y;
      setViewport(viewport.pan(dx, dy));
      setPanStart(point);
      return;
    }

    if (resizeHandle && resizingShape && originalBounds) {
      const delta = { x: point.x - startPoint.x, y: point.y - startPoint.y };
      const newBounds = ResizeHandles.computeNewBounds(originalBounds, resizeHandle, delta);
      const resized = resizingShape.resize(newBounds);
      setScene(scene.updateShape(resized.data.id, resized));
      return;
    }

    if (activeTool === 'select' && draggedShapes.length > 0 && dragStartPos) {
      const dx = point.x - dragStartPos.x;
      const dy = point.y - dragStartPos.y;
      let newScene = scene;
      for (const shape of draggedShapes) {
        const moved = shape.translate(dx, dy);
        newScene = newScene.updateShape(moved.data.id, moved);
      }
      setScene(newScene);
      setDragStartPos(point);
      return;
    }

    if (selectionBox) {
      const updated = selectionBox.update(point);
      setSelectionBox(updated);
      const bounds = updated.getBounds();
      const shapesInBox = HitTest.getShapesInRect(scene, bounds);
      setScene(scene.selectShapes(shapesInBox.map(s => s.data.id)));
      return;
    }

    if (currentShape) {
      let updatedShape: Shape = currentShape;
      
      if (currentShape instanceof Rectangle) {
        const width = point.x - startPoint.x;
        const height = point.y - startPoint.y;
        updatedShape = Rectangle.create(startPoint.x, startPoint.y, width, height, currentStyle);
        updatedShape = updatedShape.updateData({ id: currentShape.data.id }) as Rectangle;
      } else if (currentShape instanceof Circle) {
        const dx = point.x - startPoint.x;
        const dy = point.y - startPoint.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        updatedShape = Circle.create(startPoint.x, startPoint.y, radius, currentStyle);
        updatedShape = updatedShape.updateData({ id: currentShape.data.id }) as Circle;
      } else if (currentShape instanceof Arrow) {
        updatedShape = Arrow.create(startPoint, point, currentStyle);
        updatedShape = updatedShape.updateData({ id: currentShape.data.id }) as Arrow;
      } else if (currentShape instanceof Line) {
        if (currentShape.data.type === 'freehand') {
          const lastPoint = currentShape.data.points[currentShape.data.points.length - 1];
          const dist = Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2));
          if (dist > 2) {
            updatedShape = currentShape.addPoint(point);
          } else {
            updatedShape = currentShape;
          }
        } else {
          updatedShape = Line.create(startPoint, currentShape.data.type, currentStyle);
          updatedShape = (updatedShape as Line).addPoint(point);
          updatedShape = updatedShape.updateData({ id: currentShape.data.id }) as Line;
        }
      }
      
      setCurrentShape(updatedShape);
      if (scene.getShape(updatedShape.data.id)) {
        setScene(scene.updateShape(updatedShape.data.id, updatedShape));
      } else {
        setScene(scene.addShape(updatedShape));
      }
    }
  };

  const handleMouseUp = () => {
    if (currentShape && isDrawing && activeTool !== 'text') {
      const cmd = new AddShapeCommand(currentShape);
      setScene(history.executeCommand(cmd, scene));
      setCurrentShape(null);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setDraggedShapes([]);
    setDragStartPos(null);
    setSelectionBox(null);
    setResizeHandle(null);
    setResizingShape(null);
    setOriginalBounds(null);
    setIsPanning(false);
    setPanStart(null);
    
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 
        activeTool === 'select' ? 'default' : 
        activeTool === 'pan' ? 'grab' : 
        'crosshair';
    }
  };

  const handleTextSave = (text: string) => {
    if (editingText) {
      if (text.trim()) {
        const updated = editingText.updateText(text);
        if (scene.getShape(editingText.data.id)) {
          setScene(scene.updateShape(editingText.data.id, updated));
        } else {
          const cmd = new AddShapeCommand(updated);
          setScene(history.executeCommand(cmd, scene));
        }
      }
      setEditingText(null);
      setTextEditorPos(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const newScene = history.undo(scene);
        if (newScene) setScene(newScene);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const newScene = history.redo(scene);
        if (newScene) setScene(newScene);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !editingText) {
        const selected = scene.getSelectedShapes();
        if (selected.length > 0) {
          e.preventDefault();
          const cmd = new DeleteShapesCommand(selected);
          setScene(history.executeCommand(cmd, scene));
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const all = scene.getAllShapes();
        setScene(scene.selectShapes(all.map(s => s.data.id)));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, history, editingText]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const point = getMousePos(e);
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setViewport(viewport.zoomAt(point, delta));
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      
      {editingText && textEditorPos && (
        <TextEditor
          text={editingText.data.text}
          position={textEditorPos}
          onSave={handleTextSave}
          onCancel={() => {
            setEditingText(null);
            setTextEditorPos(null);
          }}
          style={editingText.data.style}
        />
      )}
      
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="absolute inset-0 cursor-crosshair"
      />
      
      {/* Status Bar */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-6 z-10"
        style={{
          backgroundColor: theme.colors.surface + 'F5',
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: theme.colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
            {scene.getAllShapes().length} objects
          </span>
        </div>
        
        <div className="w-px h-6" style={{ backgroundColor: theme.colors.border }} />
        
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: theme.colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
            {Math.round(viewport.zoom * 100)}%
          </span>
        </div>
        
        <div className="w-px h-6" style={{ backgroundColor: theme.colors.border }} />
        
        <button
          onClick={() => setUseRoughStyle(!useRoughStyle)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: useRoughStyle ? theme.colors.primary : theme.colors.surfaceHover,
            color: useRoughStyle ? '#ffffff' : theme.colors.text,
          }}
        >
          {useRoughStyle ? '✨ Sketchy' : '📐 Clean'}
        </button>
      </div>
    </>
  );
}