// http server to use: needs to be modified for using different servers
const httpServer = require('./servers/long_polling');

// HTTP Server
const port = 8080;
httpServer.server = httpServer.listen(port, function () {
  console.log('HTTP server started...');
  console.info(`Your service is up and running on port ${port}`);
});