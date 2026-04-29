import { default as handler } from '../dist/server/assets/worker-entry-DDhIpx2j.js';
import 'node:events';
import 'node:async_hooks';
import 'node:stream/web';
import 'node:stream';

export default async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
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
};