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
import { useMessagesGuard } from "@/guards/useMessagesGuard";
import { useSubscription } from "@/context/SubscriptionContext";
import { UpgradeWall } from "@/components/ui/UpgradeWall";

export default function Page() {
  const { session } = useAuth();
  const isAuthorized = useMessagesGuard();
  const { planData, loading: planLoading, userType } = useSubscription();
  const features = planData?.company_plans?.company_plan_features?.[0];
  const canContact = !!features?.can_contact_talent;

  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await messagesService.getUserConversations();
        setConversations(data);
      } catch (err) {
        console.error("Error al cargar conversaciones:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (mounted && isAuthorized && session?.token && canContact) {
      loadConversations();
    }
  }, [mounted, session?.token, isAuthorized, canContact]);

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        No autorizado
      </div>
    );
  }

  if (planLoading) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!canContact) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <UpgradeWall
            featureName="can_contact_talent"
            userType={userType ?? "company"}
            infoText="La mensajeria con talento"
          />
        </div>
      </div>
    );
  }

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
