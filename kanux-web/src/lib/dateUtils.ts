export function formatMessageTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatMessageDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function getDateSeparator(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) {
      return "Hoy";
    }

    if (isSameDay(date, yesterday)) {
      return "Ayer";
    }

    return formatMessageDate(dateString);
  } catch {
    return "";
  }
}

export function getNormalizedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

export interface GroupedMessage {
  date: string;
  dateLabel: string;
  messages: Array<{
    id: string;
    sender_type: "Companhia" | "Talento";
    content: string;
    created_at: string;
    is_read: boolean;
  }>;
}

export function groupMessagesByDate(
  messages: Array<{
    id: string;
    sender_type: "Companhia" | "Talento";
    content: string;
    created_at: string;
    is_read: boolean;
  }>,
): GroupedMessage[] {
  const groups: Map<string, GroupedMessage> = new Map();

  messages.forEach((message) => {
    const normalizedDate = getNormalizedDate(message.created_at);
    const dateLabel = getDateSeparator(message.created_at);

    if (!groups.has(normalizedDate)) {
      groups.set(normalizedDate, {
        date: normalizedDate,
        dateLabel,
        messages: [],
      });
    }

    groups.get(normalizedDate)!.messages.push(message);
  });

  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
