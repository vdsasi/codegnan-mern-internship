import { Request, Response } from "express";
import { UserDocument } from "models/usermodel";
const express = require("express");
const authenticate = require("../middleware/auth");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/delete", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.userId;

  console.log(req.body.task)

  try {
    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleteTask = req.body.task;

    const taskIndex = user.tasks.findIndex(
      (task: any) => task.title === deleteTask.title
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    user.tasks.splice(taskIndex, 1);

    await user.save();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting task" });
  }
});


router.post("/create", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.userId;
  console.log(req.body);
  try {
    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = req.body.task;

    user.tasks.push(newTask);
    await user.save();

    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

router.post("/update", authenticate, async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.userId;
  const { title, start, end } = req.body.task;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = user.tasks.find((task: any) => task.title === title);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskId = task._id;

    task.start = start;
    task.end = end;

    await user.save();

    console.log("Successfully updated task");
    res.status(200).json({ message: "Task updated successfully", taskId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating task" });
  }
});


module.exports = router;
