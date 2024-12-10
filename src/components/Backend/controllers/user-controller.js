import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Fetch all users
export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No Users Found" });
        }
        return res.status(200).json({ success: true, users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Signup a new user
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exists! Login Instead" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create and save new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            blogs: [],
        });

        await user.save();
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Error during signup:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Login an existing user
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "Could Not Find User By This Email" });
        }

        // Compare passwords
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET_KEY,  // Use the secret from .env file
            { expiresIn: "1h" }          // Token expiration
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,  // Send token as response
            user: { id: existingUser._id, name: existingUser.name, email: existingUser.email }
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
