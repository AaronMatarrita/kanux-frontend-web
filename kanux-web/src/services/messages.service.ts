/**
 * Messages Service
 * Access layer for messages microservice (ms-messages)
 *
 * All requests are proxied through API Gateway at /messages
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface CreateConversationRequest {
  talent_profile_id: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface Conversation {
  id: string;
  last_message_at?: string;
  company?: {
    id: string;
    name: string;
    url_logo?: string;
  };
  talent?: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
  last_message?: Message | null;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  sender_type: "Companhia" | "Talento";
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface ConversationMessagesResponse {
  conversation_id: string;
  messages: Message[];
}

// ============================================================================
// Service
// ============================================================================

export const messagesService = {
  // ================= Conversations =================

  /**
   * POST /conversations
   * Create a new conversation (requires auth)
   */
  createConversation: async (
    data: CreateConversationRequest,
  ): Promise<Conversation> => {
    const res = await httpClient.post<Conversation>(
      "/messages/conversations",
      data,
    );
    return res.data;
  },

  /**
   * GET /conversations
   * Get all conversations for current user (requires auth)
   */
  getUserConversations: async (): Promise<Conversation[]> => {
    const res = await httpClient.get<Conversation[]>("/messages/conversations");
    return res.data;
  },

  // ================= Messages =================

  /**
   * POST /messages
   * Send a message to a conversation (requires auth)
   */
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const res = await httpClient.post<Message>("/messages", data);
    return res.data;
  },

  /**
   * GET /messages/conversations/:id
   * Get all messages in a conversation (requires auth)
   */
  getConversationMessages: async (
    conversationId: string,
  ): Promise<ConversationMessagesResponse> => {
    const res = await httpClient.get<ConversationMessagesResponse>(
      `/messages/conversations/${conversationId}`,
    );
    return res.data;
  },
};
