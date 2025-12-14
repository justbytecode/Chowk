// components/Canvas/StatusBar.tsx

'use client';

import React from 'react';

interface StatusBarProps {
  shapeCount: number;
  selectedCount: number;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  roughMode: boolean;
}

export function StatusBar({
  shapeCount,
  selectedCount,
  zoom,
  canUndo,
  canRedo,
  roughMode,
}: StatusBarProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center justify-between text-sm z-10">
      {/* Left side - Shape info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Shapes:</span>
          <span className="font-semibold">{shapeCount}</span>
        </div>
        
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Selected:</span>
            <span className="font-semibold text-blue-600">{selectedCount}</span>
          </div>
        )}
      </div>

      {/* Center - Style mode */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded text-xs font-medium ${
          roughMode 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {roughMode ? '✏️ Sketchy' : '📐 Clean'}
        </span>
      </div>

      {/* Right side - Zoom and history */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            disabled={!canUndo}
            className={`px-2 py-1 rounded text-xs ${
              canUndo 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title="Undo (⌘Z)"
          >
            ↶
          </button>
          <button
            disabled={!canRedo}
            className={`px-2 py-1 rounded text-xs ${
              canRedo 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title="Redo (⌘Y)"
          >
            ↷
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Zoom:</span>
          <span className="font-semibold font-mono">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
}