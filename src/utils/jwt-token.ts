import jwt from "jsonwebtoken";
import { Response } from "express";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived access token (15 min)
const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived refresh token (7 days)

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Set tokens in cookies
const setTokens = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Clear cookies on logout
const clearTokens = (res: Response) => {
  res.clearCookie("access_token", { httpOnly: true, secure: true });
  res.clearCookie("refresh_token", { httpOnly: true, secure: true });
};

export {
  generateAccessToken,
  generateRefreshToken,
  setTokens,
  clearTokens,
};
