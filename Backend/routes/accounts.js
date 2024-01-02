const express = require("express");
const router = express.Router();
const { accounts } = require("../models");


router.post("/", async (req, res) => {
  const post = req.body;
  var a = await accounts.create(post);
  res.json(a);
});

router.get("/", async (req, res) => {
  const listOfPosts = await accounts.findAll();
  res.json(listOfPosts);
});

module.exports = router;