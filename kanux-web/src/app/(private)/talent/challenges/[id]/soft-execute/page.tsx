"use client";

import { useEffect, useState } from "react";
import { SoftExecutionContainer } from "@/modules/challenges/soft-execution/pages/SoftExecutionContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SoftExecutePage({ params }: PageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }

    loadParams();
  }, [params]);

  if (!id) return null;

  return (
    <div className="flex flex-col flex-1 p-6">
      <SoftExecutionContainer id={id} />
    </div>
  );
}
