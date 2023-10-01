const express = require("express");
const router = express.Router();
const { userCollection } = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isUserLoggedin } = require("../middlewares/middleware");

require("dotenv").config();

const secret = process.env.secret;

router.post("/register", async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  await userCollection.create({
    fullname: req.body.fullname,
    email: req.body.email,
    role: req.body.role,
    password: hashedPassword,
  });

  res.status(201).send("created successfully");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await userCollection.findOne({ email: email });
  if (!userDetail) return res.status(404).send("user not found");

  const doesPasswordMarch = bcrypt.compareSync(password, userDetail.password);
  if (!doesPasswordMarch) return res.status(400).send("Invalid credential");

  const { email: userEmail, _id, role } = userDetail;

  const token = jwt.sign(
    {
      email: userEmail,
      userId: _id,
      role: role,
    },
    secret
  );

  res.send({ message: "LoggedIn successfully", token });
});

router.get("/profile", isUserLoggedin, async (req, res) => {
  try {
    const { userId } = req.decoded;
    const user = await userCollection.findById(userId, "-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
  }
});

module.exports = router;
