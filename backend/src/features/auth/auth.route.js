import express from "express";
import {
  signUp,
  login,
  logout,
  getProfile,
  updateProfile,
} from "./auth.controllers.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

authRouter.get("/test", (req, res) => res.json({ message: "Auth route active" }));
authRouter.get("/profile", protectRoute, (req, res, next) => {
  console.log("Profile route accessed by user:", req.user?._id);
  next();
}, getProfile);
authRouter.put("/profile", protectRoute, updateProfile);

export default authRouter;
