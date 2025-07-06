import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken, clearCookie } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, fullName, password: hashedPassword });
    if (user) {
      // generate token and save it to cookie
      generateToken(res, user._id);
      await user.save();
      res.status(201).json({
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log('Error in signup controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    clearCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log('Error in logout controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  if (!profilePic) {
    return res.status(400).json({ message: "Profile picture is required" });
  }
  try {
    const curUserId = req.user._id;
    const user = await User.findById(curUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profilePics",
      width: 500,
      height: 500,
      crop: "fill",
    });
    const upadateUser = await User.findByIdAndUpdate(curUserId, {
      profilePic: uploadedResponse.secure_url,
    }, { new: true }); // { new: true } 表示返回更新后的用户信息
    res.status(200).json(upadateUser);
  } catch (error) {
    console.log('Error in updateProfile controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    console.log('Error in checkAuth controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}