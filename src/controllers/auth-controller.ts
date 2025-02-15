import User from "../models/user-model";
import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "User registered successfully",
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export default registerUser;
