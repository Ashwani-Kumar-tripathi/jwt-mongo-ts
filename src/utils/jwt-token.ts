import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET= process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

// Ensure secrets exist
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in environment variables!");
}

const isProduction = process.env.NODE_ENV === "production";

const generateAccessToken = (res: Response, userId: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as jwt.SignOptions);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  return accessToken;
};

const generateRefreshToken = (res: Response, userId: string) => {
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET as Secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as jwt.SignOptions);

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return refreshToken; 
};

// Clear cookies on logout
const clearTokens = (res: Response) => {
  res.clearCookie("access_token", { httpOnly: true, secure: isProduction });
  res.clearCookie("refresh_token", { httpOnly: true, secure: isProduction });
};

export { generateAccessToken, generateRefreshToken, clearTokens };
