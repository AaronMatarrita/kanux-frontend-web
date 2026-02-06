"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/context/SubscriptionContext";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ActionGuardProps {
  children: React.ReactElement;
  feature: string;
  actionName: string;
}

export function ActionGuard({
  children,
  feature,
  actionName,
}: ActionGuardProps) {
  const { planData, loading, userType } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const features =
    userType === "company"
      ? planData?.company_plans?.company_plan_features?.[0]
      : planData?.talent_plans?.talent_plan_features?.[0];

  const hasAccess = !!(features as any)?.[feature];

  const handleIntercept = (e: React.MouseEvent) => {
    if (!loading && !hasAccess) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  };

  const handleUpgrade = () => {
    setShowModal(false);
    router.push(`/${userType}/billing`);
  };

  return (
    <>
      <div
        onClickCapture={handleIntercept}
        style={{
          display: "contents",
          cursor: !hasAccess ? "pointer" : "default",
        }}
      >
        {children}
      </div>

      <ConfirmDialog
        isOpen={showModal}
        title="Actualizacion requerida"
        description={`La accion "${actionName}" no esta disponible en tu plan actual. Actualiza para desbloquear esta funcion.`}
        confirmLabel="Actualizar plan"
        cancelLabel="Luego"
        onConfirm={handleUpgrade} // Usamos la nueva función
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
