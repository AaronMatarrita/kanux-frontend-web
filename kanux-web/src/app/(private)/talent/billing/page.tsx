import TalentBilling from "@/components/billing/talentBilling";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Planes y suscripción
        </h1>
        <p className="mt-1 text-muted-foreground">
          Elige el plan que mejor se adapte a tus objetivos profesionales.
        </p>
      </div>
      <TalentBilling />
    </div>
  );
}
