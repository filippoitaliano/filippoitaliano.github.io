const http = require('http');
const fs = require('fs');
const url = require('url');
const dotenv = require('dotenv');

dotenv.config();

const HOSTNAME = '0.0.0.0';
const PORT = process.env.PORT || 8082;

const ALLOWED_ORIGINS = [
  // 'http://localhost:8080',
  'https://www.wholejs.com',
  'https://filippoitaliano.github.io',
  'https://garden.filippoitaliano.com'
];

const updateGenericLog = () => {
  const logPath = '../data/generic.log';
  fs.readFile(logPath, (err, data) => {
    let log;
    if (err) {
      log = { counter: 0 };
    } else {
      log = JSON.parse(data);
      log.counter += 1;
      fs.writeFile(logPath, JSON.stringify(log), () => {
        console.info(log);
      })
    }
  })
}

const encodeBase64 = (path) => `data:image/jpg;base64, ${fs.readFileSync(path, { encoding: 'base64' })}`;

const previewPictureByType = (src) => {
  if (!src) return null;
  if (src.includes('http')) return src;
  return encodeBase64(src);
}

const articleCache = (() => {
  const raw = fs.readFileSync('../data/articles.json');
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

  if (parsedUrl.pathname === '/articles' && request.method === 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    response.end(articleCache);
  }

  updateGenericLog();
});

server.listen(PORT, HOSTNAME, () => {
  console.info(`Server running on port ${PORT}...`);
})