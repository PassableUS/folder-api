const app = require("./app"); // Our `app` module that is started by this file
const http = require("http");
const config = require("./utils/config");

const server = http.createServer(app); // Creates the server using the `app` module

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
