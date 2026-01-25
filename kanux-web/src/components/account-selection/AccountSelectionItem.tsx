import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptionAccountSelection } from "@/config/accountTypeSelecction.config";


type userRole = "COMPANY" | "TALENT"

interface Props {
  opt: OptionAccountSelection;
  onSelect: (key: string) => void;
  selected?: boolean;
}

export const CardAccountSelection = ({ opt, onSelect, selected = false }: Props) => {
  return (
    <button
      onClick={() => onSelect(opt.key)}
      aria-pressed={selected}
      className={cn(
        "text-left rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 w-full",
        selected
          ? [
            opt.key === "professional" ? "bg-[#ddfddc] border-transparent ring-2 ring-[#22C55E]/20"
              : "bg-[#dbf1fc] border-transparent ring-2 ring-[#2B8CE6]/20"
          ]
          : "bg-white border border-slate-200"
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{opt.title}</h3>
      </div>

      <div className="mt-1">
        <p className="text-sm text-slate-500">{opt.description}</p>
      </div>

      <ul className="mt-4 space-y-3">
        {opt.bullets.map((b) => (
          <li key={b} className="flex items-center gap-3 text-sm" >
            <span className={cn("rounded-full p-1", selected ? "bg-[#D6EEFF]" : "bg-green-50")}>
              <CheckCircle size={18} className={selected ? "text-[#2B8CE6]" : "text-green-500"} />
            </span>
            <span className={cn(selected ? "text-slate-800" : "text-slate-600")}>{b}</span>
          </li>
        ))}
      </ul>
    </button >
  );
};
export default CardAccountSelection;