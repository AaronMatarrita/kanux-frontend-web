"use client";

import { useEffect, useState } from "react";
import {
  messagesService,
  type Conversation,
} from "@/services/messages.service";
import {
  MessagesContainer,
  MessagesLayout,
  MessagesHeader,
} from "@/modules/messages/components";
import { useAuth } from "@/context/AuthContext";
import { useMessagesGuard } from "@/guards/useMessagesGuard";

export default function Page() {
  const { session } = useAuth();
  const isAuthorized = useMessagesGuard();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    if (isAuthorized && session?.token) {
      loadConversations();
    }
  }, [session?.token, isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  const userPhoto =
    session?.user.userType === "talent"
      ? (session?.user as any).profile?.photo_url
      : (session?.user as any).profile?.url_logo;

  const userName =
    session?.user.userType === "talent"
      ? (session?.user as any).profile?.full_name || "Talento"
      : (session?.user as any).profile?.name || "Empresa";

  const userRole = session?.user.userType === "company" ? "company" : "talent";

  console.log("Renderizando MessagesPage con userRole:", userRole);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <MessagesLayout header={<MessagesHeader />}>
        <MessagesContainer
          conversations={conversations}
          loading={loading}
          error={error}
          userRole={userRole}
          userPhoto={userPhoto}
          userName={userName}
        />
      </MessagesLayout>
    </div>
  );
}
