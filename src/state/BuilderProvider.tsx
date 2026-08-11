import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { BuilderState, Catalog } from '../types';
import { builderReducer, createInitialState, type BuilderAction } from './builderReducer';
import { loadSystem } from './persistence';

interface BuilderContextValue {
  catalog: Catalog;
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

/** A saved system wins over the seeded one; a bad or absent save falls back cleanly. */
function initialise(catalog: Catalog): BuilderState {
  return loadSystem(catalog) ?? createInitialState(catalog);
}

export function BuilderProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, catalog, initialise);
  const value = useMemo(() => ({ catalog, state, dispatch }), [catalog, state]);
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used inside a BuilderProvider');
  return context;
}
