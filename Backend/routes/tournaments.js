const express = require("express");
const router = express.Router();
const { tournaments } = require("../models");

router.get("/", async (req, res) => {
  const listOfPosts = await tournaments.findAll();
  res.json(listOfPosts);
});

router.post("/", async (req, res) => {
  const post = req.body;
  await tournaments.create(post);
  res.json(post);
});

module.exports = router;

// .\node_modules\.bin\sequelize-auto -h localhost -d clash -u root -x danny -p 3306  --dialect mysql -o " /.models"