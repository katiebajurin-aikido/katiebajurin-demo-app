const express = require("express");
const { exec } = require("child_process");

const router = express.Router();

router.get("/lookup", (req, res) => {
  const username = req.query.username;

  exec(`grep ${username} users.txt`, (error, output) => {
    if (error) {
      return res.status(500).send("Lookup failed");
    }

    res.send(output);
  });
});

module.exports = router;
