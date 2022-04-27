const express = require('express');
const cors = require('cors');

let score = "0:0";

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data
  while ((chunk = process.stdin.read()) !== null) {
    // simply update the score
    score = chunk;
  }
});
const app = express();

// allow all origins
app.use(cors());

// serve basic polling route
app.get('/basicpolling', function (req, res, next) {
  res.writeHead(200, { "Content-Type": "text/plain"});
  res.write(score);
  res.end();
});

module.exports = app;