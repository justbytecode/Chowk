// components/Tools/tools.ts
export type ToolType = 
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'freehand'
  | 'text'
  | 'image'
  | 'eraser'
  | 'pan';

export interface Tool {
  type: ToolType;
  name: string;
  icon: string;
  cursor: string;
  description: string;
}

export const TOOLS: Record<ToolType, Tool> = {
  select: {
    type: 'select',
    name: 'Select',
    icon: '↖',
    cursor: 'default',
    description: 'Select and move shapes'
  },
  rectangle: {
    type: 'rectangle',
    name: 'Rectangle',
    icon: '▭',
    cursor: 'crosshair',
    description: 'Draw rectangles'
  },
  circle: {
    type: 'circle',
    name: 'Circle',
    icon: '○',
    cursor: 'crosshair',
    description: 'Draw circles'
  },
  line: {
    type: 'line',
    name: 'Line',
    icon: '/',
    cursor: 'crosshair',
    description: 'Draw straight lines'
  },
  arrow: {
    type: 'arrow',
    name: 'Arrow',
    icon: '→',
    cursor: 'crosshair',
    description: 'Draw arrows'
  },
  freehand: {
    type: 'freehand',
    name: 'Pencil',
    icon: '✎',
    cursor: 'crosshair',
    description: 'Draw freehand'
  },
  text: {
    type: 'text',
    name: 'Text',
    icon: 'T',
    cursor: 'text',
    description: 'Add text'
  },
  image: {
    type: 'image',
    name: 'Image',
    icon: '🖼',
    cursor: 'crosshair',
    description: 'Add image'
  },
  eraser: {
    type: 'eraser',
    name: 'Eraser',
    icon: '🧹',
    cursor: 'crosshair',
    description: 'Erase shapes'
  },
  pan: {
    type: 'pan',
    name: 'Pan',
    icon: '✋',
    cursor: 'grab',
    description: 'Pan canvas'
  }
};

export const TOOL_ORDER: ToolType[] = [
  'select',
  'rectangle',
  'circle',
  'line',
  'arrow',
  'freehand',
  'text',
  'image',
  'eraser',
  'pan'
];