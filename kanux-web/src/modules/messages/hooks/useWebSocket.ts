import { useEffect, useRef, useCallback } from "react";
import {
  socketService,
  MessageReceivedPayload,
  SendMessageResponse,
} from "@/services/socket.service";
import { Message } from "@/services/messages.service";
import { useAuth } from "@/context/AuthContext";

interface UseWebSocketParams {
  conversationId?: string;
  onMessageReceived?: (message: Message) => void;
  onMessageError?: (error: any) => void;
  onTyping?: (userId: string) => void;
  onStopTyping?: (userId: string) => void;
  enabled?: boolean;
}

interface UseWebSocketReturn {
  sendMessage: (
    content: string,
  ) => Promise<{ success: boolean; messageId?: string }>;
  emitTyping: () => void;
  emitStopTyping: () => void;
  isConnected: boolean;
}

export function useWebSocket({
  conversationId,
  onMessageReceived,
  onMessageError,
  onTyping,
  onStopTyping,
  enabled = true,
}: UseWebSocketParams): UseWebSocketReturn {
  const { session } = useAuth();
  const hasJoinedRef = useRef(false);
  const currentConversationRef = useRef<string | null>(null);
  const onMessageReceivedRef = useRef(onMessageReceived);

  // Keep ref updated
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!enabled) return;

    const token = session?.token;
    if (!token) {
      return;
    }

    if (!socketService.isConnected()) {
      socketService.connect(token);
    }

    return () => {};
  }, [enabled, session?.token]);

  /**
   * Listen for incoming messages - uses ref to avoid re-registering
   */
  useEffect(() => {
    if (!enabled || !socketService.isConnected()) {
      return;
    }

    const cleanup = socketService.onMessageReceived(
      (payload: MessageReceivedPayload) => {
        const message: Message = {
          id: payload.id,
          sender_type: payload.senderType,
          content: payload.content,
          created_at: payload.createdAt,
          is_read: false,
        };

        onMessageReceivedRef.current?.(message);
      },
    );

    return cleanup;
  }, [enabled, session?.token]);

  /**
   * Join/Leave conversation rooms
   */
  useEffect(() => {
    if (!enabled || !conversationId || !socketService.isConnected()) {
      return;
    }

    // Leave previous conversation if different
    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      socketService.leaveConversation(currentConversationRef.current);
      hasJoinedRef.current = false;
    }

    // Join new conversation
    if (!hasJoinedRef.current) {
      socketService.joinConversation(conversationId);
      currentConversationRef.current = conversationId;
      hasJoinedRef.current = true;

      console.log(`Joined conversation: ${conversationId}`);
    }

    return () => {
      if (conversationId && hasJoinedRef.current) {
        socketService.leaveConversation(conversationId);
        hasJoinedRef.current = false;
        currentConversationRef.current = null;
      }
    };
  }, [conversationId, enabled]);



  /**
   * Listen for message errors
   */
  useEffect(() => {
    if (!enabled || !onMessageError || !socketService.isConnected()) return;

    const cleanup = socketService.onMessageError(onMessageError);

    return cleanup;
  }, [enabled, onMessageError, session?.token]);

  /**
   * Listen for typing events
   */
  useEffect(() => {
    if (!enabled || !onTyping || !socketService.isConnected()) return;

    const cleanup = socketService.onUserTyping((payload) => {
      onTyping(payload.userId);
    });

    return cleanup;
  }, [enabled, onTyping, session?.token]);

  /**
   * Listen for stop typing events
   */
  useEffect(() => {
    if (!enabled || !onStopTyping || !socketService.isConnected()) return;

    const cleanup = socketService.onUserStopTyping((payload) => {
      onStopTyping(payload.userId);
    });

    return cleanup;
  }, [enabled, onStopTyping, session?.token]);

  /**
   * Send message through WebSocket
   */
  const sendMessage = useCallback(
    async (
      content: string,
    ): Promise<{ success: boolean; messageId?: string }> => {
      return new Promise((resolve, reject) => {
        if (!conversationId) {
          reject(new Error("No conversation selected"));
          return;
        }

        if (!socketService.isConnected()) {
          reject(new Error("Socket not connected"));
          return;
        }

        socketService.sendMessage(
          {
            conversationId,
            text: content,
          },
          (response: SendMessageResponse) => {
            if (response.success) {
              resolve({
                success: true,
                messageId: response.messageId,
              });
            } else {
              reject(new Error(response.message || "Failed to send message"));
            }
          },
        );
      });
    },
    [conversationId],
  );

  /**
   * Emit typing indicator
   */
  const emitTyping = useCallback(() => {
    if (!conversationId || !socketService.isConnected()) return;

    const userId = "current-user";
    socketService.emitUserTyping(conversationId, userId);
  }, [conversationId]);

  /**
   * Emit stop typing indicator
   */
  const emitStopTyping = useCallback(() => {
    if (!conversationId || !socketService.isConnected()) return;

    const userId = "current-user";
    socketService.emitUserStopTyping(conversationId, userId);
  }, [conversationId]);

  return {
    sendMessage,
    emitTyping,
    emitStopTyping,
    isConnected: socketService.isConnected(),
  };
}
