const express = require("express");
const router = express.Router();
const { accounts } = require("../models");


router.post("/", async (req, res) => {
  const post = req.body;
  await accounts.create(post);
  res.json(post);
});

module.exports = router;