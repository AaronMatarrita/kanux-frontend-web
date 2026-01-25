"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  challengeTitle?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function SubmitConfirmationModal({
  isOpen,
  isLoading,
  challengeTitle,
  onConfirm,
  onCancel,
}: SubmitConfirmationModalProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setError(null);
      await onConfirm();
    } catch (err: any) {
      setError(err?.message || "Error al enviar la solución");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Confirmar envío
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 mb-3">
            ¿Estás seguro de que deseas enviar tu solución para{" "}
            <span className="font-semibold">{challengeTitle}</span>?
          </p>
          <p className="text-sm text-slate-500">
            Una vez enviada, no podrás editarla. Tu código será evaluado
            automáticamente.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
