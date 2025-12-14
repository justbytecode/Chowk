// components/Tools/Toolbar.tsx
'use client';

import React, { useState } from 'react';
import { useTool } from './ToolContext';
import { useTheme } from './ThemeContext';
import { TOOLS, TOOL_ORDER } from './tools';

export function Toolbar() {
  const { activeTool, setActiveTool, currentStyle, updateStyle } = useTool();
  const { theme, themeType, toggleTheme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  const presetColors = [
    { color: '#000000', name: 'Black' },
    { color: '#e03131', name: 'Red' },
    { color: '#2f9e44', name: 'Green' },
    { color: '#1971c2', name: 'Blue' },
    { color: '#f08c00', name: 'Orange' },
    { color: '#e64980', name: 'Pink' },
    { color: '#be4bdb', name: 'Purple' },
    { color: '#0ca678', name: 'Teal' },
    { color: '#fab005', name: 'Yellow' },
    { color: '#fd7e14', name: 'Burnt Orange' },
    { color: '#868e96', name: 'Gray' },
    { color: '#ffffff', name: 'White' },
  ];

  const strokeWidths = [1, 2, 3, 4, 6, 8, 12];

  return (
    <>
      {/* Main Vertical Toolbar */}
      <div 
        className="fixed top-1/2 left-6 -translate-y-1/2 rounded-2xl shadow-2xl p-3 flex flex-col gap-2 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: theme.colors.surface + 'F5',
          border: `2px solid ${theme.colors.border}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="text-xs font-semibold text-center mb-1 px-2" style={{ color: theme.colors.textSecondary }}>
          TOOLS
        </div>
        
        {TOOL_ORDER.map(toolType => {
          const tool = TOOLS[toolType];
          const isActive = activeTool === toolType;
          
          return (
            <button
              key={toolType}
              onClick={() => setActiveTool(toolType)}
              className="relative w-12 h-12 flex items-center justify-center rounded-xl text-xl transition-all hover:scale-110 active:scale-95 group"
              style={{
                backgroundColor: isActive 
                  ? 'linear-gradient(135deg, ' + theme.colors.primary + ' 0%, ' + theme.colors.primaryHover + ' 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : theme.colors.text,
                boxShadow: isActive ? '0 4px 12px rgba(0, 102, 255, 0.3)' : 'none',
              }}
              title={tool.description}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className={isActive ? 'animate-pulse' : ''}>{tool.icon}</span>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-sm font-medium"
                style={{ backgroundColor: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}>
                {tool.name}
                <div className="text-xs opacity-70">{tool.description}</div>
              </div>
            </button>
          );
        })}

        <div 
          className="my-2 h-px"
          style={{ backgroundColor: theme.colors.border }}
        />

        {/* Undo/Redo */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
            window.dispatchEvent(event);
          }}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-lg transition-all hover:scale-110 active:scale-95"
          style={{ color: theme.colors.text }}
          title="Undo (Ctrl+Z)"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ↶
        </button>
        
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
            window.dispatchEvent(event);
          }}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-lg transition-all hover:scale-110 active:scale-95"
          style={{ color: theme.colors.text }}
          title="Redo (Ctrl+Y)"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ↷
        </button>
      </div>

      {/* Top Properties Panel */}
      <div 
        className="fixed top-6 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl p-4 flex items-center gap-5 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: theme.colors.surface + 'F5',
          border: `2px solid ${theme.colors.border}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Stroke Color */}
        <div className="relative">
          <div className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
            COLOR
          </div>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 active:scale-95 shadow-md relative overflow-hidden"
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
                className="absolute top-full mt-3 left-0 rounded-xl shadow-2xl p-4 grid grid-cols-4 gap-3 z-50 backdrop-blur-md"
                style={{ 
                  backgroundColor: theme.colors.surface + 'F5',
                  border: `2px solid ${theme.colors.border}`
                }}
              >
                {presetColors.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => {
                      updateStyle({ strokeColor: color });
                      setShowColorPicker(false);
                    }}
                    className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 shadow-md relative overflow-hidden group"
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === currentStyle.strokeColor ? theme.colors.primary : theme.colors.border,
                      boxShadow: color === currentStyle.strokeColor ? `0 0 0 3px ${theme.colors.primary}40` : 'none'
                    }}
                    title={name}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <input
                  type="color"
                  value={currentStyle.strokeColor}
                  onChange={(e) => updateStyle({ strokeColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer col-span-4 border-2"
                  style={{ borderColor: theme.colors.border }}
                />
              </div>
            </>
          )}
        </div>

        <div className="w-px h-14" style={{ backgroundColor: theme.colors.border }} />

        {/* Stroke Width */}
        <div className="relative">
          <div className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
            THICKNESS
          </div>
          <button
            onClick={() => setShowStrokePicker(!showStrokePicker)}
            className="px-4 py-2 rounded-xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              color: theme.colors.text,
              border: `2px solid ${theme.colors.border}`
            }}
            title="Stroke width"
          >
            <div 
              className="rounded-full shadow-sm"
              style={{ 
                width: `${Math.min(currentStyle.strokeWidth * 2 + 4, 16)}px`,
                height: `${Math.min(currentStyle.strokeWidth * 2 + 4, 16)}px`,
                backgroundColor: theme.colors.text
              }}
            />
            <span className="text-sm font-bold">{currentStyle.strokeWidth}px</span>
          </button>

          {showStrokePicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowStrokePicker(false)}
              />
              <div 
                className="absolute top-full mt-3 left-0 rounded-xl shadow-2xl p-3 flex flex-col gap-2 z-50 backdrop-blur-md"
                style={{ 
                  backgroundColor: theme.colors.surface + 'F5',
                  border: `2px solid ${theme.colors.border}`
                }}
              >
                {strokeWidths.map(width => (
                  <button
                    key={width}
                    onClick={() => {
                      updateStyle({ strokeWidth: width });
                      setShowStrokePicker(false);
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: width === currentStyle.strokeWidth ? theme.colors.primary + '20' : 'transparent',
                      color: theme.colors.text,
                      border: width === currentStyle.strokeWidth ? `2px solid ${theme.colors.primary}` : '2px solid transparent'
                    }}
                  >
                    <div 
                      className="rounded-full shadow-sm"
                      style={{ 
                        width: `${width * 2 + 4}px`,
                        height: `${width * 2 + 4}px`,
                        backgroundColor: theme.colors.text
                      }}
                    />
                    <span className="text-sm font-semibold min-w-[40px]">{width}px</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-14" style={{ backgroundColor: theme.colors.border }} />

        {/* Fill Toggle */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
            FILL
          </div>
          <button
            onClick={() => {
              updateStyle({ 
                fillColor: currentStyle.fillColor === 'transparent' 
                  ? currentStyle.strokeColor 
                  : 'transparent' 
              });
            }}
            className="px-4 py-2 rounded-xl text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: currentStyle.fillColor !== 'transparent' 
                ? theme.colors.primary 
                : theme.colors.surfaceHover,
              color: currentStyle.fillColor !== 'transparent' 
                ? '#ffffff' 
                : theme.colors.text,
              border: `2px solid ${theme.colors.border}`
            }}
            title="Toggle fill"
          >
            {currentStyle.fillColor !== 'transparent' ? '■' : '□'}
          </button>
        </div>

        <div className="w-px h-14" style={{ backgroundColor: theme.colors.border }} />

        {/* Roughness Slider */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
            SKETCH LEVEL
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={currentStyle.roughness}
              onChange={(e) => updateStyle({ roughness: Number(e.target.value) })}
              className="w-24 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary} 0%, ${theme.colors.primary} ${(currentStyle.roughness / 3) * 100}%, ${theme.colors.border} ${(currentStyle.roughness / 3) * 100}%, ${theme.colors.border} 100%)`
              }}
              title="Roughness"
            />
            <span className="text-sm font-bold min-w-[30px]" style={{ color: theme.colors.text }}>
              {currentStyle.roughness.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="w-px h-14" style={{ backgroundColor: theme.colors.border }} />

        {/* Theme Toggle */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
            THEME
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all hover:scale-110 active:scale-95 shadow-md"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              color: theme.colors.text,
              border: `2px solid ${theme.colors.border}`
            }}
            title={`Switch to ${themeType === 'light' ? 'dark' : 'light'} mode`}
          >
            {themeType === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </>
  );
}