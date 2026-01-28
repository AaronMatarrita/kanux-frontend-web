import { Conversation } from "@/services/messages.service";
import Image from "next/image";
import { formatMessageTime } from "@/lib/dateUtils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected?: boolean;
  userRole: "company" | "talent";
  userPhoto?: string | null;
  onClick?: () => void;
}

export function ConversationItem({
  conversation,
  isSelected = false,
  userRole,
  userPhoto,
  onClick,
}: ConversationItemProps) {
  const otherParty =
    userRole === "company" ? conversation.talent : conversation.company;

  const displayName =
    userRole === "company"
      ? `${(otherParty as any)?.first_name} ${(otherParty as any)?.last_name}`
      : (otherParty as any)?.name;

  const avatar =
    userRole === "company"
      ? `https://ui-avatars.com/api/?name=${(otherParty as any)?.first_name}+${(otherParty as any)?.last_name}`
      : (otherParty as any)?.url_logo;

  const isLastMessageFromUser =
    conversation.last_message?.sender_type === "Companhia"
      ? userRole === "company"
      : userRole === "talent";

  const lastMessagePreview = isLastMessageFromUser
    ? `Tu: ${conversation.last_message?.content || "Sin mensajes"}`
    : conversation.last_message?.content || "Sin mensajes";

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 border-b transition-colors text-left flex gap-3 items-center
        hover:bg-gray-50
        ${
          isSelected
            ? "bg-blue-50 border-l-4 border-l-blue-500"
            : "border-l-4 border-l-transparent"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-200">
        {avatar ? (
          <Image
            src={avatar}
            alt={displayName || "Avatar"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {displayName?.[0] || "?"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p
            className={`font-semibold truncate ${
              isSelected ? "text-blue-700" : "text-gray-900"
            }`}
          >
            {displayName || "Sin nombre"}
          </p>
          <span className="text-xs text-gray-400 shrink-0">
            {conversation.last_message?.created_at
              ? formatMessageTime(conversation.last_message.created_at)
              : ""}
          </span>
        </div>

        <p
          className={`text-sm truncate mt-1 ${
            isSelected ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {lastMessagePreview}
        </p>
      </div>
    </button>
  );
}
