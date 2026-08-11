import { BuilderStep } from './components/BuilderStep';
import { ReviewPanel } from './components/ReviewPanel';
import { useBuilder } from './state/BuilderProvider';
import styles from './App.module.css';

export default function App() {
  const { catalog } = useBuilder();

  return (
    <div className={styles.page}>
      <main className={styles.layout}>
        <h1 className={styles.heading}>{catalog.meta.heading}</h1>

        <div className={styles.builder}>
          {catalog.steps.map((step, index) => (
            <BuilderStep
              key={step.id}
              step={step}
              index={index}
              total={catalog.steps.length}
              nextStep={catalog.steps[index + 1]}
            />
          ))}
        </div>

        <div className={styles.review}>
          <ReviewPanel />
        </div>
      </main>
    </div>
  );
}
