const express = require("express");
const router = express.Router();
const { users } = require("../models");


router.post("/", async (req, res) => {
  const post = req.body;
  await users.create(post);
  res.json(post);
});

module.exports = router;