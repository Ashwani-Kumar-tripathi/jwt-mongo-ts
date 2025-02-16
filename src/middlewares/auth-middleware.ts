import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserBasicInfo } from "../index";
import User from "../models/user-model";
import { AuthenticationError } from "./error-handler";
import { generateAccessToken } from "../utils/jwt-token"; // Import token generator

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, token not found");
    }

    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET || "");
    if (!decoded || !decoded.userId) {
      res.status(401);
      throw new Error("Not authorized, userId not found");
    }
    const user = await User.findById(decoded.userId, "_id name email");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user as UserBasicInfo;
    next();
  } catch (e) {
    res.status(401);
    throw new AuthenticationError("Invalid token");
  }
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new AuthenticationError("Refresh token not found");

    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET || "");
    if (!decoded.userId) throw new AuthenticationError("Not authorized, userId not found");

    const user = await User.findById(decoded.userId, "_id name email");
    if (!user) throw new AuthenticationError("Not authorized, user not found");

    const newAccessToken = generateAccessToken(res, decoded.userId);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    req.user = user as UserBasicInfo;
    next();
  } catch (error) {
    res.status(401);
    throw new AuthenticationError("Invalid token");
  }
};

export { authenticate, refreshAccessToken };
