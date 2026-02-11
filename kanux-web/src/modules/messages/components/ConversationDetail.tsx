"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Conversation, Message } from "@/services/messages.service";
import Image from "next/image";
import { Send, X, Search } from "lucide-react";
import { formatMessageTime, groupMessagesByDate } from "@/lib/dateUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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

  const handleSendMessage = async () => {
    if (messageInput.trim() && onSendMessage) {
      const content = messageInput.trim();
      setMessageInput("");
      try {
        await onSendMessage(content);
      } catch (err) {
        console.error("Error sending message:", err);
        setMessageInput(content);
      }
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
      <div className="hidden md:flex h-full flex-col items-center justify-center bg-muted/30">
        <p className="text-muted-foreground text-lg">
          Selecciona una conversación
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="h-16 px-4 flex items-center border-b border-border bg-background">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
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
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">Activo ahora</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar en el chat..."
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-muted/60 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" message="Cargando mensajes..." />
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded">
            <p className="text-destructive text-sm font-semibold">Error</p>
            <p className="text-destructive text-xs mt-1">{error}</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-sm">
              Comienza la conversación escribiendo un mensaje
            </p>
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-full">
                {group.dateLabel}
              </span>
              <div className="flex-1 h-px bg-border" />
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted order-2">
                      <Image
                        src={currentUserAvatar}
                        alt="Tu avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {isOwn && !currentUserAvatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted order-2">
                      <div className="w-full h-full flex items-center justify-center bg-green-500 text-white text-xs font-bold">
                        {userName?.[0] || "T"}
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? "bg-emerald-600 text-white rounded-br-none order-1"
                        : "bg-card text-foreground border border-border rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{highlightText(message.content)}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-emerald-100" : "text-muted-foreground"
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

      <div className="p-4 border-t border-border bg-background">
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
            className="flex-1 px-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:bg-muted"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-muted transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
