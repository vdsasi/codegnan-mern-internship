import { Request, Response } from "express";
import { UserDocument } from "models/usermodel";
const express = require("express");
const authenticate = require("../middleware/auth");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Protected route

router.get("/load_user", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json(JSON.parse(JSON.stringify({name: user.name, email: user.email})));
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const user: UserDocument | null = await User.findById(userId);

    if (user) {
      await user.tasks.push(...req.body.tasks);
      await user.save().then(() => {
        console.log("successfull");
      });
      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    else {
      console.log(user.tasks);
      res.status(200).json(JSON.parse(JSON.stringify(user.tasks)));
    }


    
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
})

module.exports = router;
