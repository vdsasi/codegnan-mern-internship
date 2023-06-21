import { Request, Response } from "express";
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: "Registration failed" });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
