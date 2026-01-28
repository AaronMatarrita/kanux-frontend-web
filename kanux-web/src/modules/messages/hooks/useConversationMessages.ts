import { useEffect, useState, useCallback } from "react";
import {
  messagesService,
  type ConversationMessagesResponse,
  type Message,
} from "@/services/messages.service";
import { useWebSocket } from "./useWebSocket";

interface UseConversationMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  refetch: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addOptimisticMessage: (message: Message) => void;
}

export function useConversationMessages(
  conversationId?: string,
  userRole?: "company" | "talent",
): UseConversationMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [pendingMessageIds, setPendingMessageIds] = useState<Set<string>>(
    new Set(),
  );

  const loadMessages = async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: ConversationMessagesResponse =
        await messagesService.getConversationMessages(conversationId);

      setMessages(response.messages);
    } catch (err) {
      console.error("Error loading conversation messages:", err);
      setError(err instanceof Error ? err.message : "Error al cargar mensajes");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add optimistic message to UI
   */
  const addOptimisticMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  /**
   * Handle incoming messages from WebSocket
   */
  const handleMessageReceived = useCallback((message: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) {
        return prev;
      }

      const tempIndex = prev.findIndex((m) => m.id.startsWith("temp-"));

      if (tempIndex !== -1) {
        const tempId = prev[tempIndex].id;
        const newMessages = [...prev];
        newMessages[tempIndex] = message;

        setPendingMessageIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(tempId);
          return newSet;
        });

        return newMessages;
      }

      return [...prev, message];
    });
  }, []);

  /**
   * Handle message errors
   */
  const handleMessageError = useCallback((error: any) => {
    console.error("WebSocket message error:", error);
    setError(error.message || "Error al enviar mensaje");
  }, []);

  /**
   * WebSocket integration
   */
  const { sendMessage: sendMessageViaSocket } = useWebSocket({
    conversationId,
    onMessageReceived: handleMessageReceived,
    onMessageError: handleMessageError,
    enabled: !!conversationId,
  });

  /**
   * Send message with optimistic UI update
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) {
        throw new Error("No conversation selected");
      }

      // Create optimistic message
      const optimisticId = `temp-${Date.now()}-${Math.random()}`;
      const optimisticMessage: Message = {
        id: optimisticId,
        sender_type: userRole === "company" ? "Companhia" : "Talento",
        content,
        created_at: new Date().toISOString(),
        is_read: false,
      };

      try {
        setSending(true);
        setError(null);

        setPendingMessageIds((prev) => new Set(prev).add(optimisticId));
        addOptimisticMessage(optimisticMessage);

        await sendMessageViaSocket(content);
      } catch (err) {
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id),
        );
        setPendingMessageIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(optimisticId);
          return newSet;
        });

        const errorMessage =
          err instanceof Error ? err.message : "Error al enviar mensaje";
        setError(errorMessage);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversationId, sendMessageViaSocket, addOptimisticMessage, userRole],
  );

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    sending,
    refetch: loadMessages,
    sendMessage,
    addOptimisticMessage,
  };
}
