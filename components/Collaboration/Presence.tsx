// components/Collaboration/Presence.tsx

'use client';

import React from 'react';
import { CollaborationUser } from '@/lib/websocket';

interface PresenceProps {
  users: CollaborationUser[];
  currentUserId: string;
}

export function Presence({ users, currentUserId }: PresenceProps) {
  const otherUsers = users.filter(u => u.id !== currentUserId);
  
  if (otherUsers.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-3 z-10 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-gray-700">
          {otherUsers.length} {otherUsers.length === 1 ? 'user' : 'users'} online
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {otherUsers.map(user => (
          <div
            key={user.id}
            className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-gray-700 font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}