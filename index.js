const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
require("./passport");

//mongoose.connect("mongodb://localhost:27017/MyMovies", {useNewUrlParser: true});
mongoose.connect(
  "mongodb+srv://michaelf25:greece1@cluster0-bvujn.mongodb.net/MyMovies?retryWrites=true&w=majority",
  { useNewURLParser: true }
);

app.use(bodyParser.json());
// use morgan logger middleware
app.use(morgan("common"));
// routes all requests for static files to 'public' folder
app.use(express.static("public"));
// use cors
app.use(cors());

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

//GET list of data about all movies
app.get("/movies", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// app.get("/movies", passport.authenticate("jwt", { session: false }), function(
//   req,
//   res
// ) {
//   Movies.find()
//     .then(function(movies) {
//       res.status(201).json(movies);
//     })
//     .catch(function(error) {
//       console.error(error);
//       res.status(500).send("Error: " + error);
//     });
// });

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
app.post(
  "/users",
  //Validation logic here for request you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty" or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  function(req, res) {
    console.log("hit");
    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    //  console.log("chair", hashedPassword, req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then(function(user) {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

// Update the user info
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      {
        Username: req.params.Username
      },
      {
        $set: {
          Username: req.body.Username,
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
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      {
        Username: req.params.Username
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
  "/users/:Username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
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
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndRemove({
      Username: req.params.Username
    })
      .then(function(user) {
        if (!user) {
          res.status(400).send(req.params.Username + " not found!");
        } else {
          res.status(200).send(req.params.Username + " successfully deleted!");
        }
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
