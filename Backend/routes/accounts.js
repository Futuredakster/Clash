const express = require("express");
const router = express.Router();
const { accounts } = require("../models");
const { users } = require("../models");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const post = req.body;
  var a = await accounts.create(post);
  res.json(a);
});



router.post("/user", async (req, res) => {
  console.log(req.body);
  const accountObj = req.body.account;
  const userObj = req.body.user;
  var a = await accounts.create(accountObj);
  userObj.account_id = a.account_id;

  bcrypt.hash(userObj.password_hash, 10).then((hash) => {
     users.create({
      username: userObj.username,
      password_hash: hash,
      email: userObj.email,
      account_id: userObj.account_id
    });
  });
  //var b = await users.create(userObj);
  res.json(a);
});


module.exports = router;