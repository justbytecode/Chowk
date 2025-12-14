// app/board/page.tsx

'use client';

import React from 'react';
import { ToolProvider } from '@/components/Tools/ToolContext';
import { Toolbar } from '@/components/Tools/Toolbar';
import { Canvas } from '@/components/Canvas/Canvas';
import { ThemeProvider } from '@/components/Tools/ThemeContext';

export default function BoardPage() {
  return (
    <ThemeProvider>
    <ToolProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
        <Toolbar />
        <Canvas />
        
        {/* Keyboard Shortcuts Panel */}
        <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 text-xs z-10 max-w-xs">
          <div className="font-semibold mb-2 text-gray-700">Keyboard Shortcuts</div>
          <div className="space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Undo</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">⌘Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>Redo</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">⌘Y</kbd>
            </div>
            <div className="flex justify-between">
              <span>Delete</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">Del</kbd>
            </div>
            <div className="flex justify-between">
              <span>Select All</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">⌘A</kbd>
            </div>
            <div className="flex justify-between">
              <span>Toggle Style</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>Zoom</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">⌘Scroll</kbd>
            </div>
            <div className="flex justify-between">
              <span>Pan</span>
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">Shift+Drag</kbd>
            </div>
          </div>
        </div>
      </div>
    </ToolProvider>
    </ThemeProvider>
  );
}