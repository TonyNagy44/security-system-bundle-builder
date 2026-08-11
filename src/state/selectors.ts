import type {
  BuilderState,
  Catalog,
  Product,
  ReviewGroup,
  ReviewLine,
  Totals,
  Variant,
} from '../types';
import { quantityKey } from './builderReducer';

export const productById = (catalog: Catalog) =>
  new Map(catalog.products.map((p) => [p.id, p]));

export const hasVariantSelector = (product: Product) =>
  product.variants.length > 1 || product.variants[0]?.label !== null;

export function activeVariant(product: Product, state: BuilderState): Variant {
  const id = state.activeVariants[product.id];
  return product.variants.find((v) => v.id === id) ?? product.variants[0];
}

export const quantityOf = (state: BuilderState, productId: string, variantId: string) =>
  state.quantities[quantityKey(productId, variantId)] ?? 0;

/** Total across every variant of a product — drives the card's selected state. */
export const productQuantity = (state: BuilderState, product: Product) =>
  product.variants.reduce((sum, v) => sum + quantityOf(state, product.id, v.id), 0);

/**
 * "N selected" counts distinct *products* with any variant above zero, per the brief.
 * Red + Blue of one camera is one selection, not two.
 */
export function stepSelectedCount(catalog: Catalog, state: BuilderState, stepId: string) {
  const step = catalog.steps.find((s) => s.id === stepId);
  if (!step) return 0;
  const byId = productById(catalog);
  return step.productIds.reduce((count, id) => {
    const product = byId.get(id);
    return product && productQuantity(state, product) > 0 ? count + 1 : count;
  }, 0);
}

export function reviewGroups(catalog: Catalog, state: BuilderState): ReviewGroup[] {
  const order = catalog.products.map((p) => p.id);

  return catalog.groups
    .map((group) => {
      const lines: ReviewLine[] = [];

      for (const product of catalog.products) {
        if (product.group !== group.id) continue;

        // Only qualify a line with its colour when the same product appears
        // more than once — matching the design, which shows bare titles.
        const chosenVariants = product.variants.filter(
          (v) => quantityOf(state, product.id, v.id) > 0,
        ).length;

        for (const variant of product.variants) {
          const quantity = quantityOf(state, product.id, variant.id);
          if (quantity <= 0) continue;

          const unitCompareAtPrice = variant.compareAtPrice ?? variant.price;
          const label =
            variant.label && chosenVariants > 1
              ? `${product.title} — ${variant.label}`
              : product.title;

          lines.push({
            key: quantityKey(product.id, variant.id),
            productId: product.id,
            variantId: variant.id,
            title: label,
            image: product.reviewImage ?? product.image,
            imageWide: product.reviewImageWide,
            quantity,
            unitPrice: variant.price,
            unitCompareAtPrice,
            linePrice: variant.price * quantity,
            lineCompareAtPrice: unitCompareAtPrice * quantity,
            priceSuffix: product.priceSuffix,
            freeLabel: product.freeLabel,
            locked: product.locked,
            showStepper: product.kind !== 'plan',
          });
        }
      }

      return { id: group.id, label: group.label, lines };
    })
    .filter((group) => group.lines.length > 0)
    .map((group) => ({
      ...group,
      lines: group.lines.sort(
        (a, b) => order.indexOf(a.productId) - order.indexOf(b.productId),
      ),
    }));
}

/**
 * Shipping is displayed as a struck-through line but excluded from both totals,
 * which is what reconciles the design's $238.81 / $187.89 pair.
 */
export function totals(catalog: Catalog, state: BuilderState): Totals {
  const groups = reviewGroups(catalog, state);
  let total = 0;
  let compareAtTotal = 0;

  for (const group of groups) {
    for (const line of group.lines) {
      total += line.linePrice;
      compareAtTotal += line.lineCompareAtPrice;
    }
  }

  if (catalog.shipping.includeInTotals) {
    total += catalog.shipping.price;
    compareAtTotal += catalog.shipping.compareAtPrice;
  }

  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    total: round(total),
    compareAtTotal: round(compareAtTotal),
    savings: round(compareAtTotal - total),
  };
}

export const isProductSelectedInSingleStep = (state: BuilderState, product: Product) =>
  productQuantity(state, product) > 0;
