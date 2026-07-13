import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/marci/AppData/Local/Temp/claude/D--PORTFOLIO-MB/8cc6d28a-da57-40a4-b4f2-651a54385106/scratchpad/agentic-swarm';
const THREE_DIR = 'D:/PORTFOLIO MB/node_modules/three/build';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png' };

export function startServer(port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath;
    if (urlPath.startsWith('/vendor/')) {
      filePath = path.join(THREE_DIR, urlPath.replace('/vendor/', ''));
    } else {
      filePath = path.join(ROOT, urlPath === '/' ? '/scene.html' : urlPath);
    }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('not found: ' + filePath); return; }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => { server.listen(port, () => resolve(server)); });
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  const port = parseInt(process.argv[2] || '5391', 10);
  await startServer(port);
  console.log('server up on', port);
}
