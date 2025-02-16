import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth-controller";
import { refreshAccessToken } from "../middlewares/auth-middleware";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
