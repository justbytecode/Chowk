// components/Collaboration/Cursors.tsx

'use client';

import React from 'react';
import { CollaborationUser } from '@/lib/websocket';
import { Viewport } from '@/engine/Viewport';

interface CursorsProps {
  users: CollaborationUser[];
  viewport: Viewport;
  currentUserId: string;
}

export function Cursors({ users, viewport, currentUserId }: CursorsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {users
        .filter(user => user.id !== currentUserId && user.cursor)
        .map(user => {
          if (!user.cursor) return null;
          
          const screenPos = viewport.canvasToScreen(user.cursor);
          
          return (
            <div
              key={user.id}
              className="absolute transition-all duration-100 ease-out"
              style={{
                left: screenPos.x,
                top: screenPos.y,
                transform: 'translate(-2px, -2px)',
              }}
            >
              {/* Cursor SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.65376 12.3673L13.6319 4.38913L15.2656 11.8976L19.4138 16.0458L17.8 17.6596L13.6519 13.5115L6.14319 15.1453L5.65376 12.3673Z"
                  fill={user.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              
              {/* User name label */}
              <div
                className="absolute left-6 top-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </div>
            </div>
          );
        })}
    </div>
  );
}