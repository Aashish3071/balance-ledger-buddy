
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

server.use(middlewares);

// Custom route handling for transactions
server.use(jsonServer.bodyParser);

// Add middleware to update balance
// This is not needed because we handle it on the client side
// But it's here as an example for more complex operations

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
