"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useCreateSoftChallenge } from "../hooks/useChallengeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectOption } from "@/components/ui/select";

const difficultyOptions: SelectOption[] = [
  { label: "Principiante", value: "Básico" },
  { label: "Intermedio", value: "Intermedio" },
  { label: "Avanzado", value: "Avanzado" },
];

const questionTypeOptions: SelectOption[] = [
  { label: "Respuesta única", value: "Unica" },
  { label: "Respuesta múltiple", value: "Multiple" },
];

export function CreateSoftChallengeForm() {
  const form = useCreateSoftChallenge();

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>

        <h1 className="text-2xl font-bold">Crear Soft Challenge</h1>
        <p className="text-muted-foreground mt-1">
          Crea un nuevo reto no técnico para evaluar habilidades blandas.
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => form.setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => form.setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Dificultad *</Label>
                <Select
                  value={form.difficulty}
                  onChange={(v) =>
                    form.setDifficulty(
                      v as "Básico" | "Intermedio" | "Avanzado",
                    )
                  }
                  options={difficultyOptions}
                />
              </div>

              <div className="space-y-2">
                <Label>Duración (minutos) *</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) =>
                    form.setDurationMinutes(Number(e.target.value))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* INSTRUCTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={3}
              value={form.instructions}
              onChange={(e) => form.setInstructions(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* QUESTIONS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Preguntas</CardTitle>
            <Badge variant="secondary">
              {form.questions.length} pregunta(s)
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {form.questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="p-4 border rounded-lg space-y-4 bg-muted/30"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Pregunta {qIndex + 1}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => form.removeQuestion(question.id)}
                    disabled={form.questions.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  rows={2}
                  placeholder="Texto de la pregunta"
                  value={question.question}
                  onChange={(e) =>
                    form.updateQuestion(question.id, "question", e.target.value)
                  }
                />

                <div className="max-w-xs">
                  <Select
                    value={question.question_type}
                    onChange={(v) =>
                      form.updateQuestion(question.id, "question_type", v)
                    }
                    options={questionTypeOptions}
                  />
                </div>

                {/* OPTIONS */}
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <Checkbox
                        checked={option.is_correct}
                        onCheckedChange={(checked) =>
                          form.updateOption(
                            question.id,
                            option.id,
                            "is_correct",
                            checked === true,
                          )
                        }
                      />

                      <Input
                        className="flex-1"
                        placeholder={`Opción ${oIndex + 1}`}
                        value={option.option_text}
                        onChange={(e) =>
                          form.updateOption(
                            question.id,
                            option.id,
                            "option_text",
                            e.target.value,
                          )
                        }
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          form.removeOption(question.id, option.id)
                        }
                        disabled={question.options.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => form.addOption(question.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar opción
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={form.addQuestion}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar pregunta
            </Button>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => history.back()}
            disabled={form.isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            className="bg-emerald-600"
            onClick={form.submit}
            disabled={form.isSubmitting}
          >
            {form.isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Crear Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
