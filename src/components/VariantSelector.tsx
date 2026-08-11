import type { Product, Variant } from '../types';
import styles from './VariantSelector.module.css';

interface Props {
  product: Product;
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

/**
 * The design shows a tiny photo of the product in each colour. Those thumbnails
 * were never exported, so the product photo is reused and tone-shifted per
 * variant — swap in real per-variant images and the markup is unchanged.
 */
const toneFilter: Record<string, string> = {
  light: 'none',
  mid: 'grayscale(1) brightness(0.82)',
  dark: 'grayscale(1) brightness(0.32) contrast(1.3)',
};

export function VariantSelector({ product, activeVariantId, onSelect }: Props) {
  return (
    <div className={styles.row} role="radiogroup" aria-label={`${product.title} colour`}>
      {product.variants.map((variant: Variant) => {
        const active = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={styles.chip}
            data-active={active || undefined}
            onClick={() => onSelect(variant.id)}
          >
            <img
              className={styles.swatch}
              src={product.image}
              alt=""
              style={{ filter: toneFilter[variant.tone ?? 'light'] }}
            />
            <span className={styles.label}>{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
