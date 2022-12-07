const express = require('express');
const cors = require('cors');

let score = "0:0";
let pending_response;
let pending_response_date;

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data
  while ((chunk = process.stdin.read()) !== null) {
    // simply update the score
    score = chunk;

    // if we have a pending request, send the data
    if (pending_response != null) {
      pending_response.writeHead(200, { "Content-Type": "text/plain" });
      pending_response.end(score);
      pending_response = null;
      pending_response_date = null;
      score = "";
    }
  }
});

const app = express();

// allow all origins
app.use(cors());

// serve long polling route
app.get('/longpolling', function (req, res, next) {
  // check if there is a new score available (data from stdin)
  // if yes, deliver it right away
  // otherwise store the response without answering
  if (score.length > 0) {
    res.writeHead(200, { "Content-Type": "text/plain"});
    res.end(score);
    score = "";
  }
  else {
    // store the response so that we can respond later (when stdin gets data)
    pending_response = res;
    pending_response_date = new Date().getTime();
  }
});

// for handling timeouts and send an empty response before it happens
// we run a function at regular interval that check for timeout and
// does send an empty response
const timeOutValue = 10000;
setInterval(() => {
  // close out requests that are withing 10 seconds to timeout
  if (pending_response && pending_response_date) {
    let elapsed_time = new Date().getTime() - pending_response_date;
    const allowed_margin = 10000;
    // we expect that the time out is set for the
    if (elapsed_time >= app.server.timeout - allowed_margin) {
      pending_response.writeHead(200, {"Content-Type": "text/plain"});
      pending_response.end("");
      pending_response = null;
      pending_date = null;
    }
  }
}, timeOutValue);

module.exports = app;