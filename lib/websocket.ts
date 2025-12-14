// lib/websocket.ts

import { Scene } from '@/engine/Scene';
import { Point } from '@/components/Shapes/Shape';

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor: Point | null;
}

export interface WebSocketMessage {
  type: 'scene-update' | 'cursor-move' | 'user-join' | 'user-leave' | 'ping';
  userId: string;
  data?: any;
  timestamp: number;
}

export class CollaborationManager {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  
  constructor(
    private boardId: string,
    private userId: string,
    private userName: string,
    private userColor: string,
    private onSceneUpdate: (scene: Scene) => void,
    private onUsersUpdate: (users: CollaborationUser[]) => void
  ) {}

  connect(wsUrl: string = 'ws://localhost:3001'): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(`${wsUrl}?boardId=${this.boardId}&userId=${this.userId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        
        // Send user info
        this.send({
          type: 'user-join',
          userId: this.userId,
          data: {
            name: this.userName,
            color: this.userColor,
          },
          timestamp: Date.now(),
        });

        // Start ping interval
        this.pingInterval = setInterval(() => {
          this.send({
            type: 'ping',
            userId: this.userId,
            timestamp: Date.now(),
          });
        }, 30000);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.cleanup();
        
        // Attempt reconnect after 3 seconds
        this.reconnectTimeout = setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect(wsUrl);
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
    }
  }

  disconnect(): void {
    this.cleanup();
    
    if (this.ws) {
      this.send({
        type: 'user-leave',
        userId: this.userId,
        timestamp: Date.now(),
      });
      this.ws.close();
      this.ws = null;
    }
  }

  sendSceneUpdate(scene: Scene): void {
    this.send({
      type: 'scene-update',
      userId: this.userId,
      data: scene.toJSON(),
      timestamp: Date.now(),
    });
  }

  sendCursorMove(cursor: Point | null): void {
    this.send({
      type: 'cursor-move',
      userId: this.userId,
      data: cursor,
      timestamp: Date.now(),
    });
  }

  private send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'scene-update':
        if (message.userId !== this.userId && message.data) {
          const scene = Scene.fromJSON(message.data);
          this.onSceneUpdate(scene);
        }
        break;

      case 'cursor-move':
        // Handle in users update
        break;

      case 'user-join':
      case 'user-leave':
        // These would be handled by a separate users list management
        break;
    }
  }

  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Simple in-memory collaboration (without WebSocket server)
export class SimpleCollaboration {
  private users: Map<string, CollaborationUser> = new Map();
  private lastSceneUpdate: number = 0;
  private updateCallbacks: Set<(users: CollaborationUser[]) => void> = new Set();

  constructor(
    private boardId: string,
    private userId: string,
    private userName: string,
    private userColor: string
  ) {
    // Add self
    this.users.set(userId, {
      id: userId,
      name: userName,
      color: userColor,
      cursor: null,
    });
  }

  updateCursor(cursor: Point | null): void {
    const user = this.users.get(this.userId);
    if (user) {
      user.cursor = cursor;
      this.notifyUpdate();
    }
  }

  getUsers(): CollaborationUser[] {
    return Array.from(this.users.values());
  }

  onUsersUpdate(callback: (users: CollaborationUser[]) => void): void {
    this.updateCallbacks.add(callback);
  }

  private notifyUpdate(): void {
    const users = this.getUsers();
    this.updateCallbacks.forEach(cb => cb(users));
  }

  cleanup(): void {
    this.users.delete(this.userId);
  }
}