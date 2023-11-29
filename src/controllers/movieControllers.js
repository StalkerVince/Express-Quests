const database = require("../../database");

const getMovies = (req, res) => {
  database

    .query("SELECT * FROM movies")

    .then(([movies]) => {
      res.json(movies); // use res.json instead of console.log
    })

    .catch((err) => {
      console.error(err);

      res.sendStatus(500);
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getMovies,
  getMovieById,
};
