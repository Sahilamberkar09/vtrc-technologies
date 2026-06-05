import User from "../user/user.model.js";
import Todo from "../todo/todo.model.js";
import Message from "../messages/message.model.js";
import Project from "../projects/Project.js";
import Inquiry from "../inquiry/Inquiry.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeTasks = await Todo.countDocuments({
      status: { $ne: "completed" },
    });
    const totalMessages = await Message.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();

    // Aggregating project breakdowns from tasks
    const taskProjectBreakdown = await Todo.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$project" } } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Aggregating projects by category
    const projectsByCategory = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Getting recent tasks
    const recentTasks = await Todo.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title project status createdAt");

    // Getting recent messages
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("senderId", "name")
      .select("text image createdAt senderId");

    // Getting recent projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title image category createdAt");

    res.status(200).json({
      vitalStats: {
        totalUsers,
        activeTasks,
        totalMessages,
        totalProjects,
        totalInquiries,
      },
      taskProjectBreakdown,
      projectsByCategory,
      recentActivity: {
        tasks: recentTasks,
        messages: recentMessages,
        projects: recentProjects,
        inquiries: await Inquiry.find().sort({ createdAt: -1 }).limit(5).select("name email phone message createdAt"),
      },
    });
  } catch (error) {
    console.log("Error in getStats controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
