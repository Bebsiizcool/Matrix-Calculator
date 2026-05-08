import Calculator from '@/components/Calculator';
import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Matrix Calculator | Step-by-Step Solver',
  description: 'Professional matrix calculator for addition, multiplication, determinants, and inverses with detailed pedagogical steps.',
};

export default function Home() {
  return (
    <main className="container">
      <header className={styles.header}>
        <div className={styles.badge}>Final Year Project</div>
        <h1 className={styles.title}>Matrix <span className={styles.gradientText}>Calculator</span></h1>
        <p className={styles.subtitle}>
          A professional tool for matrix addition, multiplication, determinants, and inverses with step-by-step mathematical breakdowns.
        </p>
      </header>

      <section className={styles.calculatorSection}>
        <Calculator />
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Mathematics Laboratory • FYP Presentation</p>
      </footer>
    </main>
  );
}
