const express = require("express");
const router = express.Router();
const { tournaments } = require("../models");
const { validateToken} = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
 const listOfPosts = await tournaments.findAll({where: {is_published: true}});
  res.json(listOfPosts);
});

router.get("/byaccount", validateToken, async (req, res) => {
  const account_id= req.user.account_id;
  const listOfPosts =  await tournaments.findAll({where: {account_id:account_id}});
  res.json(listOfPosts);
  // Doing the middleware authentication req.user is set equal to the accecsToken which contaons the account id so we just get it here
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