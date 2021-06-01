const https = require('https');
const fs = require('fs');
const url = require('url');

const HOSTNAME = '0.0.0.0';
const PORT = 443;

const ALLOWED_ORIGINS = [
  'https://www.wholejs.com',
  'https://filippoitaliano.github.io',
];

const OPTIONS = {
  ca: fs.readFileSync('./free.ca'),
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const encodeBase64 = (path) => `data:image/jpg;base64, ${fs.readFileSync(path, { encoding: 'base64' })}`;

const articles = fs.readFileSync('../data/articles.json');

const updateCounter = () => {
  const logPath = '../data/generic.log';
  let log;
  try {
    log = JSON.parse(fs.readFileSync(logPath));
  } catch (error) {
    log = { counter: 0 };
  }

  log.counter += 1;

  console.log(log);
  fs.writeFileSync(logPath, JSON.stringify(log));
}

const server = https.createServer(OPTIONS, (request, response) => {
  // const { origin } = request.headers;
  // if (ALLOWED_ORIGINS.includes(origin)) {
  //   response.setHeader('Access-Control-Allow-Origin', origin);
  //   response.setHeader('Vary', 'Origin');
  // }

  response.setHeader('Access-Control-Allow-Origin', '*');

  const parsedUrl = url.parse(request.url, true);

  if (parsedUrl.pathname === '/articles' && request.method == 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    const parsed = JSON.parse(articles).map((article) => ({
      ...article,
      previewPicture: encodeBase64(article.previewPicture),
    }));
    response.end(JSON.stringify(parsed));
  }

  updateCounter();
});

server.listen(PORT, HOSTNAME, () => {
  console.log('server running...')
})