// components/Toolbar/ModernToolbar.tsx - FIXED WITH SMALLER ICONS
'use client';

import React, { useState } from 'react';
import { useTool } from '@/components/Tools/ToolContext';
import { useTheme } from '@/components/Tools/ThemeContext';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  Pencil, 
  Type, 
  Image, 
  Eraser, 
  Hand,
} from 'lucide-react';
import { ToolType } from '@/components/Tools/tools';

const toolIcons: Record<ToolType, React.ReactNode> = {
  select: <MousePointer2 size={16} />,
  rectangle: <Square size={16} />,
  circle: <Circle size={16} />,
  line: <Minus size={16} />,
  arrow: <ArrowRight size={16} />,
  freehand: <Pencil size={16} />,
  text: <Type size={16} />,
  image: <Image size={16} />,
  eraser: <Eraser size={16} />,
  pan: <Hand size={16} />,
};

const toolNames: Record<ToolType, string> = {
  select: 'Select',
  rectangle: 'Rectangle',
  circle: 'Circle',
  line: 'Line',
  arrow: 'Arrow',
  freehand: 'Draw',
  text: 'Text',
  image: 'Image',
  eraser: 'Eraser',
  pan: 'Hand',
};

const toolShortcuts: Record<ToolType, string> = {
  select: 'V',
  rectangle: 'R',
  circle: 'C',
  line: 'L',
  arrow: 'A',
  freehand: 'P',
  text: 'T',
  image: 'I',
  eraser: 'E',
  pan: 'H',
};

export function ModernToolbar() {
  const { activeTool, setActiveTool, currentStyle, updateStyle } = useTool();
  const { theme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  const presetColors = [
    '#000000', '#e03131', '#2f9e44', '#1971c2', 
    '#f08c00', '#e64980', '#be4bdb', '#0ca678',
    '#fab005', '#fd7e14', '#868e96', '#ffffff'
  ];

  const strokeWidths = [1, 2, 3, 4, 6, 8];

  const toolOrder: ToolType[] = [
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

  return (
    <>
      {/* Main Vertical Toolbar */}
      <div 
        className="fixed left-3 top-20 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 z-40"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {toolOrder.map((tool, index) => (
          <React.Fragment key={tool}>
            <button
              onClick={() => setActiveTool(tool)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95 group"
              style={{
                backgroundColor: activeTool === tool ? theme.colors.primary : 'transparent',
                color: activeTool === tool ? '#ffffff' : theme.colors.text,
              }}
              title={`${toolNames[tool]} (${toolShortcuts[tool]})`}
              onMouseEnter={(e) => {
                if (activeTool !== tool) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTool !== tool) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {toolIcons[tool]}
              
              {/* Tooltip */}
              <div 
                className="absolute left-full ml-2 px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs font-medium z-50"
                style={{ 
                  backgroundColor: theme.colors.surface, 
                  color: theme.colors.text, 
                  border: `1px solid ${theme.colors.border}` 
                }}
              >
                {toolNames[tool]}
                <span className="ml-2 opacity-60">{toolShortcuts[tool]}</span>
              </div>
            </button>
            
            {(index === 0 || index === toolOrder.length - 2) && (
              <div className="h-px my-0.5 mx-1" style={{ backgroundColor: theme.colors.border }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Properties Panel - Compact */}
      <div 
        className="fixed left-14 top-20 rounded-xl shadow-lg p-2 flex flex-col gap-2 z-40"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Stroke Color */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowStrokePicker(false);
            }}
            className="w-8 h-8 rounded-md border transition-all hover:scale-110 active:scale-95 shadow-sm relative overflow-hidden"
            style={{ 
              backgroundColor: currentStyle.strokeColor,
              borderColor: theme.colors.border
            }}
            title="Stroke color"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </button>

          {showColorPicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPicker(false)}
              />
              <div 
                className="absolute left-full ml-2 top-0 rounded-lg shadow-xl p-2 grid grid-cols-3 gap-1.5 z-50"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      updateStyle({ strokeColor: color });
                      setShowColorPicker(false);
                    }}
                    className="w-7 h-7 rounded border transition-all hover:scale-110 active:scale-95 relative overflow-hidden"
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === currentStyle.strokeColor ? theme.colors.primary : theme.colors.border,
                      borderWidth: color === currentStyle.strokeColor ? '2px' : '1px'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fill Toggle */}
        <button
          onClick={() => {
            updateStyle({ 
              fillColor: currentStyle.fillColor === 'transparent' 
                ? currentStyle.strokeColor 
                : 'transparent' 
            });
          }}
          className="w-8 h-8 rounded-md border transition-all hover:scale-110 active:scale-95 shadow-sm flex items-center justify-center text-base font-bold"
          style={{
            backgroundColor: currentStyle.fillColor !== 'transparent' 
              ? currentStyle.fillColor
              : theme.colors.surfaceHover,
            borderColor: theme.colors.border,
            color: currentStyle.fillColor !== 'transparent' 
              ? '#ffffff' 
              : theme.colors.text,
          }}
          title="Fill"
        >
          {currentStyle.fillColor !== 'transparent' ? '■' : '□'}
        </button>

        {/* Stroke Width */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStrokePicker(!showStrokePicker);
              setShowColorPicker(false);
            }}
            className="w-8 h-8 rounded-md border transition-all hover:scale-110 active:scale-95 shadow-sm flex items-center justify-center"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              borderColor: theme.colors.border,
            }}
            title="Stroke width"
          >
            <div 
              className="rounded-full"
              style={{ 
                width: `${Math.min(currentStyle.strokeWidth * 1.5 + 2, 10)}px`,
                height: `${Math.min(currentStyle.strokeWidth * 1.5 + 2, 10)}px`,
                backgroundColor: theme.colors.text
              }}
            />
          </button>

          {showStrokePicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowStrokePicker(false)}
              />
              <div 
                className="absolute left-full ml-2 top-0 rounded-lg shadow-xl p-1.5 flex flex-col gap-1 z-50"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {strokeWidths.map(width => (
                  <button
                    key={width}
                    onClick={() => {
                      updateStyle({ strokeWidth: width });
                      setShowStrokePicker(false);
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-md transition-all hover:scale-110"
                    style={{ 
                      backgroundColor: width === currentStyle.strokeWidth 
                        ? theme.colors.primary + '20' 
                        : 'transparent',
                      border: width === currentStyle.strokeWidth 
                        ? `1px solid ${theme.colors.primary}` 
                        : 'none'
                    }}
                  >
                    <div 
                      className="rounded-full"
                      style={{ 
                        width: `${width * 1.5}px`,
                        height: `${width * 1.5}px`,
                        backgroundColor: theme.colors.text
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-px my-0.5 mx-1" style={{ backgroundColor: theme.colors.border }} />

        {/* Roughness Slider - Compact */}
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((roughness) => (
            <button
              key={roughness}
              onClick={() => updateStyle({ roughness })}
              className="w-8 h-6 rounded border transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-xs"
              style={{
                backgroundColor: currentStyle.roughness === roughness 
                  ? theme.colors.primary + '20'
                  : theme.colors.surfaceHover,
                borderColor: currentStyle.roughness === roughness 
                  ? theme.colors.primary 
                  : theme.colors.border,
                color: theme.colors.text
              }}
              title={roughness === 0 ? 'Clean' : roughness === 1 ? 'Medium' : 'Rough'}
            >
              {roughness === 0 ? '─' : roughness === 1 ? '≈' : '≋'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}