import { useState } from "react";
import { Conversation, Message } from "@/services/messages.service";

export interface UseMessagesStateReturn {
  selectedConversation: Conversation | undefined;
  conversationMessages: Message[];
  searchQuery: string;
  sending: boolean;
  setSelectedConversation: (conversation: Conversation | undefined) => void;
  setConversationMessages: (messages: Message[]) => void;
  setSearchQuery: (query: string) => void;
  setSending: (sending: boolean) => void;
  addMessage: (message: Message) => void;
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
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);

  const addMessage = (message: Message) => {
    setConversationMessages((prev) => [...prev, message]);
  };

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
    conversationMessages,
    searchQuery,
    sending,
    setSelectedConversation,
    setConversationMessages,
    setSearchQuery,
    setSending,
    addMessage,
    handleSendMessage,
  };
}
