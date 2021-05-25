const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '0.0.0.0';
const port = 80;

const encodeBase64 = (path) => fs.readFileSync(path, { encoding: 'base64' });

const articles = fs.readFileSync('../data/articles.json');

const server = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');

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