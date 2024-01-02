const express = require("express");
const router = express.Router();
const { tournaments } = require("../models");
const { validateToken} = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await tournaments.findAll();
  res.json(listOfPosts);
});

router.post("/",validateToken, async (req, res) => {
  const post = req.body;
 // const username= req.user.username;
 // post.username= username;
  // so req.username is really exual to the token that contains the username and then you make you input  the username the token provided as the username for the tournaments table
  await tournaments.create(post);
  res.json(post);
});



module.exports = router;

// .\node_modules\.bin\sequelize-auto -h localhost -d clash -u root -x danny -p 3306  --dialect mysql -o " /.models"