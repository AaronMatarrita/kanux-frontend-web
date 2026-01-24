import { Building2 } from "lucide-react";

interface CompanyInfo {
  name: string;
  about: string;
  logo: string | null;
}

interface CompanyCardProps {
  companyInfo: CompanyInfo;
}

export function CompanyCard({ companyInfo }: CompanyCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Creado por</h3>

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {companyInfo.logo ? (
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Building2 className="h-6 w-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {companyInfo.name}
          </h4>
          {companyInfo.about && (
            <p className="mt-1 text-xs text-slate-600 line-clamp-3">
              {companyInfo.about}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
