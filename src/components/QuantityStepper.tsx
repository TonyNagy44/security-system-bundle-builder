import { MinusIcon, PlusIcon } from './icons';
import styles from './QuantityStepper.module.css';

interface Props {
  value: number;
  onChange: (next: number) => void;
  label: string;
  max?: number;
  disabled?: boolean;
  size?: 'md' | 'sm';
}

export function QuantityStepper({ value, onChange, label, max = 10, disabled, size = 'md' }: Props) {
  const canDecrease = !disabled && value > 0;
  const canIncrease = !disabled && value < max;

  return (
    <div className={`${styles.stepper} ${size === 'sm' ? styles.small : ''}`} data-disabled={disabled || undefined}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Remove one ${label}`}
      >
        <MinusIcon />
      </button>
      <span className={styles.value} aria-live="polite">
        <span className="visually-hidden">{label} quantity: </span>
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Add one ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
