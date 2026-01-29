import styles from "./css/aboutKanux.module.css";
import { Target, Scale, Wrench, BarChart3 } from "lucide-react";

export default function WhatIsKanux() {
  return (
    <section id="what-is" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Qué es Kánux?</h2>
          <p>
            Kánux es una plataforma basada en habilidades diseñada para conectar
            a profesionales y empresas a través de retos del mundo real. En
            lugar de currículums, Kánux se centra en lo que las personas pueden
            hacer realmente.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <Feature
            title="Las habilidades por encima de los títulos"
            description="Nos centramos en lo que puedes hacer, no en lo que dice tu cargo."
            icon={<Target size={20} />}
          />
          <Feature
            title="Oportunidades justas"
            description="Todos tienen la oportunidad de demostrar sus habilidades mediante la práctica."
            icon={<Scale size={20} />}
          />
          <Feature
            title="Práctica real"
            description="Completa desafíos reales que demuestren tus habilidades en acción."
            icon={<Wrench size={20} />}
          />
          <Feature
            title="Evaluación transparente"
            description="Comentarios claros y métricas que muestran tus verdaderas habilidades."
            icon={<BarChart3 size={20} />}
          />
        </div>

        <h3 className={styles.subTitle}>Cómo funciona</h3>

        <div className={styles.workflowGrid}>
          <Workflow
            title="Para Profesionales"
            steps={[
              "Crea un perfil basado en habilidades.",
              "Completa desafíos prácticos",
              "Recibe comentarios y verificación de habilidades",
              "Sé descubierto por empresas",
            ]}
          />

          <Workflow
            title="Para Empresas"
            steps={[
              "Crea desafíos del mundo real",
              "Evalúa el rendimiento real",
              "Analiza los datos de habilidades",
              "Conecta directamente con candidatos calificados",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.icon}>{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

function Workflow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className={styles.workflowCard}>
      <h4>{title}</h4>
      <ul>
        {steps.map((step, i) => (
          <li key={step}>
            <span className={styles.stepIndex}>{i + 1}</span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
