import { formatPrice } from '../lib/format';
import styles from './Price.module.css';

interface Props {
  price: number;
  compareAtPrice?: number;
  suffix?: string;
  freeLabel?: string;
  /** `card` strikes through in red, `review` in grey — matching the design. */
  variant?: 'card' | 'review';
  layout?: 'inline' | 'stacked';
}

export function Price({
  price,
  compareAtPrice,
  suffix,
  freeLabel,
  variant = 'card',
  layout = 'inline',
}: Props) {
  const showCompare = compareAtPrice !== undefined && compareAtPrice > price;
  const isFree = price === 0 && Boolean(freeLabel);

  return (
    <p className={`${styles.price} ${styles[variant]} ${styles[layout]}`}>
      {showCompare && (
        <span className={styles.compare}>
          {formatPrice(compareAtPrice!)}
          {suffix}
        </span>
      )}
      <span className={styles.current}>
        {isFree ? freeLabel : formatPrice(price)}
        {!isFree && suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </span>
    </p>
  );
}
