import SkillsPage from "@/components/skills/SkillPage";
export default function Page() {
  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Habilidades
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona y valida tus habilidades técnicas y blandas.
        </p>
      </div>
      <SkillsPage />
    </div>
  );
}
