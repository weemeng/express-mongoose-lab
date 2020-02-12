const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Trainer = require("../models/trainer.model");

const { protectRoute } = require("../middlewares/auth");

// router.use(express.urlencoded());

router.post("/register", async (req, res, next) => {
  try {
    const trainer = new Trainer(req.body);
    await Trainer.init();
    const newTrainer = await trainer.save();
    res.status(201).send(newTrainer);
  } catch (err) {
    next(err);
  }
});

const createJWTToken = username => {
  const payload = { name: username };

  //   console.log("secret key is" + process.env.JWT_SECRET_KEY);
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trainer = await Trainer.findOne({ username });
    const result = await bcrypt.compare(password, trainer.password);

    if (!result) {
      throw new Error("Login failed");
    }
    const token = createJWTToken(trainer.username);
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true // only goes through https
      //secure: true marks the cookie to be used with HTTPS only
    });

    // why can't we have secure: true?

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.get("/:username", protectRoute, async (req, res, next) => {
  const INCORRECT_TRAINER_ERR_MSG = "Incorrect trainer!";
  try {
    const username = req.params.username;
    if (req.user.name !== username) {
      throw new Error(INCORRECT_TRAINER_ERR_MSG);
    }
    const regex = new RegExp(username, "gi");
    const trainers = await Trainer.find({ username });
    res.send(trainers);
  } catch (err) {
    if (err.message === INCORRECT_TRAINER_ERR_MSG) {
      console.log("Got Here");
      err.statusCode = 403;
    }
    next(err);
  }
});
module.exports = router;
