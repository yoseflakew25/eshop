const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post(`/`, async (req, res) => {

    const {
      name,
      email,
      passwordHash,
      phone,
      isAdmin,
      apartment,
      country,
      city,
      zip,
      street,
    } = req.body;
    let user = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(passwordHash, 10),
      phone,
      isAdmin,
      apartment,
      country,
      city,
      zip,
      street
    });

  
  user = await user.save();
  if (!user) return res.status(500).send("the category cannot be created!");

  res.send(user);
});


router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});





module.exports =router;