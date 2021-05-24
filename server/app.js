const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const articles = fs.readFileSync('../data/articles.json');

const server = http.createServer((request, response) => {

  const parsedUrl = url.parse(request.url, true);

  if (parsedUrl.pathname === '/articles' && request.method == 'GET') {
    response.statusCode = 200;
    response.setHeader('Content-type', 'application/json');
    response.end(articles);
  }

});

server.listen(port, hostname, () => {
  console.log('server running...')
})