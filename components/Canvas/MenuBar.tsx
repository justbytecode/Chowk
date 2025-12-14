// components/Canvas/MenuBar.tsx

'use client';

import React, { useState } from 'react';
import { Scene } from '@/engine/Scene';
import { Viewport } from '@/engine/Viewport';
import { ExportUtils } from '@/lib/export';
import { PDFExport } from '@/lib/pdf-export';
import { useTheme } from '@/components/Tools/ThemeContext';

interface MenuBarProps {
  scene: Scene;
  viewport: Viewport;
  onLoadScene: (scene: Scene) => void;
  boardId?: string;
  onBoardIdChange?: (id: string) => void;
}

export function MenuBar({ scene, viewport, onLoadScene, boardId, onBoardIdChange }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const { theme } = useTheme();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const data = scene.toJSON();
      const viewportData = viewport.toJSON();
      
      if (boardId) {
        const response = await fetch('/api/boards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: boardId, data, viewport: viewportData }),
        });
        if (!response.ok) throw new Error('Failed to save');
        setSaveMessage('✓ Saved');
      } else {
        const boardName = `Board ${new Date().toLocaleString()}`;
        const response = await fetch('/api/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: boardName, data, viewport: viewportData }),
        });
        if (!response.ok) throw new Error('Failed to create board');
        const newBoard = await response.json();
        onBoardIdChange?.(newBoard.id);
        setSaveMessage('✓ Created');
      }
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('✗ Failed');
      setTimeout(() => setSaveMessage(''), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    const boards = await fetch('/api/boards').then(r => r.json());
    if (boards.length === 0) {
      alert('No saved boards found');
      return;
    }
    const boardNames = boards.map((b: any) => `${b.name} (${new Date(b.updatedAt).toLocaleString()})`);
    const selection = prompt(`Select board:\n${boardNames.map((n: string, i: number) => `${i}: ${n}`).join('\n')}`);
    if (selection !== null) {
      const index = parseInt(selection);
      if (index >= 0 && index < boards.length) {
        const board = boards[index];
        const loadedScene = Scene.fromJSON(board.data);
        onLoadScene(loadedScene);
        onBoardIdChange?.(board.id);
        alert('Board loaded!');
      }
    }
    setIsMenuOpen(false);
  };

  const handleExportPNG = async () => {
    try {
      const blob = await ExportUtils.exportToPNG(scene, { scale: 2, padding: 20, backgroundColor: theme.colors.canvas });
      ExportUtils.downloadBlob(blob, `drawing-${Date.now()}.png`);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Export PNG error:', error);
      alert('Failed to export PNG');
    }
  };

  const handleExportSVG = () => {
    try {
      const svg = ExportUtils.exportToSVG(scene, { padding: 20, backgroundColor: theme.colors.canvas });
      ExportUtils.downloadSVG(svg, `drawing-${Date.now()}.svg`);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Export SVG error:', error);
      alert('Failed to export SVG');
    }
  };

  const handleExportPDF = async () => {
    try {
      await PDFExport.exportToPDF(scene, { fileName: `drawing-${Date.now()}.pdf`, scale: 2, padding: 20 });
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Export PDF error:', error);
      alert('Failed to export PDF. Make sure shapes are on canvas.');
    }
  };

  const handleExportJSON = () => {
    const data = { scene: scene.toJSON(), viewport: viewport.toJSON(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    ExportUtils.downloadBlob(blob, `drawing-${Date.now()}.json`);
    setIsMenuOpen(false);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.scene) {
          const loadedScene = Scene.fromJSON(data.scene);
          onLoadScene(loadedScene);
          alert('Drawing imported!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import file');
      }
      setIsMenuOpen(false);
    };
    input.click();
  };

  const handleClearCanvas = () => {
    if (confirm('Clear entire canvas? This cannot be undone.')) {
      onLoadScene(new Scene());
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-xl shadow-2xl px-6 py-3 flex items-center gap-3 transition-all hover:scale-105"
          style={{ backgroundColor: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
        >
          <span className="font-semibold">☰ Menu</span>
          {saveMessage && <span className="text-xs text-green-600">{saveMessage}</span>}
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute top-full mt-2 left-0 rounded-xl shadow-2xl py-2 min-w-[220px]"
              style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
              
              <button onClick={handleSave} disabled={isSaving}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>💾</span><span>{isSaving ? 'Saving...' : boardId ? 'Save' : 'Save As New'}</span>
              </button>

              <button onClick={handleLoad}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>📂</span><span>Load Board</span>
              </button>

              <div className="my-2" style={{ height: '1px', backgroundColor: theme.colors.border }} />

              <button onClick={handleExportPNG}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>🖼️</span><span>Export PNG</span>
              </button>

              <button onClick={handleExportSVG}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>📐</span><span>Export SVG</span>
              </button>

              <button onClick={handleExportPDF}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>📄</span><span>Export PDF</span>
              </button>

              <button onClick={handleExportJSON}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>💾</span><span>Export JSON</span>
              </button>

              <button onClick={handleImportJSON}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                style={{ color: theme.colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>📥</span><span>Import JSON</span>
              </button>

              <div className="my-2" style={{ height: '1px', backgroundColor: theme.colors.border }} />

              <button onClick={handleClearCanvas}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-red-600"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span>🗑️</span><span>Clear Canvas</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}