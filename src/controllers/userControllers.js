const database = require("../../database");

const getUsers = (req, res) => {
  database

    .query("SELECT * FROM users")

    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);

      res.sendStatus(500);
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
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
  getUsers,
  getUserById,
};
