import { NextFunction, Request, Response } from "express";

// middleware/auth.js
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
