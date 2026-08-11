import { useId } from 'react';
import type { Step } from '../types';
import { useBuilder } from '../state/BuilderProvider';
import { productById, stepSelectedCount } from '../state/selectors';
import { ChevronIcon, STEP_ICONS } from './icons';
import { ProductCard } from './ProductCard';
import styles from './BuilderStep.module.css';

interface Props {
  step: Step;
  index: number;
  total: number;
  nextStep?: Step;
}

export function BuilderStep({ step, index, total, nextStep }: Props) {
  const { catalog, state, dispatch } = useBuilder();
  const panelId = useId();
  const headerId = useId();

  const open = state.openStepId === step.id;
  const count = stepSelectedCount(catalog, state, step.id);
  const Icon = STEP_ICONS[step.icon] ?? STEP_ICONS.camera;
  const byId = productById(catalog);
  const products = step.productIds.map((id) => byId.get(id)).filter(Boolean);

  return (
    <section className={styles.step} data-open={open || undefined}>
      <p className={styles.eyebrow}>
        Step {index + 1} of {total}
      </p>

      <h2>
        <button
          type="button"
          id={headerId}
          className={styles.header}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => dispatch({ type: 'toggleStep', stepId: step.id })}
        >
          <span className={styles.icon}>
            <Icon />
          </span>
          <span className={styles.title}>{step.title}</span>
          <span className={styles.state}>
            <span className={styles.count} data-visible={count > 0 || undefined}>
              {count} selected
            </span>
            <ChevronIcon className={open ? styles.chevronUp : styles.chevron} />
          </span>
        </button>
      </h2>

      {open && (
        <div className={styles.panel} id={panelId} role="region" aria-labelledby={headerId}>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product!.id} product={product!} step={step} />
            ))}
          </div>

          {nextStep && (
            <div className={styles.nextRow}>
              <button
                type="button"
                className={styles.next}
                onClick={() => dispatch({ type: 'openStep', stepId: nextStep.id })}
              >
                Next: {nextStep.title.replace(/^Choose your /, 'Choose your ')}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
