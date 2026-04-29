import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Find the worker entry file
const serverAssetsDir = path.join(projectRoot, 'dist/server/assets');
const files = fs.readdirSync(serverAssetsDir);
const workerEntry = files.find(f => f.startsWith('worker-entry-') && f.endsWith('.js'));

if (!workerEntry) {
  console.error('Could not find worker entry file');
  process.exit(1);
}

const handlerContent = `import { default as handler } from '../dist/server/assets/${workerEntry}';
import 'node:events';
import 'node:async_hooks';
import 'node:stream/web';
import 'node:stream';

export default async (req, res) => {
  try {
    const url = new URL(req.url || '/', \`http://\${req.headers.host}\`);
    
    const response = await handler.fetch(new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    }));

    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    res.statusCode = response.status;
    res.end(await response.text());
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.json({ error: 'Internal Server Error' });
  }
};`;

const apiDir = path.join(projectRoot, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(path.join(apiDir, 'index.js'), handlerContent);
console.log(`✓ Generated Vercel handler with ${workerEntry}`);
