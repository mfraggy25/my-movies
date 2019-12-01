const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");

// ---------------------  GET REQUESTS ---------------------//

var myLogger = function(req, res, next) {
  console.log(req.url);
  next();
};

var requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(myLogger);
app.use(requestTime);

app.get("/", function(req, res) {
  var responseText = "Welcome to my app!";
  responseText += "<small>Requested at: " + req.requestTime + "</small>";
  res.send(responseText);
});
app.get("/secreturl", function(req, res) {
  var responseText = "This is a secret url with super top-secret content.";
  responseText += "<small>Requested at: " + req.requestTime + "</small>";
  res.send(responseText);
});
app.listen(3000);

// Welcome message
app.get("/", function(req, res) {
  res.send("Movie Database");
});
app.get("/documentation", function(req, res) {
  res.sendFile("public/documentation.html", { root: __dirname });
});
// GET list of data about all movies
app.get("/movies", function(req, res) {
  console.log(Movie);
  res.json(top10Movies);
});
app.use(express.static("public"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Movie Database\n");
  })
  .listen(8080);

console.log("My first Node test server is running on Port 8080.");
