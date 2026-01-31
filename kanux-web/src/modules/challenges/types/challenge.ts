export type Difficulty = "Básico" | "Intermedio" | "Avanzado";
export type QuestionType = "Unica" | "Multiple";

export type CreateQuestionOption = {
  option_text: string;
  is_correct: boolean;
};

export type CreateQuestion = {
  question: string;
  question_type: QuestionType;
  options: CreateQuestionOption[];
};

export type CreateSoftChallengeDto = {
  title: string;
  description: string;
  challenge_type: "No Técnico";
  difficulty: Difficulty;
  duration_minutes: number;
  details: {
    instructions: string;
    questions: CreateQuestion[];
  };
};
