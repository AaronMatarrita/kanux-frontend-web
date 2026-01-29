import styles from "./css/FeatureSection.module.css";

interface FeatureSectionProps {
  title: string;
  description: string;
  features: string[];
  cta: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  features,
  cta,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
      <div className={styles.sectionContent}>
        <div className={styles.textBlock}>
          <h2>{title}</h2>
          <p>{description}</p>

          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature}>
                <span className={styles.checkIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button className={styles.primaryButton}>
            {cta}
            <span>→</span>
          </button>
        </div>

        <div className={styles.imageBlock}>
          <div className={styles.placeholderImage}>IMG</div>
        </div>
      </div>
    </section>
  );
}
