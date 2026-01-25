import { BookOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResultsFeedbackProps {
  markdown?: string;
}

export function ResultsFeedback({ markdown }: ResultsFeedbackProps) {
  if (!markdown) return null;

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Retroalimentación
        </CardTitle>

        <div className="flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Esta retroalimentación fue generada por una inteligencia artificial
            y puede no ser completamente precisa. Úsala como guía de apoyo, no
            como una evaluación definitiva.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className="
            prose prose-sm max-w-none
            prose-headings:font-semibold
            prose-headings:text-foreground
            prose-h2:mt-6 prose-h2:mb-2
            prose-p:leading-relaxed
            prose-li:my-1
            prose-strong:text-foreground
            dark:prose-invert
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
