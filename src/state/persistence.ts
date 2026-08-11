import type { BuilderState, Catalog } from '../types';

const STORAGE_KEY = 'wyze.bundle-builder.v1';

interface SavedPayload {
  version: 1;
  savedAt: string;
  state: BuilderState;
}

export function saveSystem(state: BuilderState): boolean {
  try {
    const payload: SavedPayload = { version: 1, savedAt: new Date().toISOString(), state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // Private mode or a full quota — saving is best-effort, the app keeps working.
    return false;
  }
}

export function clearSavedSystem() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Reads the saved system and drops anything the current catalog no longer knows
 * about, so a catalog change can't resurrect a deleted product or a stale price.
 */
export function loadSystem(catalog: Catalog): BuilderState | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as SavedPayload;
    if (payload?.version !== 1 || !payload.state) return null;

    const validKeys = new Set<string>();
    const validVariants = new Map<string, Set<string>>();
    for (const product of catalog.products) {
      const ids = new Set(product.variants.map((v) => v.id));
      validVariants.set(product.id, ids);
      for (const id of ids) validKeys.add(`${product.id}:${id}`);
    }

    const quantities: Record<string, number> = {};
    for (const [key, value] of Object.entries(payload.state.quantities ?? {})) {
      if (validKeys.has(key) && Number.isFinite(value) && value > 0) {
        quantities[key] = Math.floor(value);
      }
    }

    const activeVariants: Record<string, string> = {};
    for (const [productId, variantId] of Object.entries(payload.state.activeVariants ?? {})) {
      if (validVariants.get(productId)?.has(variantId)) activeVariants[productId] = variantId;
    }

    const stepIds = catalog.steps.map((s) => s.id);
    const openStepId = payload.state.openStepId;

    return {
      quantities,
      activeVariants,
      openStepId: openStepId && stepIds.includes(openStepId) ? openStepId : catalog.initialState.openStepId,
    };
  } catch {
    return null;
  }
}

export function hasSavedSystem(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
