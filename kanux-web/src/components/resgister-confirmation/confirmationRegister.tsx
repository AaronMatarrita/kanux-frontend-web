"use client";

import { useRouter } from "next/navigation";

interface SuccessModalProps {
  redirectPath?: string;
}

export function SuccessModal({ redirectPath = "/" }: SuccessModalProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center transform transition-all scale-100">

      {/* icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* title*/}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Todo listo!</h2>
      <p className="text-gray-600 mb-6">Tu perfil ha sido registrado exitosamente</p>

      {/* button */}
      <button
        onClick={() => router.push(redirectPath)}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg active:scale-95"
      >
        Ir al dashboard
      </button>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900 text-right">{value || "No especificado"}</span>
    </div>
  );
}