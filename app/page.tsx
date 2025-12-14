// app/page.tsx
'use client';

import React from 'react';
import { ThemeProvider } from '@/components/Tools/ThemeContext';
import { ToolProvider } from '@/components/Tools/ToolContext';
import { Toolbar } from '@/components/Tools/Toolbar';
import { Canvas } from '@/components/Canvas/Canvas';
import { AuthButton } from '@/components/Auth/AuthButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <ThemeProvider>
      <ToolProvider>
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Floating Auth Button */}
          <div className="absolute top-4 right-4 z-50">
            <AuthButton />
          </div>

          {/* Welcome Message for First-Time Users */}
          {!session && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md text-center animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Welcome to Champari Draw
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  A beautiful, collaborative whiteboard. Sign in to save your work or start drawing as a guest!
                </p>
                <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>✨ Real-time collaboration</span>
                  <span>•</span>
                  <span>🎨 Beautiful sketchy style</span>
                </div>
              </div>
            </div>
          )}

          <Toolbar />
          <Canvas />
        </div>
      </ToolProvider>
    </ThemeProvider>
  );
}