const express = require("express");
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require('../middlewares/AuthMiddleware')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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');


const {sign} = require('jsonwebtoken');

router.post("/",validateToken, async (req, res) => {
  const { username, password_hash, email } = req.body;
  const emailExists = await compareEmail(email); 
  if(emailExists){
    console.log("Nope sirrie bob")
    return res.json({error: "This email already cooresponds to an account please login"});
  }
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
      where: { user_id: data.user_id },
      attributes: { exclude: ['password_hash'] }
    });
    res.json(user);
})

router.patch("/", validateToken, async (req, res) => {
  try {
    const data = req.body;
    const userRes = await users.findOne({ where: { user_id: data.user_id } });
    
    if (userRes) {
      const user = userRes.dataValues;
      user.username = isNotNullOrEmpty(data.username) ? data.username : user.username;
      user.email = isNotNullOrEmpty(data.email) ? data.email : user.email;
      console.log(user.username);

      await users.update(user, {
        where: { user_id: data.user_id }
      });

      res.status(200).json({ message: "Successfully updated" });
    } else {
      console.log("Not found");
      res.status(404).json({ error: "Tournament not found" });
    }
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/pass", validateToken, async (req, res) => {
  const data = req.user;
  const { password, newPassword } = req.body;

  try {
    const user = await users.findOne({ where: { user_id: data.user_id } });

    if (!user) {
      return res.json({ error: "User Doesn't Exist" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.json({ error: "Wrong Password, please try again" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await users.update(
      { password_hash: hash },
      { where: { user_id: data.user_id } }
    );

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while updating the password" });
  }
});

router.post("/verifyemail", async (req, res) => {
  const email = req.body
  const sameEmail = await users.findOne({
    where: {
      email: email,
    },
  });
  if(sameEmail!=null){
    const verifyToken= sign({user_id:sameEmail.user_id }, "importanttoken");
    const url = `http://localhost:3001/users/${verifyToken}`;
    const msg = {
      to: email, // Change to your recipient
      from: 'danny.kaikov.m@gmail.com', // Change to your verified sender
      subject: 'Testing',
      text: 'Did you watch Demon Slayer Episode 3 yet',
      html: `Please click this link to change your email: <a href="${url}">${url} </a>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        res.json({token:verifyToken,user_id:sameEmail.user_id });
      })
      .catch((error) => {
        console.error(error)
      })
  } else{
    res.json({error : "This user dosent exist "});
  }
})




//  helper functions ----------------------------------------------------------------------------------------------------


async function compareEmail(email){
  const sameEmail = await users.findOne({
    where: {
      email: email,
    },
  });
  if(sameEmail!=null){
     return true;
  }
  return false;
}



function isNotNullOrEmpty(str) {
  return str !== null && str !== '';
}


module.exports = router;
