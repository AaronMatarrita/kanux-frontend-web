"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Conversation, Message } from "@/services/messages.service";
import Image from "next/image";
import { Send, X, Search } from "lucide-react";
import { formatMessageTime, groupMessagesByDate } from "@/lib/dateUtils";

interface ConversationDetailProps {
  conversation?: Conversation | null;
  messages?: Message[];
  loading?: boolean;
  error?: string | null;
  userRole: "company" | "talent";
  userPhoto?: string | null;
  userName?: string;
  onClose?: () => void;
  onSendMessage?: (content: string) => void;
  sending?: boolean;
}

export function ConversationDetail({
  conversation,
  messages = [],
  loading = false,
  error = null,
  userRole,
  userPhoto,
  userName = "Tú",
  onClose,
  onSendMessage,
  sending = false,
}: ConversationDetailProps) {
  const [messageInput, setMessageInput] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput.trim());
      setMessageInput("");
    }
  };

  const otherParty =
    userRole === "company" ? conversation?.talent : conversation?.company;

  const otherPartyAvatar =
    userRole === "company"
      ? (otherParty as any)?.url_logo ||
        `https://ui-avatars.com/api/?name=${(otherParty as any)?.first_name}+${(otherParty as any)?.last_name}`
      : (otherParty as any)?.url_logo;

  const displayName =
    userRole === "company"
      ? `${(otherParty as any)?.first_name} ${(otherParty as any)?.last_name}`
      : (otherParty as any)?.name;

  const currentUserAvatar = userRole === "company" ? userPhoto : userPhoto;

  const highlightText = (text: string) => {
    if (!messageSearch) return text;

    const regex = new RegExp(`(${messageSearch})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === messageSearch.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Selecciona una conversación</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-16 px-4 flex items-center border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {otherPartyAvatar ? (
                <Image
                  src={otherPartyAvatar}
                  alt={displayName || "Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {displayName?.[0] || "?"}
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">Activo ahora</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en el chat..."
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm font-semibold">Error</p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-400 text-sm">
              Comienza la conversación escribiendo un mensaje
            </p>
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-200 rounded-full">
                {group.dateLabel}
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {group.messages.map((message) => {
              const isOwn =
                message.sender_type === "Companhia"
                  ? userRole === "company"
                  : userRole === "talent";

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isOwn ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  {!isOwn && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {otherPartyAvatar ? (
                        <Image
                          src={otherPartyAvatar}
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold">
                          {displayName?.[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {isOwn && currentUserAvatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 order-2">
                      <Image
                        src={currentUserAvatar}
                        alt="Tu avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {isOwn && !currentUserAvatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 order-2">
                      <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-xs font-bold">
                        {userName?.[0] || "T"}
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? "bg-green-500 text-white rounded-br-none order-1"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{highlightText(message.content)}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Escribe un mensaje..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
