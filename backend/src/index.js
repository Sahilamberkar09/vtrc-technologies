import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./features/auth/auth.route.js";
import messageRouter from "./features/messages/message.route.js";
import todoRouter from "./features/todo/todo.route.js";
import statRouter from "./features/stats/stat.route.js";
import cors from "cors";
import { app, server } from "./config/socket.js";

import projectRouter from "./features/projects/projectRoute.js";
import inquiryRouter from "./features/inquiry/inquiry.route.js";
import userRouter from "./features/user/user.route.js";
import quotationRouter from "./features/quotation/quotation.route.js";
import blogRouter from "./features/blog/blog.route.js";
import careerRouter from "./features/career/career.route.js";
import otpRouter from "./features/otp/otp.route.js";

dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://vtrc-technologies.vercel.app",
      "https://vtrc-technologies-admin.vercel.app",
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/todos", todoRouter);
app.use("/api/stats", statRouter);
app.use("/api/projects", projectRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/users", userRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/careers", careerRouter);
app.use("/api/otp", otpRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  connectDB();
  console.log(`✅ Server is running on port ${port}`);
});
