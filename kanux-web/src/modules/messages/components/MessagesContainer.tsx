import React from "react";
import { Conversation } from "@/services/messages.service";
import { ConversationsList } from "@/modules/messages/components/ConversationsList";
import { ConversationDetail } from "@/modules/messages/components/ConversationDetail";
import { MessagesPanel } from "@/modules/messages/components/MessagesPanel";
import { useMessagesState } from "@/modules/messages/hooks/useMessagesState";
import { useConversationMessages } from "@/modules/messages/hooks/useConversationMessages";

interface MessagesContainerProps {
  conversations: Conversation[];
  loading?: boolean;
  error?: string | null;
  userRole: "company" | "talent";
  userPhoto?: string | null;
  userName?: string;
}

export function MessagesContainer({
  conversations,
  loading = false,
  error = null,
  userRole,
  userPhoto,
  userName,
}: MessagesContainerProps) {
  const {
    selectedConversation,
    searchQuery,
    setSelectedConversation,
    setSearchQuery,
  } = useMessagesState();

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sending,
    sendMessage,
  } = useConversationMessages(selectedConversation?.id, userRole);

  return (
    <div className="h-full flex bg-card border border-border rounded-lg shadow-sm overflow-hidden">
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
          userPhoto={userPhoto}
          onSelectConversation={setSelectedConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </MessagesPanel>

      <MessagesPanel isVisible={!!selectedConversation} className="flex-1">
        <ConversationDetail
          conversation={selectedConversation}
          messages={messages}
          loading={messagesLoading}
          error={messagesError}
          userRole={userRole}
          userPhoto={userPhoto}
          userName={userName}
          onClose={() => setSelectedConversation(undefined)}
          onSendMessage={sendMessage}
          sending={sending}
        />
      </MessagesPanel>
    </div>
  );
}
