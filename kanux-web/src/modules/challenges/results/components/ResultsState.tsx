import { AlertCircle, Zap, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultsStateProps {
  state: "error" | "loading" | "empty";
  error?: string;
  onBack: () => void;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}

export function ResultsState({ state, error, onBack }: ResultsStateProps) {
  if (state === "error") {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Oops, algo salió mal
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {error || "Ha ocurrido un error"}
            </p>
            <Button onClick={onBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Retos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground font-medium">
            Cargando tu resultado...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No hay datos disponibles
          </h2>
          <p className="text-muted-foreground mb-6">
            No pudimos encontrar la información del reto
          </p>
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Retos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
