import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import genToken from "../../config/token.js";

//sign up module here
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check is name and email and password are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //check is password length is less than 6
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existEmail = await User.findOne({ email });

    //check is email already exists
    if (existEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    //hashing password here
    const hashPassword = await bcrypt.hash(password, 10);

    //creating user here
    const user = await User.create({ name, email, password: hashPassword });

    //generating token here
    const token = await genToken(user._id);

    //token parse into cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });

    //return user and token in one response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Sign Up Error: ${error.message}` });
  }
};

//log in module here
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    //check is user not found
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //check is password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    //generating token here
    const token = await genToken(user._id);

    //token parse into cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });

    //return user and token in one response
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Login Error ${error.message}` });
  }
};

//logout module here
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: `Logout Error ${error}` });
  }
};

//get profile module here
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in getProfile: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//update profile module here
const updateProfile = async (req, res) => {
  try {
    const { name, email, password, role, userIdToUpdate } = req.body;
    let targetUserId = req.user._id;

    // Check if the user is attempting to update another user
    if (userIdToUpdate && userIdToUpdate !== req.user._id.toString()) {
      if (req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Only SuperAdmins can modify other user accounts.",
        });
      }
      targetUserId = userIdToUpdate;
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: targetUserId },
      });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    if (role && req.user.role === "superadmin") {
      if (["admin", "superadmin"].includes(role)) {
        user.role = role;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in updateProfile: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { signUp, login, logout, getProfile, updateProfile };
