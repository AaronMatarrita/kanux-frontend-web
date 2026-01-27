import { useState } from "react";
import { Conversation } from "@/services/messages.service";

export interface UseMessagesStateReturn {
  selectedConversation: Conversation | undefined;
  searchQuery: string;
  sending: boolean;
  setSelectedConversation: (conversation: Conversation | undefined) => void;
  setSearchQuery: (query: string) => void;
  setSending: (sending: boolean) => void;
  handleSendMessage: (
    conversationId: string,
    content: string,
    onSendMessage?: (conversationId: string, content: string) => Promise<void>,
  ) => Promise<void>;
}

export function useMessagesState(): UseMessagesStateReturn {
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (
    conversationId: string,
    content: string,
    onSendMessage?: (conversationId: string, content: string) => Promise<void>,
  ) => {
    setSending(true);
    try {
      await onSendMessage?.(conversationId, content);
    } finally {
      setSending(false);
    }
  };

  return {
    selectedConversation,
    searchQuery,
    sending,
    setSelectedConversation,
    setSearchQuery,
    setSending,
    handleSendMessage,
  };
}
