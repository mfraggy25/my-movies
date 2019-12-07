const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid");
const app = express();
const bodyParser = require("body-parser");

let Movies = [
  {
    Title : "The Breakfast Club",
    Director: {
      name: "John Hughes",
      bio: "An American filmaker best known for writing and directing some of the most successful live-action comedy films of the 1980s and 1990s.",
      birth: "February 18, 1950",
      death: "August 6, 2009"
    },    
    Genre: {
      name: "Comedy-Drama",
      description: "Comedy-drama is a genre in which plot elements are a combination of comedy and drama."
    },
  }
];

let Users = [
  {  Username: '', 
  Password: '', 
  Email: '', 
  Birthday: '', 
  Favorites: ['']}
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
app.get("/documentation", function(req, res) {
  res.sendFile("public/documentation.html", { root: __dirname });
});
// GET list of data about all movies
app.get("/movies", function(req, res) {
  res.json(Movies);
});

// GET movies by title
app.get("/movies/:Title", (req, res) => {
  res.json(
    Movies.find(movie => {
      return movie.Title == req.params.Title;
    })
  );
});
// GET list of data about directors
app.get('/directors/:name', (req, res) => {
  res.json(Directors.find( (director) => { return director.name == req.params.name; }));
});
// GET list of data about genres
app.get('/genres/:name', (req, res) => {
  res.json(Genres.find( (genre) => { return genre.name == req.params.name; }));
    if (movie) {
      movie.genres[req.params.genre] = req.params.name;
      res
        .status(201)
        .send(
          "movie name: " +
            req.params.title +
            "  add genre name:  " +
            req.params.name +
            " in " +
            req.params.genre
        );
    } else {
      res
        .status(404)
        .send("movie with the name " + req.params.title + " was not found.");
    }
  });

// ---------------------- USERS ---------------------------

// Gets the list of data about ALL users

app.get("/users", (req, res) => {
  res.json(Users);
});

// Adds data for a new student to our list of users.
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Deletes a user from our list by Username
app.delete("/users/:username", (req, res) => {
  let user = Users.find((user) => { return user.username == req.params.username });

  if (user) {
    Users.filter(function(obj) { return obj.username !== req.params.username });
    res.status(201).send("User " + user.username + "with username" + req.params.username + " was deleted.")
  }
});

// Finds a user by username

app.get("/users", (req, res) => {
  res.json(Users.find( (user) => { return user.username === req.params.username; }));
});

// Update the user info by username
app.put("/users/:id", (req, res) => {
  let user = Users.find((user) => { return user.username == req.params.is });
  let newUserInfo = req.body;

  if (user && newUserInfo) {
    newUserInfo.username = user.username;
    newUserInfo.favorites = user.favorites
    Object.assign(user, newUserInfo);
    Users = Users.map((user) => (user.username == newUserInfo.usernamed) ? newUserInfo : user);
    res.status(201).send(user);
  } else if (!newUserInfo.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    res.status(404).send('User with username ' + req.params.username + ' was not found.');
  } 
});

// Add movie to list of favorites
app.post('/users/:username/:movie_username', (req, res) => {
  let user = Users.find((user) => { return user.username == req.params.username; });
  let movie = Movies.find((movie) => { return movie.username == req.params.movie_username; });

  if (user && movie) {
    user.favorites = [...new Set([...user.favorites, req.params.movie_username])];
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with username ' + req.params.movie_username + ' was not found.');
  } else {
    res.status(404).send('User with username ' + req.params.username + ' was not found.');
  }
});

// Delete movie from list of favorites
app.delete('/users/:username/:movie_username', (req, res) => {
  let user = Users.find((user) => { return user.username == req.params.username; });
  let movie = Movies.find((movie) => { return movie.username == req.params.movie_username; });

  if (user && movie) {
    user.favorites = user.favorites.filter((movie_username) => { return movie_username !== req.params.movie_username; });
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with username ' + req.params.movie_username + ' was not found.');
  } else {
    res.status(404).send('User with username ' + req.params.username + ' was not found.');
  }
});

app.listen(8080, () => {
  console.log("My Movies API is running on port 8080.");
});