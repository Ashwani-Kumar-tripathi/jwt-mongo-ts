import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";

import cookieParser from "cookie-parser";
import connectDB from "./connections/database";
import { errorHandler } from "./middlewares/error-handler";
import {authenticate, refreshAccessToken} from "./middlewares/auth-middleware";
import authRouter from "./routes/auth-router";
import userRouter from "./routes/user-router";

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);


const app = express();
const port = process.env.PORT || 5000;

connectDB();

export interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

app.use(helmet());
//app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use("/auth", authRouter);

app.use(cookieParser());
app.use("/users", authenticate, userRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
