import type { BuilderState, Catalog } from '../types';

export const MAX_QUANTITY = 10;

export const quantityKey = (productId: string, variantId: string) => `${productId}:${variantId}`;

export type BuilderAction =
  | { type: 'toggleStep'; stepId: string }
  | { type: 'openStep'; stepId: string }
  | { type: 'selectVariant'; productId: string; variantId: string }
  | { type: 'setQuantity'; productId: string; variantId: string; quantity: number }
  | { type: 'adjustQuantity'; productId: string; variantId: string; delta: number }
  | { type: 'selectOnly'; stepProductIds: string[]; productId: string; variantId: string }
  | { type: 'restore'; state: BuilderState };

const clamp = (n: number) => Math.max(0, Math.min(MAX_QUANTITY, n));

/** Drops zero entries so persisted state and equality checks stay tidy. */
function writeQuantity(
  quantities: BuilderState['quantities'],
  key: string,
  quantity: number,
): BuilderState['quantities'] {
  const next = { ...quantities };
  if (quantity <= 0) delete next[key];
  else next[key] = quantity;
  return next;
}

export function createInitialState(catalog: Catalog): BuilderState {
  return {
    openStepId: catalog.initialState.openStepId,
    activeVariants: { ...catalog.initialState.activeVariants },
    quantities: { ...catalog.initialState.quantities },
  };
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'toggleStep':
      return { ...state, openStepId: state.openStepId === action.stepId ? null : action.stepId };

    case 'openStep':
      return { ...state, openStepId: action.stepId };

    case 'selectVariant':
      return {
        ...state,
        activeVariants: { ...state.activeVariants, [action.productId]: action.variantId },
      };

    case 'setQuantity': {
      const key = quantityKey(action.productId, action.variantId);
      return { ...state, quantities: writeQuantity(state.quantities, key, clamp(action.quantity)) };
    }

    case 'adjustQuantity': {
      const key = quantityKey(action.productId, action.variantId);
      const current = state.quantities[key] ?? 0;
      return { ...state, quantities: writeQuantity(state.quantities, key, clamp(current + action.delta)) };
    }

    /** Single-select steps (the plan): choosing one clears the others in that step. */
    case 'selectOnly': {
      const quantities = { ...state.quantities };
      for (const key of Object.keys(quantities)) {
        const [productId] = key.split(':');
        if (action.stepProductIds.includes(productId)) delete quantities[key];
      }
      quantities[quantityKey(action.productId, action.variantId)] = 1;
      return { ...state, quantities };
    }

    case 'restore':
      return action.state;

    default:
      return state;
  }
}
