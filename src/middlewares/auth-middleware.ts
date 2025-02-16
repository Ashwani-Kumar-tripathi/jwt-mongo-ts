import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserBasicInfo } from "../index";
import User from "../models/user-model";
import { AuthenticationError } from "./error-handler";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, token not found");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    ) as { userId: string };

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

export {authenticate};
