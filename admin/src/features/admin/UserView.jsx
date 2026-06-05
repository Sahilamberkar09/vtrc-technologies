import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  UserPlus, 
  Users, 
  Loader2, 
  X, 
  Terminal, 
  Shield, 
  ArrowRight, 
  Edit3,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  Mail,
  Calendar,
  Lock
} from "lucide-react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { serverUrl, user: currentUser } = useContext(userDataContext);

  // New User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Edit User Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/users`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this operator?")) return;
    try {
      const response = await axios.delete(`${serverUrl}/api/users/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");

    try {
      const response = await axios.post(
        `${serverUrl}/api/users`,
        { name, email, password, role },
        { withCredentials: true },
      );

      if (response.data.success) {
        setUsers([...users, response.data.user]);
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to create operator registry.");
      }
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); 
    setRole(user.role);
    setIsEditModalOpen(true);
    setErrorMsg("");
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg("");

    try {
      const payload = {
        name,
        email,
        role,
        userIdToUpdate: editingUserId,
      };

      if (password) {
        payload.password = password;
      }

      const response = await axios.put(
        `${serverUrl}/api/auth/profile`,
        payload,
        { withCredentials: true },
      );

      if (response.data.success) {
        setUsers(
          users.map((u) =>
            u._id === editingUserId ? { ...u, ...response.data.user } : u,
          ),
        );
        setIsEditModalOpen(false);
        resetForm();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to update operator details.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setEditingUserId(null);
    setErrorMsg("");
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Syncing Registry...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-outline-variant rounded-3xl overflow-hidden selection:bg-black/10 font-body">
      <div className="p-8 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-surface-container-low/30">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <Users size={20} className="text-secondary" />
             <h2 className="text-2xl font-black text-black font-display uppercase tracking-tight">Core Registry</h2>
          </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">Manage system administrative operators</p>
        </div>
        {currentUser?.role === "superadmin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 rounded-xl shadow-lg shadow-black/5"
          >
            <UserPlus size={16} /> New Operator
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low text-secondary border-b border-outline-variant">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-mono">Operator</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-mono">Email Address</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-mono">Added On</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-mono">Access Level</th>
              {currentUser?.role === "superadmin" && (
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-mono text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-black group-hover:text-white transition-all">
                          {user.name[0].toUpperCase()}
                       </div>
                       <span className="font-black uppercase font-display tracking-tight text-black text-base">
                        {user.name}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-tight">
                      <Mail size={12} className="text-slate-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] font-bold">
                      <Calendar size={12} className="text-slate-300" />
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono ${
                      user.role === "superadmin" 
                        ? "bg-black text-white" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  {currentUser?.role === "superadmin" && (
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-black hover:border-black rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2.5 bg-white border border-red-100 text-red-300 hover:text-red-600 hover:border-red-200 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-300 font-mono text-[10px] font-bold uppercase tracking-widest">
                  No operator records detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <UserPlus size={20} className="text-slate-400" />
                   <h2 className="text-xl font-black font-display uppercase tracking-tight text-black">
                    New Operator
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase"
                      placeholder="operator@vtrc.tech"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Security Matrix</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="password"
                        required
                        minLength="6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Access Level</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase appearance-none cursor-pointer"
                    >
                      <option value="admin">Admin Protocol</option>
                      <option value="superadmin">Superadmin Core</option>
                    </select>
                  </div>
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[9px] font-black font-mono uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={14} /> {errorMsg}
                    </div>
                  )}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={creating}
                      className="w-full px-6 py-4 bg-black text-white text-[10px] font-bold font-mono uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-20 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-black/5"
                    >
                      {creating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Initialize Node
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Edit3 size={20} className="text-slate-400" />
                   <h2 className="text-xl font-black font-display uppercase tracking-tight text-black">
                    Update Operator
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={handleEditUser} className="space-y-6">
                   <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Security Matrix <span className="opacity-40 font-normal normal-case">(OPTIONAL)</span></label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="password"
                        minLength="6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">Access Level</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none text-xs font-bold font-mono transition-all uppercase appearance-none cursor-pointer"
                    >
                      <option value="admin">Admin Protocol</option>
                      <option value="superadmin">Superadmin Core</option>
                    </select>
                  </div>
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[9px] font-black font-mono uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={14} /> {errorMsg}
                    </div>
                  )}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full px-6 py-4 bg-black text-white text-[10px] font-bold font-mono uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-20 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-black/5"
                    >
                      {updating ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserView;
