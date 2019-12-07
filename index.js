const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid");
const app = express();
const bodyParser = require("body-parser");

let Movies = [
  {
    title: "The Breakfast Club",
    director: "John Hughes",
    genre: "Comedy-Drama",
    year: "1985"
  }
];

app.use(bodyParser.json());
// use morgan logger middleware
app.use(morgan("common"));
// routes all requests for static files to 'public' folder
app.use(express.static("public"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ---------------------  GET REQUESTS ---------------------//

// Welcome message
app.get("/", function(req, res) {
  res.send("Movie Database");
});
// GET list of data about all movies
app.get("/movies", function(req, res) {
  res.json(Movies);
  res.send("Successful GET request returning data on all movies.");
});

// GET movies by title
app.get("/movies/:title", (req, res) => {
  res.send("Successful GET request returning data on movies by title.");
});
// GET list of data about directors
app.get("/directors/:name", (req, res) => {
  res.send("Successful GET request returning data on movies by director.");
});

// GET list of data about genres
app.get("/genres/:name", (req, res) => {
  res.send("Successful GET request returning data on movie genre.");
});

//GET movie by release year
app.get("/movie/:release", (req, res) => {
  res.send("Successful GET request returning data on movies by release year.");
});
// ---------------------- USERS ---------------------------

// Gets the list of data about ALL users

app.get("/users", (req, res) => {
  res.json(Users);
});

// Add new user
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    res.send("User successfully added!");
  }
});

// Update the user info
app.put("/users/:username/:password/:email/:dateofbirth", (req, res) => {
  res.send("User info updated.");
});

// Add movie to list of favorites
app.post("/users/:username/:movie_username", (req, res) => {
  res.send("Movie added to favourite list.");
});

// Delete movie from list of favorites
app.delete("/users/:username/:movie_username", (req, res) => {
  res.send("Movie removed from favourite list.");
});

// Deregister a user from our list by Username
app.delete("/users/:username", (req, res) => {
  res.send("User successfully removed!");
});

//Listen for requests
app.listen(8080);
