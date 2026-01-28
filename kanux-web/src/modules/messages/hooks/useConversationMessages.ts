import { useEffect, useState } from "react";
import {
  messagesService,
  type ConversationMessagesResponse,
  type Message,
} from "@/services/messages.service";

interface UseConversationMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useConversationMessages(
  conversationId?: string,
): UseConversationMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    refetch: loadMessages,
  };
}
