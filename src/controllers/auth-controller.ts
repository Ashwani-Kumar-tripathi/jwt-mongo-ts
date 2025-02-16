import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/jwt-token";
import User from "../models/user-model";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure the password is hashed (Handled in the schema)
    const user =await User.create({ name, email, password });

    if (user) {
      const accessToken = generateAccessToken(user._id as string);
      const refreshToken = generateRefreshToken(user._id as string);
      setTokens(res, accessToken, refreshToken);
  
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
    
    const accessToken = generateAccessToken(user._id as string);
    const refreshToken = generateRefreshToken(user._id as string);

    setTokens(res, accessToken, refreshToken);

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

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret"
    ) as { userId: string };

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    
    console.error("Error in refreshAccessToken:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerUser, loginUser, logoutUser, refreshAccessToken };
