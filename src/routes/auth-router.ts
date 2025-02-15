import express from "express";
const router = express.Router();
import registerUser from "../controllers/auth-controller";

router.post('/register', async (req, res, next) => {
    try {
        await registerUser(req, res);
    } catch (err) {
        next(err); // Pass errors to Express error handler
    }
});

export default router;
