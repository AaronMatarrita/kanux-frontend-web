import { useEffect, useRef, useCallback, useState } from "react";
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
  const onMessageErrorRef = useRef(onMessageError);
  const onTypingRef = useRef(onTyping);
  const onStopTypingRef = useRef(onStopTyping);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    onMessageErrorRef.current = onMessageError;
  }, [onMessageError]);

  useEffect(() => {
    onTypingRef.current = onTyping;
  }, [onTyping]);

  useEffect(() => {
    onStopTypingRef.current = onStopTyping;
  }, [onStopTyping]);

  useEffect(() => {
    if (!enabled) return;

    const token = session?.token;
    if (!token) {
      setIsConnected(false);
      return;
    }

    socketService.connect(token);

    const socket = socketService.getSocket();
    if (!socket) {
      setIsConnected(false);
      return;
    }

    const handleConnect = () => {
      setIsConnected(true);

      hasJoinedRef.current = false;

      if (currentConversationRef.current) {
        socketService.joinConversation(currentConversationRef.current);
        hasJoinedRef.current = true;
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      hasJoinedRef.current = false;
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [enabled, session?.token]);

  useEffect(() => {
    if (!enabled || !isConnected) return;

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
  }, [enabled, isConnected]);

  useEffect(() => {
    if (!enabled || !isConnected) return;

    const handler = (err: any) => onMessageErrorRef.current?.(err);
    const cleanup = socketService.onMessageError(handler);

    return cleanup;
  }, [enabled, isConnected]);

  useEffect(() => {
    if (!enabled || !isConnected) return;

    const cleanup = socketService.onUserTyping((payload) => {
      onTypingRef.current?.(payload.userId);
    });

    return cleanup;
  }, [enabled, isConnected]);

  useEffect(() => {
    if (!enabled || !isConnected) return;

    const cleanup = socketService.onUserStopTyping((payload) => {
      onStopTypingRef.current?.(payload.userId);
    });

    return cleanup;
  }, [enabled, isConnected]);

  useEffect(() => {
    if (!enabled || !conversationId || !isConnected) return;

    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      socketService.leaveConversation(currentConversationRef.current);
      hasJoinedRef.current = false;
    }

    if (!hasJoinedRef.current) {
      socketService.joinConversation(conversationId);
      currentConversationRef.current = conversationId;
      hasJoinedRef.current = true;
    }

    return () => {
      if (currentConversationRef.current) {
        socketService.leaveConversation(currentConversationRef.current);
      }
      hasJoinedRef.current = false;
      currentConversationRef.current = null;
    };
  }, [conversationId, enabled, isConnected]);

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
              resolve({ success: true, messageId: response.messageId });
            } else {
              reject(new Error(response.message || "Failed to send message"));
            }
          },
        );
      });
    },
    [conversationId],
  );

  const emitTyping = useCallback(() => {
    if (!conversationId || !socketService.isConnected()) return;

    const userId = "current-user";
    socketService.emitUserTyping(conversationId, userId);
  }, [conversationId]);

  const emitStopTyping = useCallback(() => {
    if (!conversationId || !socketService.isConnected()) return;

    const userId = "current-user";
    socketService.emitUserStopTyping(conversationId, userId);
  }, [conversationId]);

  return {
    sendMessage,
    emitTyping,
    emitStopTyping,
    isConnected,
  };
}
