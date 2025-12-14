// app/page.tsx - UPDATED VERSION
'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/components/Tools/ThemeContext';
import { ToolProvider } from '@/components/Tools/ToolContext';
import { Canvas } from '@/components/Canvas/Canvas';
import { MainNavbar } from '@/components/Navbar/MainNavbar';
import { ModernToolbar } from '@/components/Toolbar/ModernToolbar';
import { ShareModal } from '@/components/share/ShareModal';
import { TeamModal } from '@/components/Team/TeamModal';
import { Scene } from '@/engine/Scene';
import { Viewport } from '@/engine/Viewport';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [scene, setScene] = useState<Scene>(new Scene());
  const [boardId, setBoardId] = useState<string | undefined>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [viewport] = useState(new Viewport());

  return (
    <ThemeProvider>
      <ToolProvider>
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Modern Navbar */}
          <MainNavbar
            scene={scene}
            viewport={viewport}
            onLoadScene={setScene}
            boardId={boardId}
            onBoardIdChange={setBoardId}
            onShare={() => setShowShareModal(true)}
            onTeamManage={() => setShowTeamModal(true)}
          />

          {/* Welcome Message for First-Time Users */}
          {!session && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md text-center animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  Welcome to खड़िया
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  A beautiful, collaborative board. Sign in to save your work or start drawing as a guest!
                </p>
                <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>✨ Real-time collaboration</span>
                </div>
              </div>
            </div>
          )}

          {/* Modern Vertical Toolbar */}
          <ModernToolbar />

          {/* Canvas */}
          <Canvas 
            initialScene={scene} 
            onSceneChange={setScene}
          />

          {/* Modals */}
          {session && (
            <>
              <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                boardId={boardId}
              />
              <TeamModal
                isOpen={showTeamModal}
                onClose={() => setShowTeamModal(false)}
                boardId={boardId}
              />
            </>
          )}
        </div>
      </ToolProvider>
    </ThemeProvider>
  );
}