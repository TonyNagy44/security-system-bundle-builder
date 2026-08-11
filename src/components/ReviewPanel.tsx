import { useState } from 'react';
import { useBuilder } from '../state/BuilderProvider';
import { MAX_QUANTITY } from '../state/builderReducer';
import { reviewGroups, totals } from '../state/selectors';
import { formatPrice } from '../lib/format';
import { saveSystem } from '../state/persistence';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import styles from './ReviewPanel.module.css';

export function ReviewPanel() {
  const { catalog, state, dispatch } = useBuilder();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);

  const groups = reviewGroups(catalog, state);
  const { total, compareAtTotal, savings } = totals(catalog, state);
  const { meta, shipping } = catalog;

  const handleSave = () => {
    const ok = saveSystem(state);
    setSavedAt(ok ? 'System saved. It will be here when you come back.' : "Couldn't save — storage is unavailable in this browser.");
    window.setTimeout(() => setSavedAt(null), 4000);
  };

  return (
    <aside className={styles.panel} aria-label={meta.reviewTitle}>
      <div className={styles.lines}>
        <p className={styles.eyebrow}>{meta.reviewEyebrow}</p>
        <h2 className={styles.title}>{meta.reviewTitle}</h2>
        <p className={styles.subtitle}>{meta.reviewSubtitle}</p>

        {groups.length === 0 && (
          <p className={styles.empty}>Nothing added yet. Pick a camera to start building your system.</p>
        )}

        {groups.map((group) => (
          <section key={group.id} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul>
              {group.lines.map((line) => (
                <li key={line.key} className={styles.line}>
                  <span className={styles.thumb} data-wide={line.imageWide || undefined}>
                    <img src={line.image} alt="" />
                  </span>
                  {!line.imageWide && <span className={styles.name}>{line.title}</span>}

                  {line.showStepper ? (
                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      max={MAX_QUANTITY}
                      disabled={line.locked}
                      label={line.title}
                      onChange={(quantity) =>
                        dispatch({
                          type: 'setQuantity',
                          productId: line.productId,
                          variantId: line.variantId,
                          quantity,
                        })
                      }
                    />
                  ) : (
                    <span aria-hidden />
                  )}

                  <Price
                    variant="review"
                    layout="stacked"
                    price={line.linePrice}
                    compareAtPrice={line.lineCompareAtPrice}
                    suffix={line.priceSuffix}
                    freeLabel={line.freeLabel}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className={`${styles.line} ${styles.shippingLine}`}>
          <span className={styles.thumb}>
            <img src={shipping.image} alt="" />
          </span>
          <span className={styles.name}>{shipping.label}</span>
          <span aria-hidden />
          <Price
            variant="review"
            layout="stacked"
            price={shipping.price}
            compareAtPrice={shipping.compareAtPrice}
            freeLabel={shipping.freeLabel}
          />
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.guaranteeCopy}>
          <h3 className={styles.guaranteeTitle}>{meta.guaranteeTitle}</h3>
          <p className={styles.guaranteeBody}>{meta.guaranteeBody}</p>
        </div>

        <div className={styles.totalsRow}>
          <img className={styles.seal} src={meta.guaranteeImage} alt="100% Wyze satisfaction guarantee" />
          <div className={styles.totalsBlock}>
            <span className={styles.financing}>{meta.financingLabel}</span>
            <p className={styles.total}>
              <span className={styles.totalCompare}>{formatPrice(compareAtTotal)}</span>
              <span className={styles.totalNow}>{formatPrice(total)}</span>
            </p>
          </div>
        </div>

        {savings > 0 && (
          <p className={styles.savings}>
            {meta.savingsTemplate.replace('{amount}', formatPrice(savings))}
          </p>
        )}

        <button type="button" className={styles.checkout} onClick={() => setCheckedOut(true)}>
          {checkedOut ? 'Order placed — this is a prototype' : meta.checkoutLabel}
        </button>

        <button type="button" className={styles.saveLink} onClick={handleSave}>
          {meta.saveLabel}
        </button>

        <p className={styles.saveStatus} role="status">
          {savedAt}
        </p>
      </div>
    </aside>
  );
}
