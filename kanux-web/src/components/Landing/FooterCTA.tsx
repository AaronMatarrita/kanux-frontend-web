import styles from "./css/FooterCTA.module.css";

export default function FooterCTA() {
  return (
    <footer className={styles.footer}>
      <div className={styles.cta}>
        <h3>Ready to grow with Kánux?</h3>

        <div className={styles.actions}>
          <a href="/register" className={styles.primaryBtn}>
            Get started →
          </a>
          <a href="/login" className={styles.secondaryBtn}>
            Login
          </a>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <div className={styles.brand}>
          <span className={styles.logo}>K</span>
          <p>
            Connecting professionals and companies through real challenges and
            verified skills
          </p>
        </div>

        <div className={styles.links}>
          <h4>Links</h4>
          <a href="/about">About</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>

        <div className={styles.try}>
          <h4>Try It Today</h4>
          <a href="/register" className={styles.tryBtn}>
            Start today →
          </a>
        </div>
      </div>

      <p className={styles.copy}>© 2026 Kánux. All rights reserved.</p>
    </footer>
  );
}
