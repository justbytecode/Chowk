// components/Navbar/MainNavbar.tsx - FIXED EXCALIDRAW STYLE
'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from '@/components/Tools/ThemeContext';
import { Scene } from '@/engine/Scene';
import { Viewport } from '@/engine/Viewport';
import { Share2, Users, FolderOpen, Image, FileText, Download, Menu, ChevronDown, Sun, Moon } from 'lucide-react';

interface MainNavbarProps {
  scene: Scene;
  viewport: Viewport;
  onLoadScene: (scene: Scene) => void;
  boardId?: string;
  onBoardIdChange?: (id: string) => void;
  onShare?: () => void;
  onTeamManage?: () => void;
}

export function MainNavbar({ 
  scene, 
  viewport, 
  onLoadScene, 
  boardId, 
  onBoardIdChange,
  onShare,
  onTeamManage 
}: MainNavbarProps) {
  const { data: session } = useSession();
  const { theme, themeType, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleExport = (type: 'png' | 'svg' | 'json') => {
    const event = new CustomEvent('export', { detail: { type } });
    window.dispatchEvent(event);
    setShowExportMenu(false);
  };

  const handleSignIn = (provider: 'google' | 'github') => {
    setShowSignInModal(false);
    signIn(provider);
  };

  return (
    <>
      <nav 
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-2"
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div 
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-lg"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-1">
            {/* Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all hover:bg-opacity-80 text-sm font-medium"
                style={{ 
                  backgroundColor: showMenu ? theme.colors.surfaceHover : 'transparent',
                  color: theme.colors.text 
                }}
              >
                <Menu size={14} />
                <ChevronDown size={12} />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div
                    className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-xl py-1 z-50"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <button
                      onClick={async () => {
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
                          }
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: theme.colors.text }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FolderOpen size={14} />
                      <span>Open</span>
                    </button>

                    <div className="my-1 h-px mx-2" style={{ backgroundColor: theme.colors.border }} />

                    <button
                      onClick={() => {
                        if (confirm('Clear entire canvas?')) {
                          onLoadScene(new Scene());
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Clear canvas
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ backgroundColor: theme.colors.border }} />

            {/* Logo */}
            <div className="px-2 text-sm font-semibold whitespace-nowrap" style={{ color: theme.colors.text }}>
              खड़िया 
            </div>
          </div>

          {/* Center Section - Export */}
          <div className="flex items-center gap-1">
            <div className="w-px h-5 mx-1" style={{ backgroundColor: theme.colors.border }} />

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-sm font-medium"
                style={{ 
                  backgroundColor: showExportMenu ? theme.colors.surfaceHover : 'transparent',
                  color: theme.colors.text 
                }}
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={12} />
              </button>

              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <div
                    className="absolute top-full left-0 mt-1 w-40 rounded-lg shadow-xl py-1 z-50"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <button
                      onClick={() => handleExport('png')}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: theme.colors.text }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Image size={14} />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => handleExport('svg')}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: theme.colors.text }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FileText size={14} />
                      <span>SVG</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Share & Team (if logged in) */}
            {session && (
              <>
                <button
                  onClick={onShare}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-sm font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Share2 size={14} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={onTeamManage}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-sm font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Users size={14} />
                  <span className="hidden sm:inline">Team</span>
                </button>
              </>
            )}
          </div>

          {/* Right Section - Theme & User */}
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-px h-5 mx-1" style={{ backgroundColor: theme.colors.border }} />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
              style={{ 
                backgroundColor: 'transparent',
                color: theme.colors.text 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {themeType === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* User Section */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <ChevronDown size={12} style={{ color: theme.colors.text }} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div
                      className="absolute top-full right-0 mt-1 w-48 rounded-lg shadow-xl py-1 z-50"
                      style={{
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <div className="px-3 py-2 border-b" style={{ borderColor: theme.colors.border }}>
                        <p className="text-xs font-medium truncate" style={{ color: theme.colors.text }}>
                          {session.user?.name}
                        </p>
                        <p className="text-xs truncate" style={{ color: theme.colors.textSecondary }}>
                          {session.user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSignInModal(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-xl shadow-2xl p-6"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <h2 
              className="text-xl font-bold mb-1"
              style={{ color: theme.colors.text }}
            >
              Sign in to खड़िया
            </h2>
            <p 
              className="text-sm mb-5"
              style={{ color: theme.colors.textSecondary }}
            >
              Choose your preferred method
            </p>

            <div className="space-y-2">
              {/* Google Sign In */}
              <button
                onClick={() => handleSignIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Continue with Google
                </span>
              </button>

              {/* GitHub Sign In */}
              <button
                onClick={() => handleSignIn('github')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-gray-900 dark:bg-gray-700 text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm font-medium">Continue with GitHub</span>
              </button>
            </div>

            <button
              onClick={() => setShowSignInModal(false)}
              className="mt-4 w-full px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.surfaceHover
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}