"use client";

import { useEffect, useState } from "react";
import {
  messagesService,
  type Conversation,
} from "@/services/messages.service";
import {
  MessagesContainer,
  MessagesLayout,
} from "@/modules/messages/components";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔵 [Company Messages] Cargando conversaciones...");
        console.log(
          "🔵 [Company Messages] Usuario autenticado:",
          session?.user,
        );

        const data = await messagesService.getUserConversations();

        console.log("✅ [Company Messages] Conversaciones cargadas:", data);
        setConversations(data);
      } catch (err) {
        console.error(
          "❌ [Company Messages] Error al cargar conversaciones:",
          err,
        );
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (session?.token) {
      loadConversations();
    } else {
      console.warn("⚠️ [Company Messages] No hay sesión activa");
      setLoading(false);
    }
  }, [session?.token]);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <MessagesLayout>
        <MessagesContainer
          conversations={conversations}
          loading={loading}
          error={error}
          userRole="company"
        />
      </MessagesLayout>
    </div>
  );
}
