const https = require('http');
const http = require('http');
const fs = require('fs');
const url = require('url');

const HTTPS = !!parseInt(process.env.HTTPS);
const HOSTNAME = '0.0.0.0';
const PORT = HTTPS ? 443 : 8082;

const ALLOWED_ORIGINS = [
  'https://www.wholejs.com',
  'https://filippoitaliano.github.io',
];

const HTTPS_OPTIONS = {
  ca: fs.readFileSync('./free.ca'),
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const createServer = (callback) => {
  if (HTTPS) {
    return https.createServer(HTTPS_OPTIONS, callback);
  } else {
    return http.createServer(callback);
  }
}

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
        console.log(log);
      })
    }
  })
}

const encodeBase64 = (path) => `data:image/jpg;base64, ${fs.readFileSync(path, { encoding: 'base64' })}`;

const articleCache = (() => {
  const raw = fs.readFileSync('../data/articles.json');
  const parsedWithImages = JSON.parse(raw).map((article) => ({
    ...article,
    previewPicture: encodeBase64(article.previewPicture),
  }));
  return JSON.stringify(parsedWithImages);
})()

const server = createServer((request, response) => {
  const { origin } = request.headers;
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  const parsedUrl = url.parse(request.url, true);

  if (parsedUrl.pathname === '/articles' && request.method == 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    response.end(articleCache);
  }

  updateGenericLog();
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on port ${PORT}...`);
})