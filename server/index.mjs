/**
 * Optional catalog API (the "bonus" in the brief).
 * Zero dependencies — run with `npm run api`, then start the app with
 * VITE_API_URL=http://localhost:8787 npm run dev
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(here, '..', 'src', 'data', 'catalog.json');
const PORT = Number(process.env.PORT ?? 8787);

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/catalog') {
    try {
      const body = await readFile(CATALOG_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body);
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Catalog unavailable' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => console.log(`Catalog API on http://localhost:${PORT}/catalog`));
