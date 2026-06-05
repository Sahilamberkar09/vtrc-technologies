import express from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import {
  getUsers,
  createUser,
  deleteUser,
} from "./user.controllers.js";

const userRouter = express.Router();

userRouter.use(protectRoute);

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
