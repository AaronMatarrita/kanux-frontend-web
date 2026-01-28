export type CreateQuestionOption = {
  option_text: string;
  is_correct: boolean;
};

export type CreateQuestion = {
  question: string;
  question_type: "Unica" | "Multiple";
  options: CreateQuestionOption[];
};

export type CreateSoftChallengeDto = {
  title: string;
  description: string;
  challenge_type: "No Técnico";
  difficulty: "BASICO" | "INTERMEDIO" | "AVANZADO";
  duration_minutes: number;
  details: {
    instructions: string;
    questions: CreateQuestion[];
  };
};
