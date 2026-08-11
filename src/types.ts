export type VariantTone = 'light' | 'mid' | 'dark';

export interface Variant {
  id: string;
  /** `null` means the product has no colour selector — a single implicit variant. */
  label: string | null;
  tone?: VariantTone;
  price: number;
  compareAtPrice?: number;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  learnMoreUrl?: string;
  badge?: string;
  group: string;
  kind?: 'plan';
  image: string;
  reviewImage?: string;
  reviewImageWide?: boolean;
  priceSuffix?: string;
  /** Quantity is fixed and the stepper is disabled (e.g. the required hub). */
  locked?: boolean;
  /** Shown instead of `$0.00` when the resolved price is zero. */
  freeLabel?: string;
  variants: Variant[];
}

export interface Step {
  id: string;
  title: string;
  icon: string;
  selection?: 'single' | 'multi';
  productIds: string[];
}

export interface Group {
  id: string;
  label: string;
}

export interface ShippingLine {
  label: string;
  image: string;
  compareAtPrice: number;
  price: number;
  freeLabel: string;
  includeInTotals: boolean;
}

export interface CatalogMeta {
  heading: string;
  reviewEyebrow: string;
  reviewTitle: string;
  reviewSubtitle: string;
  checkoutLabel: string;
  saveLabel: string;
  financingLabel: string;
  savingsTemplate: string;
  guaranteeImage: string;
  guaranteeTitle: string;
  guaranteeBody: string;
}

export interface Catalog {
  currency: string;
  meta: CatalogMeta;
  shipping: ShippingLine;
  groups: Group[];
  steps: Step[];
  products: Product[];
  initialState: {
    openStepId: string | null;
    activeVariants: Record<string, string>;
    quantities: Record<string, number>;
  };
}

/** Quantities are keyed `${productId}:${variantId}` so each variant counts separately. */
export type QuantityKey = string;

export interface BuilderState {
  quantities: Record<QuantityKey, number>;
  activeVariants: Record<string, string>;
  openStepId: string | null;
}

export interface ReviewLine {
  key: QuantityKey;
  productId: string;
  variantId: string;
  title: string;
  image: string;
  imageWide?: boolean;
  quantity: number;
  unitPrice: number;
  unitCompareAtPrice: number;
  linePrice: number;
  lineCompareAtPrice: number;
  priceSuffix?: string;
  freeLabel?: string;
  locked?: boolean;
  showStepper: boolean;
}

export interface ReviewGroup {
  id: string;
  label: string;
  lines: ReviewLine[];
}

export interface Totals {
  total: number;
  compareAtTotal: number;
  savings: number;
}
