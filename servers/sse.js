import express from 'express';
import cors from 'cors';
import SSE from 'sse-node';

let score = "0:0";

// sse options: ping will force a ping sent by server at the given interval
const sseOptions = { ping: 60000 };

// SSE client instance
let clientSSE;

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data
  while ((chunk = process.stdin.read()) !== null) {
    // simply update the score
    score = chunk.toString();
    // if we have a existing SSE client, send the data
    if (clientSSE != null) {
      clientSSE.send(score);
      score = "";
    }
  }
});

const app = express();

// allow all origins
app.use(cors());

// serve basic polling route
app.get('/sse', function (req, res, next) {

  // create the sse client
  clientSSE = SSE(req, res, sseOptions);

  // upon closing of the HTTP connection by the client simply log and reset score
  clientSSE.onClose(() => {
    score = "0:0";
    console.log("SSE client was closed");
  });

  // check if there is data from stdin
  // if yes, deliver it right away by sending a message
  // otherwise do nothing
  if (score.length > 0) {
    clientSSE.send(score);
    score = "";
  }
});

export default app;