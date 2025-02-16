import express from "express";
const router = express.Router();
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
  } from "../controllers/auth-controller";

  router.post("/register", registerUser);
  router.post("/login", loginUser);
  router.post("/logout", logoutUser);
  router.post("/refresh-token", refreshAccessToken);

  

export default router;
