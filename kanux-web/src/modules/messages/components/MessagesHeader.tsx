"use client";

import { GenericHeader } from "@/components/ui/generic-header/GenericHeader";

export function MessagesHeader() {
  return (
    <GenericHeader
      title="Mensajes"
      description="Comunicación directa con tus compañías."
      rightContent={null}
    />
  );
}
