import { generateTokens } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password)
      return res.status(400).json({ message: "All files are required" });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      name,
      password: hashPass,
    });

    if (newUser) {
      generateTokens(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(`Error in signup`, error.message);
    res.status(500).json({ message: `Internal Server Error` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Account already exists, please login" });
    const isPassCorr = await bcrypt.compare(password, user.password);
    if (!isPassCorr)
      return res.status(400).json({ message: "Invalid crendentials" });
    generateTokens(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: `Internal server error` });
  }
};
  
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic} = req.body
    const userId = req.user._id
    if (!profilePic) return res.status(400).json({ message: "Profile is missing"})
      const uploadPic = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadPic.secure_url}, {new: true})
    res.status(200).json(updateUser)
  } catch (error) {
    console.error("error in update profile", error)
    res.status(500).json({ message: "Internal server error"})
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server error"})
  }
}