import { useState, useCallback } from "react";
import { messagesService } from "@/services/messages.service";

interface UseMessageHandlerParams {
  onSuccess?: () => Promise<void>;
}

interface UseMessageHandlerReturn {
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  sending: boolean;
  error: string | null;
}

export function useMessageHandler({
  onSuccess,
}: UseMessageHandlerParams = {}): UseMessageHandlerReturn {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      try {
        setSending(true);
        setError(null);

        await messagesService.sendMessage({
          conversation_id: conversationId,
          content,
        });

        await onSuccess?.();
      } catch (err) {
        console.error("Error enviando mensaje:", err);
        setError(
          err instanceof Error ? err.message : "Error al enviar mensaje",
        );
        throw err;
      } finally {
        setSending(false);
      }
    },
    [onSuccess],
  );

  return {
    sendMessage,
    sending,
    error,
  };
}
