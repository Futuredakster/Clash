const express = require("express");
const router = express.Router();
const { tournaments } = require("../models");
const { validateToken} = require("../middlewares/AuthMiddleware");
const { Op } = require('sequelize');

router.get("/", validateToken, async (req, res) => {
  const { tournament_name } = req.query; 
  try {
    let whereCondition = { is_published: true };
    if (tournament_name && tournament_name.trim() !== '') {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%` 
      };
    }
    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [['start_date', 'ASC']]
    });
    res.json(listOfPosts);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/byaccount", validateToken, async (req, res) => {
  const { tournament_name } = req.query;
  const account_id = req.user.account_id;
  try {
    let whereCondition = { account_id };
    if (tournament_name && tournament_name.trim() !== '') {
      whereCondition.tournament_name = {
        [Op.like]: `%${tournament_name}%` 
      };
    }
    const listOfPosts = await tournaments.findAll({
      where: whereCondition,
      order: [['start_date', 'ASC']]
    });

    res.json(listOfPosts);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/",validateToken, async (req, res) => {
  const post = req.body;
  const account_id= req.user.account_id;
  post.account_id = account_id;
  var t = await tournaments.create(post);
// Samething here but we are setting the tournemnt id here instead of the frontend
  res.json(t);
});



module.exports = router;

// .\node_modules\.bin\sequelize-auto -h localhost -d clash -u root -x danny -p 3306  --dialect mysql -o " /.models"