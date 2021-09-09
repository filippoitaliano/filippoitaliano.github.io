# filippo.im

A simple frameworkless blog.

## Run in development mode

1. Edit the third line in client/app.js to use this address: http://localhost:8082/articles.
2. Edit the ALLOWED_ORIGINS constant in server/app.js to include http://localhost:8080.
3. run `npx http-server` in the root to host the frontend on `localhost:8080`.
4. Change directory to server dir and run `npm run start-dev`. If you are on linux look run `npm run start-dev-linux`.
