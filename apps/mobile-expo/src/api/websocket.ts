import { getAuthToken } from './client';
import type { WsEvent } from '@/src/types';

const WS_URL = process.env.EXPO_PUBLIC_API_WS_URL || 'ws://localhost:8080/api/v1';

type WsListener = (event: WsEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<WsListener> = new Set();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;

  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;
    const token = await getAuthToken();
    if (!token) {
      this.isConnecting = false;
      return;
    }

    try {
      this.ws = new WebSocket(`${WS_URL}/requests/ws`);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.ws?.send(JSON.stringify({ type: 'auth', token }));
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as WsEvent;
          this.listeners.forEach((listener) => listener(parsed));
        } catch {
          // pong or unparseable — ignore
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        this.ws?.close();
      };
    } catch {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  subscribe(listener: WsListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 5000);
  }
}

export const wsService = new WebSocketService();
