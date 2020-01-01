const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const passport = require("passport");
require("./passport");

mongoose.connect("mongodb://localhost:27017/MyMovies", {
  useNewUrlParser: true
});

app.use(bodyParser.json());
// use morgan logger middleware
app.use(morgan("common"));
// routes all requests for static files to 'public' folder
app.use(express.static("public"));

var auth = require("./auth")(app);

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
app.get("/movies", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// GET movies by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({
      Title: req.params.Title
    })
      .then(function(movie) {
        res.status(201).json(movie);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// GET list of data about directors
app.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Movies.findOne({ "Director.Name": req.params.name })
      .then(function(movie) {
        res.status(201).send(movie.Director);
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error" + error);
      });
  }
);

// GET list of data about genres
app.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    console.log(Movies.findOne({ Name: req.params.Name }));
    Movies.findOne({ "Genre.Name": req.params.name })
      .then(function(movie) {
        res
          .status(201)
          .send(movie.Genre.Name + " : " + movie.Genre.Description);
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error" + error);
      });
  }
);

// ---------------------- USERS ---------------------------

// Gets the list of data about ALL users

app.get("/users", function(req, res) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add new user
app.post("/users", function(req, res) {
  Users.findOne({ Name: req.body.Name })
    .then(function(user) {
      if (user) {
        return res.status(400).send(req.body.Name + "already exists");
      } else {
        Users.create({
          Name: req.body.Name,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(function(user) {
            res.status(201).json(user);
          })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Update the user info
app.put(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      {
        Name: req.params.Name
      },
      {
        $set: {
          Name: req.body.Name,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // This makes sure the updated document is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add movie to list of favorites
app.post(
  "/users/:Name/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      {
        Name: req.params.Name
      },
      { $push: { Favorites: req.params.MovieID } },
      { new: true }, // This makes sure the updated document is returned
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete movie from list of favorites
app.delete(
  "/users/:name/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      { $pull: { Favorites: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Deregister a user from our list by Username
app.delete(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndRemove({
      Name: req.params.Name
    })
      .then(function(user) {
        if (!user) {
          res.status(400).send(req.params.Name + " not found!");
        } else {
          res.status(200).send(req.params.Name + " successfully deleted!");
        }
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.listen(8080, () => {
  //Listen for requests
  console.log("My Movies API is running on port 8080.");
});
