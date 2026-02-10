import { Conversation } from "@/services/messages.service";
import { Search, X } from "lucide-react";
import { ConversationItem } from "./ConversationItem";

interface ConversationsListProps {
  conversations: Conversation[];
  loading?: boolean;
  error?: string | null;
  selectedId?: string | null;
  userRole: "company" | "talent";
  userPhoto?: string | null;
  onSelectConversation?: (conversation: Conversation) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function ConversationsList({
  conversations,
  loading = false,
  error = null,
  selectedId = null,
  userRole,
  userPhoto,
  onSelectConversation,
  searchQuery = "",
  onSearchChange,
}: ConversationsListProps) {
  const filteredConversations = conversations.filter((conv) => {
    const otherParty = userRole === "company" ? conv.talent : conv.company;
    const displayName =
      userRole === "company"
        ? `${(otherParty as any)?.first_name} ${(otherParty as any)?.last_name}`
        : (otherParty as any)?.name;

    return (
      displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="h-16 px-4 flex items-center border-b border-border">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="p-4 text-center text-muted-foreground">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-4">
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded">
              <p className="text-destructive text-sm font-semibold">Error</p>
              <p className="text-destructive text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && conversations.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">No hay conversaciones aún</p>
          </div>
        )}

        {/* Empty (search) */}
        {!loading &&
          !error &&
          conversations.length > 0 &&
          filteredConversations.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No se encontraron resultados</p>
            </div>
          )}

        {/* List */}
        {!loading &&
          !error &&
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              userRole={userRole}
              userPhoto={userPhoto}
              onClick={() => onSelectConversation?.(conversation)}
            />
          ))}
      </div>

      {/* Footer */}
      {conversations.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/40 text-xs text-muted-foreground">
          {filteredConversations.length} de {conversations.length}{" "}
          conversación(es)
        </div>
      )}
    </div>
  );
}
