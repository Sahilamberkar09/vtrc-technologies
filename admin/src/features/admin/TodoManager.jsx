import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  CheckCircle,
  Search,
  Folder,
  AlertTriangle,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Check,
  ChevronRight,
  X,
  Briefcase,
  Clock,
} from "lucide-react";
import { userDataContext } from "../../context/UserContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";

const TodoManager = ({ prefilledProject = "" }) => {
  const { serverUrl } = useContext(userDataContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    project: prefilledProject,
  });
  const [error, setError] = useState("");
  const [filterProject, setFilterProject] = useState(prefilledProject);

  useEffect(() => {
    if (prefilledProject) {
      setNewTodo((prev) => ({ ...prev, project: prefilledProject }));
      setFilterProject(prefilledProject);
    }
  }, [prefilledProject]);

  const uniqueProjects = [
    ...new Set(todos.map((t) => t.project).filter(Boolean)),
  ];

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/todos`, {
        withCredentials: true,
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos", err);
      setError("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [serverUrl]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim() || !newTodo.project.trim()) {
      setError("Title and Project are required.");
      return;
    }
    setError("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/todos`,
        {
          title: newTodo.title,
          description: newTodo.description,
          project: newTodo.project.trim(),
        },
        { withCredentials: true },
      );

      setTodos([res.data, ...todos]);
      setNewTodo({ title: "", description: "", project: newTodo.project });
    } catch (err) {
      console.error("Error adding todo", err);
      setError("Failed to create task.");
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const statuses = ["pending", "in-progress", "completed"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      const res = await axios.put(
        `${serverUrl}/api/todos/${id}`,
        { status: nextStatus },
        { withCredentials: true },
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/todos/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo", err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    const draggedTodoIndex = todos.findIndex((t) => t._id === draggableId);
    if (draggedTodoIndex === -1) return;

    const draggedTodo = todos[draggedTodoIndex];

    if (source.droppableId !== destination.droppableId) {
      const newTodos = [...todos];
      newTodos[draggedTodoIndex] = { ...draggedTodo, status: newStatus };
      setTodos(newTodos);

      try {
        await axios.put(
          `${serverUrl}/api/todos/${draggableId}`,
          { status: newStatus },
          { withCredentials: true },
        );
      } catch (err) {
        console.error("Error dragging/updating status", err);
        fetchTodos();
      }
    } else {
      const columnTodos = todos.filter((t) => t.status === source.droppableId);
      const movedItem = columnTodos[source.index];

      columnTodos.splice(source.index, 1);
      columnTodos.splice(destination.index, 0, movedItem);

      const otherTodos = todos.filter((t) => t.status !== source.droppableId);
      setTodos([...columnTodos, ...otherTodos]);
    }
  };

  return (
    <div className="space-y-8 selection:bg-black/10 font-body pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-100 p-8 rounded-2xl space-y-8">
        <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-8">
          <div className="space-y-4 flex-1">
             <div className="flex items-center gap-3">
                <Briefcase size={24} className="text-slate-400" />
                <h1 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                  Project Tasks
                </h1>
             </div>
            <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              Manage operational tasks and project milestones.
            </p>
            
            <div className="max-w-xl">
               <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by project name..."
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent focus:border-black outline-none text-xs font-bold font-mono uppercase tracking-widest rounded-xl transition-all"
                  />
               </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 border border-red-100 rounded-xl text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Add Task Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all">
              <form onSubmit={handleAddTodo} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3 space-y-2">
                    <input
                      type="text"
                      list="project-list"
                      placeholder="PROJECT"
                      value={newTodo.project}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, project: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-transparent focus:border-black outline-none text-[10px] font-bold font-mono uppercase rounded-xl transition-all"
                    />
                    <datalist id="project-list">
                      {uniqueProjects.map((proj, idx) => (
                        <option key={idx} value={proj} />
                      ))}
                    </datalist>
                  </div>
                  <div className="w-full sm:w-2/3 space-y-2">
                    <input
                      type="text"
                      placeholder="TASK TITLE"
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-transparent focus:border-black outline-none text-[10px] font-bold font-mono uppercase rounded-xl transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                   <input
                     type="text"
                     placeholder="ADDITIONAL DETAILS (OPTIONAL)"
                     value={newTodo.description}
                     onChange={(e) =>
                       setNewTodo({ ...newTodo, description: e.target.value })
                     }
                     className="w-full px-4 py-3 bg-white border border-transparent focus:border-black outline-none text-[10px] font-bold font-mono uppercase rounded-xl transition-all"
                   />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 rounded-xl shrink-0"
                  >
                    <Plus size={16} /> Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          <TaskColumn
            title="Awaiting"
            status="pending"
            todos={todos}
            filterProject={filterProject}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            colorTheme="bg-white"
            icon={<Clock size={16} />}
          />
          <TaskColumn
            title="In Progress"
            status="in-progress"
            todos={todos}
            filterProject={filterProject}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            colorTheme="bg-white"
            icon={<Activity size={16} />}
          />
          <TaskColumn
            title="Finalized"
            status="completed"
            todos={todos}
            filterProject={filterProject}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            colorTheme="bg-white"
            icon={<Shield size={16} />}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

const TaskColumn = ({
  title,
  status,
  todos,
  filterProject,
  onUpdateStatus,
  onDelete,
  colorTheme,
  icon,
}) => {
  const filteredTodos = todos.filter((t) => {
    if (t.status !== status) return false;
    if (filterProject && filterProject.trim() !== "") {
      return t.project
        ?.toLowerCase()
        .includes(filterProject.trim().toLowerCase());
    }
    return true;
  });

  return (
    <div
      className={`${colorTheme} border border-slate-100 flex flex-col rounded-3xl overflow-hidden min-h-[500px]`}
    >
      {/* Column Title */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-100">
              {icon}
           </div>
          <span className="font-black font-display uppercase tracking-tight text-sm">{title}</span>
        </div>
        <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-md font-mono uppercase tracking-widest">
          {filteredTodos.length.toString().padStart(2, '0')}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? "bg-slate-50" : ""}`}
          >
            {filteredTodos.length === 0 && !snapshot.isDraggingOver ? (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-slate-100 bg-white/50 space-y-2 rounded-2xl">
                 <Layers size={20} className="text-slate-100" />
                 <p className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-widest">Empty</p>
              </div>
            ) : (
              filteredTodos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided, dragSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group relative bg-white border border-outline-variant rounded-2xl transition-all ${dragSnapshot.isDragging ? "shadow-2xl z-50 scale-[1.02] border-black" : "hover:border-black hover:shadow-lg"} ${status === "completed" && !dragSnapshot.isDragging ? "opacity-60" : ""}`}
                    >
                      {/* Top Bar for Project */}
                      <div className="px-5 py-3 border-b border-surface-container-low flex justify-between items-center">
                        <span className="text-[9px] font-black text-secondary flex items-center gap-2 truncate font-mono uppercase tracking-widest">
                          <Folder size={10} /> {todo.project}
                        </span>
                        <button
                          onClick={() => onDelete(todo._id)}
                          className="text-secondary hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3
                          className={`font-black text-black text-xs leading-tight uppercase font-display tracking-tight ${status === "completed" ? "line-through opacity-50" : ""}`}
                        >
                          {todo.title}
                        </h3>

                        {todo.description && (
                          <p className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tight leading-relaxed line-clamp-2">
                            {todo.description}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-50">
                          <button
                            onClick={() =>
                              onUpdateStatus(todo._id, todo.status)
                            }
                            className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition-all uppercase tracking-widest font-mono ${status === "completed" ? "bg-white text-slate-400 border-slate-200 hover:border-black hover:text-black" : "bg-black text-white border-black hover:bg-slate-800"}`}
                          >
                             {status === "completed" ? "Revive" : "Progress"}
                          </button>
                          <div className="flex gap-1">
                             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoManager;
