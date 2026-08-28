import http from 'node:http';
import { WebSocketServer } from 'ws';

// HTTP Server
const port = 8080;
const server = new http.createServer();

server.listen(port, function () {
  console.log('HTTP server started...');
  console.info(`Your service is up and running on port ${port}`);
});

// create the WebSocket server
const wss = new WebSocketServer({ server });

let score = "0:0";

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data
  while ((chunk = process.stdin.read()) !== null) {
    // simply update the score
    score = chunk.toString();
    // if we have a existing web socket, send the data to all clients
    if (wss != null) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(score);
        }
      });
    }
  }
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) { console.log('received: %s', message);
  });

  ws.on('close', function close() {
    console.log('disconnected');
  });

  ws.send(score);
});