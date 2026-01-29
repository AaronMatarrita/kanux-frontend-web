import styles from "./css/FeatureSection.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";



interface FeatureSectionProps {
  title: string;
  description: string;
  features: string[];
  cta: string;
  imageUrl: string;
  imageAlt?: string;
  reverse?: boolean;
  variant?: "talent" | "company";
  ctaHref?: string;
}

export default function FeatureSection({
  title,
  description,
  features,
  cta,
  imageUrl,
  imageAlt = "",
  reverse = false,
  variant = "talent",
  ctaHref,
}: FeatureSectionProps) {
  const router = useRouter();
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

          <button  onClick={() => ctaHref && router.push(ctaHref)} className={styles.primaryButton}>
            {cta}
            <span>→</span>
          </button>
        </div>

        <div
          className={`${styles.imageBlock} ${
            variant === "company" ? styles.company : styles.talent
          }`}
        >
          <Image
            src={`/landing/${imageUrl}`}
            alt={imageAlt}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
