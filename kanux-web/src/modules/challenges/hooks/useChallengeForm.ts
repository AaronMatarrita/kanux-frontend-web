"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CreateSoftChallengeDto } from "../types/challenge";
import { challengesService } from "@/services/challenges.service";

export type QuestionFormData = {
  id: string;
  question: string;
  question_type: "Unica" | "Multiple";
  options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
};

const createInitialQuestion = (): QuestionFormData => ({
  id: crypto.randomUUID(),
  question: "",
  question_type: "Unica",
  options: [
    { id: crypto.randomUUID(), option_text: "", is_correct: false },
    { id: crypto.randomUUID(), option_text: "", is_correct: false },
  ],
});

export function useCreateSoftChallenge(companyId: string) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<
    "Básico" | "Intermedio" | "Avanzado"
  >("Básico");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<QuestionFormData[]>([
    createInitialQuestion(),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- helpers -------------------- */

  const addQuestion = () =>
    setQuestions((q) => [...q, createInitialQuestion()]);

  const removeQuestion = (questionId: string) =>
    setQuestions((q) =>
      q.length > 1 ? q.filter((x) => x.id !== questionId) : q,
    );

  const updateQuestion = (
    questionId: string,
    field: keyof QuestionFormData,
    value: string,
  ) =>
    setQuestions((q) =>
      q.map((x) => (x.id === questionId ? { ...x, [field]: value } : x)),
    );

  const addOption = (questionId: string) =>
    setQuestions((q) =>
      q.map((x) =>
        x.id === questionId
          ? {
              ...x,
              options: [
                ...x.options,
                {
                  id: crypto.randomUUID(),
                  option_text: "",
                  is_correct: false,
                },
              ],
            }
          : x,
      ),
    );

  const removeOption = (questionId: string, optionId: string) =>
    setQuestions((q) =>
      q.map((x) =>
        x.id === questionId && x.options.length > 2
          ? {
              ...x,
              options: x.options.filter((o) => o.id !== optionId),
            }
          : x,
      ),
    );

  const updateOption = (
    questionId: string,
    optionId: string,
    field: "option_text" | "is_correct",
    value: string | boolean,
  ) =>
    setQuestions((q) =>
      q.map((x) =>
        x.id === questionId
          ? {
              ...x,
              options: x.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o,
              ),
            }
          : x,
      ),
    );

  /* -------------------- validation -------------------- */

  const validate = (): string | null => {
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    if (!instructions.trim()) return "Instructions are required";
    if (durationMinutes < 1) return "Duration must be greater than 0";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} is empty`;
      if (q.options.some((o) => !o.option_text.trim()))
        return `Question ${i + 1} has empty options`;
    }

    return null;
  };

  /* -------------------- submit -------------------- */

  const submit = async () => {
    if (isSubmitting) return;

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    const difficultyMap = {
      Básico: "BASICO",
      Intermedio: "INTERMEDIO",
      Avanzado: "AVANZADO",
    } as const;

    const payload: CreateSoftChallengeDto = {
      title,
      description,
      challenge_type: "No Técnico",
      difficulty: difficultyMap[difficulty],
      duration_minutes: durationMinutes,
      details: {
        instructions,
        questions: questions.map((q) => ({
          question: q.question,
          question_type: q.question_type,
          options: q.options.map((o) => ({
            option_text: o.option_text,
            is_correct: o.is_correct,
          })),
        })),
      },
    };

    try {
      await challengesService.createSoftChallenge(companyId, payload);

      toast.success("Soft challenge created successfully");
      router.push("/challenges");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ?? "Failed to create soft challenge";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    /* state */
    title,
    description,
    difficulty,
    durationMinutes,
    instructions,
    questions,
    isSubmitting,

    /* setters */
    setTitle,
    setDescription,
    setDifficulty,
    setDurationMinutes,
    setInstructions,

    /* actions */
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
    submit,
  };
}
