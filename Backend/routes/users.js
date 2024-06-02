const express = require("express");
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require('../middlewares/AuthMiddleware')

const {sign} = require('jsonwebtoken');

router.post("/",validateToken, async (req, res) => {
  const { username, password_hash, email } = req.body;
  bcrypt.hash(password_hash, 10).then((hash) => {
    const account_id = req.user.account_id;
    users.create({
      username: username,
      password_hash: hash,
      email: email,
      account_id:account_id,
    });
    res.json("SUCCESS");
  });
});


// You destruct the password,username and email the user puts in and then you hash the password and set the new 
// password equal the old one. This is collected from the user webpage

router.post("/Login", async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findOne({ where: { username: username } });

  // You are checking to see where the username the user puts in is equal to the username in the database

  if (!user) {
    return res.json({ error: "User Doesn't Exist" });
  }

  bcrypt.compare(password, user.password_hash).then((match) => {
    if (!match) {
      return res.json({ error: "Wrong Username And Password Combination" });
    }
    const accessToken= sign({username : user.username, user_id:user.user_id, account_id:user.account_id }, "importantsecret");
    // if the username matches you search for the password and if that matches you are logged in now. This is collected from the login webpage.
    res.json({token: accessToken, username:username, id:user.user_id, account_id:user.account_id});
  });
});

router.get('/auth', validateToken, (req,res) => {
res.json(req.user);
});

router.get('/',validateToken,async (req,res) => {
    const data = req.user;
    const user = await users.findOne ({ 
      where: { user_id: data.user_id }
    });
    res.json(user);
})

module.exports = router;
