// components/Share/ShareModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/Tools/ThemeContext';
import { X, Copy, Link2, Globe, Lock, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId?: string;
}

export function ShareModal({ isOpen, onClose, boardId }: ShareModalProps) {
  const { theme } = useTheme();
  const [shareLink, setShareLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && boardId) {
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}/board/${boardId}`);
    }
  }, [isOpen, boardId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublic = async () => {
    setLoading(true);
    try {
      // Update board privacy settings
      await fetch('/api/boards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: boardId, 
          isPublic: !isPublic 
        }),
      });
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Failed to update privacy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl p-6 z-50"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Share Board
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              color: theme.colors.text
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Privacy Toggle */}
        <div 
          className="flex items-center justify-between p-4 rounded-xl mb-4"
          style={{ backgroundColor: theme.colors.surfaceHover }}
        >
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe size={20} style={{ color: theme.colors.primary }} />
            ) : (
              <Lock size={20} style={{ color: theme.colors.textSecondary }} />
            )}
            <div>
              <div 
                className="font-semibold"
                style={{ color: theme.colors.text }}
              >
                {isPublic ? 'Public Access' : 'Private Board'}
              </div>
              <div 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                {isPublic 
                  ? 'Anyone with the link can view' 
                  : 'Only you can access this board'}
              </div>
            </div>
          </div>
          <button
            onClick={handleTogglePublic}
            disabled={loading}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ 
              backgroundColor: isPublic ? theme.colors.primary : theme.colors.border
            }}
          >
            <div 
              className="absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform top-0.5"
              style={{ 
                transform: isPublic ? 'translateX(24px)' : 'translateX(2px)'
              }}
            />
          </button>
        </div>

        {/* Share Link */}
        <div className="mb-6">
          <label 
            className="block text-sm font-semibold mb-2"
            style={{ color: theme.colors.text }}
          >
            Share Link
          </label>
          <div 
            className="flex items-center gap-2 p-3 rounded-xl border"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              borderColor: theme.colors.border
            }}
          >
            <Link2 
              size={18} 
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.colors.text }}
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{
                backgroundColor: copied ? '#10b981' : theme.colors.primary,
                color: '#ffffff'
              }}
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.surfaceHover,
              color: theme.colors.text
            }}
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff'
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    </>
  );
}