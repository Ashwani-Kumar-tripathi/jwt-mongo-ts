import express from "express";
import helmet from 'helmet';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./connections/database";
import router from "./routes/auth-router";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;
app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
connectDB();

app.use('/user', router )

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });