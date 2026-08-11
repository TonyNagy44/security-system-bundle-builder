import type { Product, Step } from '../types';
import { useBuilder } from '../state/BuilderProvider';
import { MAX_QUANTITY } from '../state/builderReducer';
import { activeVariant, hasVariantSelector, productQuantity, quantityOf } from '../state/selectors';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import { VariantSelector } from './VariantSelector';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  step: Step;
}

export function ProductCard({ product, step }: Props) {
  const { state, dispatch } = useBuilder();

  const variant = activeVariant(product, state);
  const quantity = quantityOf(state, product.id, variant.id);
  const selected = productQuantity(state, product) > 0;
  const singleSelect = step.selection === 'single';

  const setQuantity = (next: number) =>
    dispatch({ type: 'setQuantity', productId: product.id, variantId: variant.id, quantity: next });

  const chooseOnly = () =>
    dispatch({
      type: 'selectOnly',
      stepProductIds: step.productIds,
      productId: product.id,
      variantId: variant.id,
    });

  return (
    <article className={styles.card} data-selected={selected || undefined}>
      {product.badge && <span className={styles.badge}>{product.badge}</span>}

      <div className={styles.media}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>

        {product.description && (
          <p className={styles.description}>
            {product.description}{' '}
            {product.learnMoreUrl && (
              <a className={styles.learnMore} href={product.learnMoreUrl}>
                Learn More
              </a>
            )}
          </p>
        )}

        {hasVariantSelector(product) && (
          <VariantSelector
            product={product}
            activeVariantId={variant.id}
            onSelect={(variantId) => dispatch({ type: 'selectVariant', productId: product.id, variantId })}
          />
        )}

        <div className={styles.footer}>
          {singleSelect ? (
            <button
              type="button"
              className={styles.choose}
              onClick={chooseOnly}
              data-active={quantity > 0 || undefined}
              aria-pressed={quantity > 0}
            >
              {quantity > 0 ? 'Selected' : 'Select'}
            </button>
          ) : (
            <QuantityStepper
              value={quantity}
              max={MAX_QUANTITY}
              disabled={product.locked}
              label={variant.label ? `${product.title} ${variant.label}` : product.title}
              onChange={setQuantity}
            />
          )}

          <Price
            price={variant.price}
            compareAtPrice={variant.compareAtPrice}
            suffix={product.priceSuffix}
            freeLabel={product.freeLabel}
            variant="card"
          />
        </div>
      </div>
    </article>
  );
}
