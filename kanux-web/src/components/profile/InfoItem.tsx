export function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-semibold text-gray-900">{label}</span>
        <span className="text-sm text-gray-600">{value??""}</span>
    </div>
  );
}
