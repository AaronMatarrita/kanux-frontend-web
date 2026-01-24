"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { challengesService } from "@/services/challenges.service";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Clock,
  FileText,
  Code2,
  FlaskConical,
  Layers,
  HelpCircle,
  Play,
  Building2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

/* ============================================================
  TYPES
============================================================ */
interface PageProps {
  params: Promise<{ id: string }>;
}

/* ============================================================
  MARKDOWN RENDERER
============================================================ */
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-slate">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");

            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines
                  className="rounded-md text-sm my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className="bg-slate-100 text-slate-800 rounded px-1.5 py-0.5 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-slate-900 mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 leading-relaxed mb-3">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="text-slate-700">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ============================================================
  DIFFICULTY CONFIG
============================================================ */
const difficultyConfig: Record<
  string,
  { label: string; className: string; icon: any }
> = {
  Básico: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  Intermedio: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  Avanzado: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
  Basic: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  Intermediate: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  Advanced: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
};

/* ============================================================
  HELPERS
============================================================ */
function formatDuration(minutes?: number) {
  if (!minutes) return "No especificado";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ""}`;
  return `${minutes}m`;
}

function getStartButtonProps(isTechnical: boolean, startUrl: string) {
  if (isTechnical) {
    return {
      href: startUrl,
      disabled: false,
      label: "Iniciar challenge",
    };
  }

  return {
    href: "#",
    disabled: true,
    label: "Disponible pronto",
  };
}

function Pill({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-slate-600">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="font-medium text-slate-900 text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
  PAGE
============================================================ */
export default function ChallengeDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [isTechnical, setIsTechnical] = useState(false);
  const [techData, setTechData] = useState<any>(null);
  const [softData, setSoftData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      try {
        const res = await challengesService.getPublicTechnicalChallengeDetail(
          resolvedParams.id,
        );
        setTechData(res.data);
        setIsTechnical(true);
      } catch {
        try {
          const soft = await challengesService.getSoftChallenge(
            resolvedParams.id,
          );
          setSoftData(soft);
          setIsTechnical(false);
        } catch {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500">Cargando challenge…</p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Challenge no encontrado"
        description="No pudimos cargar los detalles del challenge. Intenta nuevamente."
      />
    );
  }

  const challenge = isTechnical ? techData : softData;
  const difficulty = challenge?.difficulty || "Básico";
  const diffConfig = difficultyConfig[difficulty] || difficultyConfig["Básico"];
  const DiffIcon = diffConfig.icon;
  const startUrl = isTechnical ? `/talent/challenges/${id}/execute` : "#";
  const startBtn = getStartButtonProps(isTechnical, startUrl);

  const companyInfo = challenge?.company
    ? {
        name: challenge.company.name,
        about: challenge.company.about,
        logo: challenge.company.url_logo,
      }
    : {
        name: "KÁNUX",
        about: "Challenge oficial de la plataforma KÁNUX",
        logo: null,
      };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a challenges
        </button>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm">
              <DiffIcon className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                {challenge?.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Pill
                  icon={Clock}
                  text={formatDuration(challenge?.duration_minutes)}
                />
                <Pill
                  icon={FileText}
                  text={isTechnical ? "Técnico" : "No técnico"}
                />

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${diffConfig.className}`}
                >
                  {diffConfig.label}
                </span>

                {!isTechnical && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200">
                    Soft Skills
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={startBtn.href}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition
            ${
              startBtn.disabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-[#2EC27E] text-white hover:bg-[#28b76a]"
            }`}
          >
            <Play className="h-4 w-4" />
            {startBtn.label}
          </Link>
        </div>
      </section>

      {/* BODY */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MAIN */}
        <div className="space-y-6 md:col-span-2">
          {/* DESCRIPTION */}
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Descripción
            </h2>
            {challenge?.description ? (
              <MarkdownRenderer content={challenge.description} />
            ) : (
              <p className="text-slate-500">Sin descripción disponible.</p>
            )}
          </section>

          {/* TECHNICAL ONLY */}
          {isTechnical &&
            techData?.assets?.challenge?.constraints?.length > 0 && (
              <section className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Restricciones
                </h2>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                  {techData.assets.challenge.constraints.map(
                    (c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ),
                  )}
                </ul>
              </section>
            )}

          {/* SOFT ONLY */}
          {!isTechnical && (
            <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Acerca del challenge
              </h2>

              {softData?.non_technical_challenges?.[0]?.instructions && (
                <p className="text-sm text-slate-600">
                  {softData.non_technical_challenges[0].instructions}
                </p>
              )}

              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <HelpCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">
                    Este challenge contiene{" "}
                    <span className="font-bold text-slate-900">
                      {softData?.non_technical_challenges?.[0]
                        ?.non_technical_questions?.length || 0}
                    </span>{" "}
                    preguntas para evaluar tus soft skills.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 md:sticky md:top-6 h-fit">
          <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Resumen del challenge
            </h3>

            <InfoRow
              icon={FileText}
              label="Tipo"
              value={isTechnical ? "Técnico" : "No técnico"}
            />
            <InfoRow
              icon={Clock}
              label="Duración"
              value={formatDuration(challenge?.duration_minutes)}
            />
            <InfoRow icon={DiffIcon} label="Dificultad" value={difficulty} />

            {isTechnical &&
              techData?.assets?.test_cases?.test_cases?.length > 0 && (
                <InfoRow
                  icon={CheckCircle2}
                  label="Casos de prueba"
                  value={`${techData.assets.test_cases.test_cases.length} casos`}
                />
              )}

            {!isTechnical &&
              softData?.non_technical_challenges?.[0]?.non_technical_questions
                ?.length > 0 && (
                <InfoRow
                  icon={HelpCircle}
                  label="Preguntas"
                  value={`${softData.non_technical_challenges[0].non_technical_questions.length} preguntas`}
                />
              )}
          </div>

          {/* COMPANY */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Creado por
            </h3>

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
        </aside>
      </div>
    </div>
  );
}
