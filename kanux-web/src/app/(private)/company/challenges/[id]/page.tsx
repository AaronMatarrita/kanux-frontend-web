"use client";
import React from "react";
import {
  ArrowLeft,
  Building2,
  FileText,
  Clock,
  HelpCircle,
  Calendar,
  Circle,
  Info,
} from "lucide-react";

const fakeChallenge = {
  id: "bdaed29b-bd06-42f0-a874-ec9dfb28fedd",
  title: "Soft Skills Evaluation",
  description:
    "Evaluate communication and teamwork skills through a series of situational questions. This challenge assesses how candidates handle team dynamics, conflict resolution, and collaborative problem-solving in a professional environment.",
  challenge_type: "No Técnico",
  difficulty: "Básico",
  duration_minutes: 30,
  created_at: "2026-01-19T07:13:19.691Z",
  company: {
    name: "ITech Solutions",
  },
  non_technical_challenges: [
    {
      instructions:
        "Select the correct answer for each question. Consider the best professional approach in each scenario.",
      non_technical_questions: [
        {
          id: "1",
          question: "¿Cómo actúas ante un conflicto dentro del equipo?",
          non_technical_question_options: [
            { id: "1a", option_text: "Talk openly with the team" },
            { id: "1b", option_text: "Ignore the problem" },
          ],
        },
        {
          id: "2",
          question:
            "¿Cómo priorizas tus tareas cuando tienes múltiples deadlines?",
          non_technical_question_options: [
            {
              id: "2a",
              option_text: "Evalúo la urgencia e importancia de cada tarea",
            },
            {
              id: "2b",
              option_text: "Trabajo en orden de llegada",
            },
            {
              id: "2c",
              option_text: "Empiezo por las más fáciles",
            },
          ],
        },
      ],
    },
  ],
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const BackButton = () => (
  <button
    onClick={() => window.history.back()}
    className="mb-4 flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-sm font-medium transition cursor-pointer"
  >
    <ArrowLeft size={16} /> Volver al listado
  </button>
);

const Badge = ({
  text,
  color = "emerald",
}: {
  text: string;
  color?: "emerald" | "green";
}) => {
  const styles =
    color === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${styles}`}>
      {text}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50">
      <Icon size={18} className="text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const ChallengeHeader = ({
  challenge,
}: {
  challenge: typeof fakeChallenge;
}) => {
  const questions =
    challenge.non_technical_challenges[0].non_technical_questions;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {challenge.title}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <Building2 size={14} />
            {challenge.company.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            text={
              challenge.difficulty === "Básico"
                ? "Principiante"
                : challenge.difficulty
            }
          />
          <Badge text="Vista de empresa" color="emerald" />
        </div>
      </div>

      <p className="text-slate-600 mt-4 text-sm">{challenge.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          icon={FileText}
          label="Tipo"
          value={challenge.challenge_type}
        />
        <StatCard
          icon={Clock}
          label="Duración"
          value={`${challenge.duration_minutes} minutos`}
        />
        <StatCard
          icon={HelpCircle}
          label="Preguntas"
          value={`${questions.length} preguntas`}
        />
        <StatCard
          icon={Calendar}
          label="Creado"
          value={formatDate(challenge.created_at)}
        />
      </div>
    </div>
  );
};

const InstructionsBox = ({ text }: { text: string }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex gap-2">
    <Info size={16} className="text-slate-500 mt-0.5" />
    <p className="text-xs text-slate-500">
      Instrucciones: <span className="text-slate-700">{text}</span>
    </p>
  </div>
);

const QuestionCard = ({
  index,
  question,
  options,
}: {
  index: number;
  question: string;
  options: { id: string; option_text: string }[];
}) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
        {index}
      </span>
      <h3 className="font-medium text-slate-900">{question}</h3>
    </div>

    <p className="ml-10 text-xs text-slate-400 mt-1">
      Tipo de respuesta: Selección única
    </p>

    <div className="ml-10 mt-3 space-y-2">
      {options.map((opt) => (
        <div
          key={opt.id}
          className="flex items-center gap-3 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
        >
          <Circle size={16} className="text-slate-300" />
          <span className="text-sm text-slate-700">{opt.option_text}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChallengeQuestions = ({
  challenge,
}: {
  challenge: typeof fakeChallenge;
}) => {
  const block = challenge.non_technical_challenges[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
        <HelpCircle size={20} />
        Preguntas del Challenge
      </h2>

      <InstructionsBox text={block.instructions} />

      <div className="space-y-8">
        {block.non_technical_questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i + 1}
            question={q.question}
            options={q.non_technical_question_options}
          />
        ))}
      </div>
    </div>
  );
};

export default function ChallengeDetailPage() {
  const challenge = fakeChallenge;

  return (
    <div className="mx-auto py-8 px-8">
      <BackButton />
      <ChallengeHeader challenge={challenge} />
      <ChallengeQuestions challenge={challenge} />

      <p className="text-center text-xs text-slate-400 mt-6">
        Creado el {formatDate(challenge.created_at)} a las 01:13
      </p>
    </div>
  );
}
