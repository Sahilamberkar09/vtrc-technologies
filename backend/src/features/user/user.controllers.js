import User from "./user.model.js";
import bcrypt from "bcryptjs";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new user (admin only)
export const createUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only SuperAdmins can create users.",
      });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userRole =
      role && ["admin", "superadmin"].includes(role) ? role : "admin";

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: userRole,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only SuperAdmins can delete users.",
      });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves if needed, but for now just delete
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
