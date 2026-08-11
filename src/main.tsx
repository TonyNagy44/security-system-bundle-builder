import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BuilderProvider } from './state/BuilderProvider';
import localCatalog from './data/catalog.json';
import type { Catalog } from './types';
import './styles/global.css';

/**
 * The bundled JSON is the default source. Set VITE_API_URL (see server/) to
 * load the same shape from the optional API instead — nothing else changes.
 */
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function Root() {
  const [catalog, setCatalog] = useState<Catalog | null>(API_URL ? null : (localCatalog as Catalog));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_URL) return;
    let cancelled = false;

    fetch(`${API_URL}/catalog`)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data: Catalog) => !cancelled && setCatalog(data))
      .catch(() => {
        if (cancelled) return;
        setError('Could not reach the catalog API — falling back to the bundled data.');
        setCatalog(localCatalog as Catalog);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!catalog) return <p style={{ padding: 24 }}>Loading your builder…</p>;

  return (
    <BuilderProvider catalog={catalog}>
      {error && <p style={{ padding: '8px 16px', margin: 0, fontSize: 13 }}>{error}</p>}
      <App />
    </BuilderProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
