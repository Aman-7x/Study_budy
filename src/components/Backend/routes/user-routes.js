import express from "express";
import { getAllUser, login, signup } from "../controllers/user-controller.js"; // Correct path to user-controller.js

const router = express.Router();

// Define routes
router.get("/", getAllUser);       // Fetch all users
router.post("/signup", signup);   // Signup a new user
router.post("/login", login);     // Login an existing user

export default router;
