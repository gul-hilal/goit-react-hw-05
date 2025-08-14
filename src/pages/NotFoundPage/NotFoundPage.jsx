import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Üzgünüz, aradığınız sayfa bulunamadı.</p>
    </div>
  );
}
