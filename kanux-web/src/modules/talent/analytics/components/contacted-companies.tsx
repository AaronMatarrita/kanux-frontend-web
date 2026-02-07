"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTalentAnalyticsDashboardContext } from "@/modules/talent/analytics/context/TalentAnalyticsDashboardContext";
import { formatMessageDate } from "@/lib/dateUtils";
import { MessageCircle } from "lucide-react";

export function ContactedCompanies() {
  const { data, loading, error } = useTalentAnalyticsDashboardContext();
  const companies = data?.contactedCompanies ?? [];

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Empresas contactadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg p-3 animate-pulse bg-muted/40"
              >
                <div className="space-y-2 w-2/3">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="h-8 w-8 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Empresas contactadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No se pudieron cargar las empresas contactadas.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Empresas contactadas
        </CardTitle>
      </CardHeader>

      <CardContent>
        {companies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aun no hay empresas con conversaciones recientes.
          </p>
        ) : (
          <div className="space-y-3">
            {companies.map((company, index) => (
              <div
                key={company.id}
                className={`
                  flex items-center justify-between rounded-lg p-3
                  transition-all duration-500 ease-out
                  hover:bg-muted/50
                  animate-in fade-in slide-in-from-bottom-1
                `}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div>
                  <p className="font-medium text-primary">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Ultimo mensaje: {formatMessageDate(company.lastMessageAt)}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
