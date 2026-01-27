import { useEffect, useState } from "react";
import {
  messagesService,
  type Conversation,
} from "@/services/messages.service";
import { useAuth } from "@/context/AuthContext";

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const { session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesService.getUserConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      loadConversations();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  return {
    conversations,
    loading,
    error,
    refetch: loadConversations,
  };
}
