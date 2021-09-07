# filippo.im

A simple frameworkless blog.

## Run in development mode

1. edit the third line in client/app.js to use this address: http://localhost:8082/articles.
2. edit the ALLOWED_ORIGINS constant in server/app.js to include http://localhost:8080.
3. run `npx http-server` in the root to host the frontend on `localhost:8080`.
4. cd to the server dir and run `npm run start-server-dev`. If you are on linux look at package.json in the server dir and adapt the script to set the environment variable accordingly (will fix this).
