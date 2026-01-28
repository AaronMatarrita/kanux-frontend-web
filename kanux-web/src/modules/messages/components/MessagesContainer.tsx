import React from "react";
import { Conversation } from "@/services/messages.service";
import { ConversationsList } from "@/modules/messages/components/ConversationsList";
import { ConversationDetail } from "@/modules/messages/components/ConversationDetail";
import { MessagesPanel } from "@/modules/messages/components/MessagesPanel";
import { useMessagesState } from "@/modules/messages/hooks/useMessagesState";

interface MessagesContainerProps {
  conversations: Conversation[];
  loading?: boolean;
  error?: string | null;
  userRole: "company" | "talent";
  onSendMessage?: (conversationId: string, content: string) => Promise<void>;
}

export function MessagesContainer({
  conversations,
  loading = false,
  error = null,
  userRole,
  onSendMessage,
}: MessagesContainerProps) {
  const {
    selectedConversation,
    searchQuery,
    sending,
    setSelectedConversation,
    setSearchQuery,
    handleSendMessage,
  } = useMessagesState();

  const onSend = async (content: string) => {
    if (!selectedConversation) return;

    await handleSendMessage(selectedConversation.id, content, onSendMessage);
  };

  return (
    <div className="h-full flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <MessagesPanel
        isVisible={!selectedConversation || false}
        className="w-full md:w-80 shrink-0"
      >
        <ConversationsList
          conversations={conversations}
          loading={loading}
          error={error}
          selectedId={selectedConversation?.id}
          userRole={userRole}
          onSelectConversation={setSelectedConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </MessagesPanel>

      <MessagesPanel isVisible={!!selectedConversation} className="flex-1">
        <ConversationDetail
          conversation={selectedConversation}
          messages={
            selectedConversation?.last_message
              ? [selectedConversation.last_message]
              : []
          }
          userRole={userRole}
          onClose={() => setSelectedConversation(undefined)}
          onSendMessage={onSend}
          sending={sending}
        />
      </MessagesPanel>
    </div>
  );
}
