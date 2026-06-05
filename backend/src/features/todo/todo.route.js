import express from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todo.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getTodos);
router.post("/", protectRoute, createTodo);
router.put("/:id", protectRoute, updateTodo);
router.delete("/:id", protectRoute, deleteTodo);

export default router;
