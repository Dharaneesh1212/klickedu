import User from "../models/Employee.js";
import jwt from "jsonwebtoken";
import { decryptPassword, encryptPassword } from "../utils/index.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, factoryName, password, confirmPassword, userType } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const encryptedPassword = encryptPassword(password);
    const newUser = new User({
      username,
      factoryName,
      password: encryptedPassword,
      confirmPassword: encryptedPassword,
      userType,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Signin
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const decryptedPassword = decryptPassword(user.password);
    if (password !== decryptedPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, userType: user.userType },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      token,
      user: { username: user.username, userType: user.userType },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
