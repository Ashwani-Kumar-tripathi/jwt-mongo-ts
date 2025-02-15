import { Response } from "express";
import jwt from "jsonwebtoken";



const generateToken = (res: Response, userId: string) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables!");
    }

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",

  });
  
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  })
}

const clearToken = (res: Response)=>{
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 0   })
}


export { generateToken, clearToken };