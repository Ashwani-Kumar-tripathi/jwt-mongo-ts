import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  clearTokens,
} from "../utils/jwt-token";
import User from "../models/user-model";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }

    // Ensure the password is hashed (Handled in the schema)
    const user = await User.create({ name, email, password });

    if (user) {
      generateAccessToken(res, user._id as string);
      generateRefreshToken(res, user._id as string);
  
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res
        .status(400)
        .json({ message: "An error occurred while registering the user" });
    }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

    const user = await User.findOne({ email });

  if (user && user.comparePassword(password)) {
    
    generateAccessToken(res, user._id as string);
    generateRefreshToken(res, user._id as string);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: "User not found OR password incorrect" });
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearTokens(res);
  res.status(200).json({ message: "User logged out successfully" });
};


export { registerUser, loginUser, logoutUser};
