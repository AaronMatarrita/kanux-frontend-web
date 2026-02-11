/**
 * Socket Service
 * Manages WebSocket connection with ms-messages
 */

import { io, Socket } from "socket.io-client";
import { Message } from "./messages.service";

// Socket Events (match backend)

export const SOCKET_EVENTS = {
  // Connection
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  DISCONNECTING: "disconnecting",

  // Rooms
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",

  // Messages
  SEND_MESSAGE: "send_message",
  MESSAGE_RECEIVED: "message_received",
  MESSAGE_ERROR: "message_error",

  // Typing
  USER_TYPING: "user_typing",
  USER_STOP_TYPING: "user_stop_typing",
  USER_IS_TYPING: "user_is_typing",

  // Read
  MESSAGE_READ: "message_read",
  MESSAGES_MARKED_AS_READ: "messages_marked_as_read",

  // Errors
  ERROR: "error",
} as const;

// Types

export interface SendMessagePayload {
  conversationId: string;
  text: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  timestamp?: string;
  status?: string;
  message?: string;
  error?: any;
}

export interface MessageReceivedPayload {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "Companhia" | "Talento";
  content: string;
  createdAt: string;
}

export interface UserTypingPayload {
  conversationId: string;
  userId: string;
}

export interface MessageReadPayload {
  messageId?: string;
  conversationId: string;
}

export interface MessagesMarkedAsReadPayload {
  conversationId: string;
  messageIds: string[];
  markedCount: number;
  readBy: string;
  readAt: string;
}

export interface JoinConversationPayload {
  conversationId: string;
}

// Socket Service Class

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize socket connection
   */
  connect(token: string): Socket {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return this.socket;
    }

    this.token = token;

    const socketUrl =
      process.env.NEXT_PUBLIC_MESSAGES_WS_URL ||
      "http://localhost:3006/messages";

    this.socket = io(socketUrl, {
      auth: {
        token: this.token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupConnectionListeners();

    return this.socket;
  }

  /**
   * Setup connection event listeners
   */
  private setupConnectionListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        this.disconnect();
      }
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error("Socket error:", error);
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Room Management

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, {
      conversationId,
    });

    console.log(`Joining conversation: ${conversationId}`);
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, {
      conversationId,
    });

    console.log(`Leaving conversation: ${conversationId}`);
  }

  // Message Operations

  /**
   * Send message through WebSocket
   */
  sendMessage(
    payload: SendMessagePayload,
    callback?: (response: SendMessageResponse) => void,
  ): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      callback?.({
        success: false,
        message: "Socket not connected",
      });
      return;
    }

    this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload, callback);
  }

  /**
   * Listen for incoming messages
   */
  onMessageReceived(
    callback: (message: MessageReceivedPayload) => void,
  ): () => void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return () => {};
    }

    this.socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, callback);

    // Return cleanup function
    return () => {
      this.socket?.off(SOCKET_EVENTS.MESSAGE_RECEIVED, callback);
    };
  }

  /**
   * Listen for message errors
   */
  onMessageError(callback: (error: any) => void): () => void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return () => {};
    }

    this.socket.on(SOCKET_EVENTS.MESSAGE_ERROR, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.MESSAGE_ERROR, callback);
    };
  }

  // Typing Indicators

  /**
   * Emit user typing event
   */
  emitUserTyping(conversationId: string, userId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.USER_TYPING, {
      conversationId,
      userId,
    });
  }

  /**
   * Emit user stopped typing event
   */
  emitUserStopTyping(conversationId: string, userId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit(SOCKET_EVENTS.USER_STOP_TYPING, {
      conversationId,
      userId,
    });
  }

  /**
   * Listen for user typing events
   */
  onUserTyping(callback: (payload: UserTypingPayload) => void): () => void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return () => {};
    }

    this.socket.on(SOCKET_EVENTS.USER_IS_TYPING, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.USER_IS_TYPING, callback);
    };
  }

  /**
   * Listen for user stopped typing events
   */
  onUserStopTyping(callback: (payload: UserTypingPayload) => void): () => void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return () => {};
    }

    this.socket.on(SOCKET_EVENTS.USER_STOP_TYPING, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.USER_STOP_TYPING, callback);
    };
  }

  // Read Receipts

  /**
   * Mark message(s) as read
   */
  markMessageAsRead(payload: MessageReadPayload): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit(SOCKET_EVENTS.MESSAGE_READ, payload);
  }

  /**
   * Listen for messages marked as read
   */
  onMessagesMarkedAsRead(
    callback: (payload: MessagesMarkedAsReadPayload) => void,
  ): () => void {
    if (!this.socket) {
      console.error("Socket not initialized");
      return () => {};
    }

    this.socket.on(SOCKET_EVENTS.MESSAGES_MARKED_AS_READ, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.MESSAGES_MARKED_AS_READ, callback);
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
