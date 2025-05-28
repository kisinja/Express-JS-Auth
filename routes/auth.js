import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {generateToken} from "../utils/index.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.json({
      message: "All fields are required for user registration!",
    }).status(400);
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ message: "Account already exists. Please Login!" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Generate a token for the new user
    const token = generateToken({
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser, token });
  } catch (error) {
    console.log(`Error registering user: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.json({
      message: "Email and password are required for login!",
    });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (!userExists)
      return res
        .status(400)
        .json({ message: "Account not found. Please Register!" });

    // Compare the password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Wrong password!" });

    // Generate a token for the user
    const token = generateToken({
      id: userExists._id,
      username: userExists.username,
      role: userExists.role,
    });

    return res.status(200).json({
      message: "User logged in successfully!",
      token,
    });
  } catch (error) {
    console.log(`Error logging in user: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;