import React, { useState, useEffect, useContext } from "react";
import {
  Pencil,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  FolderGit2,
  Plus,
  ExternalLink,
  LayoutGrid,
  Hash,
  Calendar,
  User,
  Star,
  Terminal,
  ArrowRight,
  Shield,
  Cpu,
  X,
  Briefcase,
  Layers,
} from "lucide-react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import Modal from "../../components/common/Modal";
import { motion, AnimatePresence } from "framer-motion";

const ProjectPostView = ({ onPost, onAddTask }) => {
  const { serverUrl } = useContext(userDataContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    link: "",
    category: "",
    year: "2026",
    client: "",
    tags: "",
    isFeatured: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/projects`);
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File(
                [blob],
                file.name.split(".")[0] + ".jpg",
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                },
              );
              resolve(compressedFile);
            },
            "image/jpeg",
            0.8,
          );
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
          data.append(key, JSON.stringify(tagsArray));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (image) {
        const compressedImage = await compressImage(image);
        data.append("image", compressedImage);
      }

      if (editMode) {
        await axios.put(`${serverUrl}/api/projects/${currentProjectId}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        showModal("Success", "Project updated successfully", "success");
      } else {
        await axios.post(`${serverUrl}/api/projects`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        showModal("Success", "Project initialized successfully", "success");
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      showModal(
        "Error",
        error.response?.data?.message || "Failed to save project",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditMode(true);
    setCurrentProjectId(project._id);
    setFormData({
      title: project.title,
      subtitle: project.subtitle || "",
      description: project.description,
      link: project.link || "",
      category: project.category || "",
      year: project.year || "2026",
      client: project.client || "",
      tags: project.tags ? project.tags.join(', ') : "",
      isFeatured: project.isFeatured || false,
    });
    setImagePreview(project.image);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    showModal(
      "Confirm Delete",
      "Are you sure you want to delete this project? This action is permanent.",
      "confirm",
      async () => {
        try {
          await axios.delete(`${serverUrl}/api/projects/${id}`, {
            withCredentials: true,
          });
          showModal("Deleted", "Project removed successfully", "success");
          fetchProjects();
        } catch (error) {
          console.error("Error deleting project:", error);
          showModal("Error", "Failed to remove project", "error");
        }
      },
    );
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentProjectId(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      link: "",
      category: "",
      year: "2026",
      client: "",
      tags: "",
      isFeatured: false,
    });
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20 selection:bg-black/10 font-body items-start">
      {/* Form Sidebar */}
      <div className="w-full xl:w-[420px] xl:sticky xl:top-12 shrink-0">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl">
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-3">
              <Briefcase size={22} className="text-slate-400" />
              <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                {editMode ? "Edit Project" : "New Project"}
              </h2>
            </div>
            <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              {editMode ? "Modifying existing project node" : "Initializing new project case study"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <ImageIcon size={12} /> Project Cover
              </label>
              <label
                className={`relative flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-2xl transition-all overflow-hidden cursor-pointer ${imagePreview ? "border-black bg-white" : "border-slate-200 bg-slate-50 hover:border-black"}`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-mono">
                        Change Image <ArrowRight size={12} />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-slate-300" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                      Upload Header
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={!editMode}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs font-bold uppercase font-display"
                  placeholder="Project Title"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Industry / Tagline</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-[11px] font-bold font-mono uppercase"
                  placeholder="e.g. Fintech Solutions"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-[11px] font-bold font-mono"
                  placeholder="2026"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-[11px] font-bold font-mono uppercase"
                  placeholder="SAAS / E-COM"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Client Name</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs font-bold uppercase font-display"
                placeholder="Target Entity"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Tags (Comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-[11px] font-bold font-mono uppercase"
                placeholder="React, Next.js, Framer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Live URL</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-[11px] font-bold font-mono"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all h-32 text-xs resize-none font-body font-bold leading-relaxed"
                placeholder="Brief project summary..."
              ></textarea>
            </div>

            <div
              className="flex items-center gap-3 py-2 cursor-pointer group"
              onClick={() => handleChange({ target: { name: 'isFeatured', type: 'checkbox', checked: !formData.isFeatured } })}
            >
              <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${formData.isFeatured ? 'bg-black border-black' : 'bg-slate-50 border-slate-200 group-hover:border-black'}`}>
                {formData.isFeatured && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-600 font-mono cursor-pointer select-none">
                Featured Project
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-black text-white text-[10px] font-bold font-mono uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 rounded-xl disabled:opacity-20"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Terminal size={16} />
                    <span>{editMode ? "Update Project" : "Initialize Project"}</span>
                  </>
                )}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-6 py-4 bg-white text-slate-500 border border-slate-200 text-[10px] font-bold font-mono uppercase tracking-widest hover:border-black hover:text-black transition-all flex items-center justify-center gap-3 rounded-xl"
                >
                  <X size={16} />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Projects Grid Directory */}
      <div className="flex-1 w-full space-y-8">
        <div className="flex items-center justify-between bg-white p-8 border border-slate-100 rounded-3xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Layers size={22} className="text-slate-400" />
              <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                Registry
              </h2>
            </div>
            <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              {projects.length.toString().padStart(2, '0')} Active nodes in production
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400">Syncing Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white border border-slate-200 rounded-3xl flex flex-col hover:border-black transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden bg-slate-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Actions overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-3 bg-white/90 backdrop-blur-md text-black border border-slate-100 rounded-xl hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-3 bg-red-500/90 backdrop-blur-md text-white border border-red-400 rounded-xl hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] uppercase tracking-widest font-bold font-mono rounded-lg border border-slate-100">
                      {project.year || "2026"}
                    </span>
                    {project.isFeatured && (
                      <span className="px-3 py-1 bg-black text-white text-[9px] uppercase tracking-widest font-bold font-mono flex items-center gap-1.5 rounded-lg">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-6">
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                      {project.subtitle || project.category || "General"}
                    </div>
                    <h3 className="text-xl font-black text-black uppercase font-display leading-tight tracking-tight">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-500 font-body font-bold leading-relaxed line-clamp-3 flex-1 uppercase tracking-tight">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                    <button
                      onClick={() => onAddTask && onAddTask(project.title)}
                      className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-all font-mono"
                    >
                      <Plus size={14} /> Add Task
                    </button>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-black hover:text-white rounded-xl transition-all border border-slate-100"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50/50 px-8 py-3 border-t border-slate-50 flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  <span>ID: {project._id.substring(0, 8).toUpperCase()}</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full py-40 flex flex-col items-center justify-center border border-dashed border-slate-100 text-center rounded-3xl bg-white">
                <FolderGit2 className="w-16 h-16 text-slate-100 mb-6" />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                    No Projects
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                    Waiting for the first monument to be initialized.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default ProjectPostView;
