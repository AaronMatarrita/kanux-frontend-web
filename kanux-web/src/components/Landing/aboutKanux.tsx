import styles from "./css/aboutKanux.module.css";
import {
  Target,
  Scale,
  Wrench,
  BarChart3,
} from "lucide-react";


export default function WhatIsKanux() {
  return (
    <section id="what-is" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What is Kánux?</h2>
          <p>
            Kánux is a skill-based platform designed to connect professionals and
            companies through real-world challenges. Instead of resumes, Kánux
            focuses on what people can actually do.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <Feature
            title="Skills over titles"
            description="We focus on what you can do, not what your job title says."
            icon={<Target size={20} />}
          />
          <Feature
            title="Fair opportunities"
            description="Everyone gets a chance to prove their abilities through practice."
            icon={<Scale size={20} />}
          />
          <Feature
            title="Real practice"
            description="Complete actual challenges that showcase your skills in action."
            icon={<Wrench size={20} />}
          />
          <Feature
            title="Transparent evaluation"
            description="Clear feedback and metrics show your true capabilities."
            icon={<BarChart3 size={20} />}
          />
        </div>

        <h3 className={styles.subTitle}>How it works</h3>

        <div className={styles.workflowGrid}>
          <Workflow
            title="For Professionals"
            steps={[
              "Create a skill-based profile",
              "Complete practical challenges",
              "Receive feedback and skill verification",
              "Get discovered by companies",
            ]}
          />

          <Workflow
            title="For Companies"
            steps={[
              "Create real-world challenges",
              "Evaluate real performance",
              "Analyze skill data",
              "Connect directly with candidates",
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

function Workflow({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
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
