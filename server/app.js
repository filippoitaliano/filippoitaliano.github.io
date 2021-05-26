const https = require('https');
const fs = require('fs');
const url = require('url');

const hostname = '0.0.0.0';
const port = 443;

const options = {
  ca: fs.readFileSync('./free.ca'),
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const encodeBase64 = (path) => fs.readFileSync(path, { encoding: 'base64' });

const articles = fs.readFileSync('../data/articles.json');

const server = https.createServer(options, (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'https://www.wholejs.com');

  const parsedUrl = url.parse(request.url, true);

  if (parsedUrl.pathname === '/articles' && request.method == 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    JSON.parse(articles).forEach((article) => {
      article.previewPicture = encodeBase64(article.previewPicture);
    });
    response.end(articles);
  }

});

server.listen(port, hostname, () => {
  console.log('server running...')
})