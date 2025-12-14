// components/Tools/ToolContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToolType } from './tools';
import { ShapeStyle, DEFAULT_STYLE } from '@/components/Shapes/Shape';

interface ToolContextType {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  currentStyle: ShapeStyle;
  updateStyle: (style: Partial<ShapeStyle>) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [currentStyle, setCurrentStyle] = useState<ShapeStyle>(DEFAULT_STYLE);

  const updateStyle = (style: Partial<ShapeStyle>) => {
    setCurrentStyle(prev => ({ ...prev, ...style }));
  };

  return (
    <ToolContext.Provider
      value={{
        activeTool,
        setActiveTool,
        currentStyle,
        updateStyle,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTool must be used within ToolProvider');
  }
  return context;
}