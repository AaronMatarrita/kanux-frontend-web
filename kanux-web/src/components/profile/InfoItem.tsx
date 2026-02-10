export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value ?? ""}</span>
    </div>
  );
}
