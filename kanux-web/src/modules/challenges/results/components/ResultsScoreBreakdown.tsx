import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  scoreBreakdown?: Record<string, number>;
}

export function ResultsScoreBreakdown({ scoreBreakdown }: Props) {
  if (!scoreBreakdown || Object.keys(scoreBreakdown).length === 0) return null;

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Desglose de Puntuación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(scoreBreakdown).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="capitalize text-muted-foreground">
              {key.replace(/_/g, " ")}
            </span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
