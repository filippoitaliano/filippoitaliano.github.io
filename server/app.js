const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dotenv = require('dotenv');

dotenv.config();

const HOSTNAME = '0.0.0.0';
const PORT = process.env.PORT || 8082;

// Paths are resolved from this file, not from the working directory:
// Render can start the process from the repository root or from server/.
const DATA_DIR = path.join(__dirname, '..', 'data');

const ALLOWED_ORIGINS = [
  // 'http://localhost:8080',
  'https://www.wholejs.com',
  'https://filippoitaliano.github.io',
  'https://garden.filippoitaliano.com',
  'https://garden.filippoitaliano.work'
];

const updateGenericLog = () => {
  const logPath = path.join(DATA_DIR, 'generic.log');
  fs.readFile(logPath, (err, data) => {
    let log;
    if (err) {
      log = { counter: 1 };
    } else {
      try {
        log = JSON.parse(data);
        log.counter += 1;
      } catch (parseError) {
        log = { counter: 1 };
      }
    }
    fs.writeFile(logPath, JSON.stringify(log), (writeError) => {
      if (writeError) return;
      console.info(log);
    })
  })
}

const encodeBase64 = (filePath) => (
  `data:image/jpg;base64, ${fs.readFileSync(filePath, { encoding: 'base64' })}`
);

const previewPictureByType = (src) => {
  if (!src) return null;
  if (src.includes('http')) return src;
  return encodeBase64(path.resolve(DATA_DIR, src.replace(/^\.\.\/data\//, '')));
}

const articleCache = (() => {
  const raw = fs.readFileSync(path.join(DATA_DIR, 'articles.json'));
  const parsedWithImages = JSON.parse(raw).map((article) => ({
    ...article,
    previewPicture: previewPictureByType(article.previewPicture),
  }));
  return JSON.stringify(parsedWithImages);
})()

const server = http.createServer((request, response) => {
  const { origin } = request.headers;
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  const parsedUrl = url.parse(request.url, true);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.end();
    return;
  }

  if (parsedUrl.pathname === '/articles' && request.method === 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    response.end(articleCache);
    updateGenericLog();
    return;
  }

  // Health check used by Render: without it every unmatched request hangs
  // until the platform timeout.
  if (parsedUrl.pathname === '/' && request.method === 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/plain');
    response.end('ok');
    return;
  }

  response.statusCode = 404;
  response.end();
});

server.listen(PORT, HOSTNAME, () => {
  console.info(`Server running on port ${PORT}...`);
})
