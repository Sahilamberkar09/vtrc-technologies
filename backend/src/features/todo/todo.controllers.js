import Todo from "./todo.model.js";

// Get all todos
export const getTodos = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error in getTodos controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, project, status } = req.body;

    if (!title || !project) {
      return res.status(400).json({ error: "Title and Project are required" });
    }

    const newTodo = new Todo({
      title,
      description: description || "",
      project,
      status: status || "pending",
    });

    if (newTodo) {
      await newTodo.save();
      res.status(201).json(newTodo);
    } else {
      res.status(400).json({ error: "Invalid todo data" });
    }
  } catch (error) {
    console.error("Error in createTodo controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error in updateTodo controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await Todo.findByIdAndDelete(id);

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTodo controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
