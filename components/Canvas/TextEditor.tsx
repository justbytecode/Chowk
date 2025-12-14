// components/Canvas/TextEditor.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Point } from '@/components/Shapes/Shape';
import { ShapeStyle } from '@/components/Shapes/Shape';

interface TextEditorProps {
  text: string;
  position: Point;
  onSave: (text: string) => void;
  onCancel: () => void;
  style: ShapeStyle;
}

export function TextEditor({ text, position, onSave, onCancel, style }: TextEditorProps) {
  const [value, setValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onSave(value);
    }
    e.stopPropagation();
  };

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onSave(value)}
        className="px-2 py-1 rounded border-2 border-blue-500 focus:outline-none resize-none min-w-[200px] min-h-[30px]"
        style={{
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
          color: style.strokeColor,
          backgroundColor: 'white',
        }}
        rows={3}
        placeholder="Type text here..."
      />
      <div className="mt-1 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        Press Enter or click outside to save, Esc to cancel
      </div>
    </div>
  );
}