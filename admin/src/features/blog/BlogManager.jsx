import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Layout,
  FileText,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BlogManager = () => {
  const { serverUrl } = useContext(userDataContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Tech",
    tags: "",
    isPublished: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/blogs/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "title" && !editingBlog) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Tech",
      tags: "",
      isPublished: false,
    });
    setCoverImage(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(", "),
      isPublished: blog.isPublished,
    });
    setCoverImage(null);
    setPreviewUrl(blog.coverImage);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("isPublished", formData.isPublished);
    
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    data.append("tags", JSON.stringify(tagsArray));
    
    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    try {
      if (editingBlog) {
        await axios.put(`${serverUrl}/api/blogs/${editingBlog._id}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Blog updated successfully");
      } else {
        await axios.post(`${serverUrl}/api/blogs`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Blog created successfully");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${serverUrl}/api/blogs/${id}`, { withCredentials: true });
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 selection:bg-black/10 font-body">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 border border-outline-variant rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Layout size={20} className="text-secondary" />
            <h2 className="text-3xl font-black text-black font-display uppercase tracking-tight">Blog Repository</h2>
          </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            Manage thought leadership and editorial content.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-on-background/80 transition-all rounded-2xl flex items-center gap-3 shadow-xl shadow-black/10"
        >
          <Plus size={16} /> Compose New
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="SEARCH CONTENT BY TITLE OR CATEGORY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[10px] font-bold font-mono uppercase tracking-widest placeholder:text-outline-variant"
          />
        </div>
        <button onClick={fetchBlogs} className="p-4 bg-white border border-outline-variant rounded-2xl text-secondary hover:text-black hover:border-black transition-all">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Indexing Content Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-outline-variant rounded-3xl overflow-hidden hover:border-black transition-all duration-500 flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-surface-container-low">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline-variant">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                   <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border ${blog.isPublished ? 'bg-green-500 text-white border-green-400' : 'bg-surface-container-dim text-secondary border-outline-variant'}`}>
                    {blog.isPublished ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-bold text-secondary bg-surface-container-low px-3 py-1 rounded-md font-mono uppercase tracking-widest">
                    {blog.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-black uppercase font-display tracking-tight mb-4 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-[11px] font-bold text-secondary uppercase font-mono tracking-tight line-clamp-3 mb-8 leading-relaxed italic">
                  "{blog.excerpt}"
                </p>

                <div className="mt-auto pt-6 border-t border-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container-low rounded-lg flex items-center justify-center text-[10px] font-black text-secondary uppercase font-display border border-outline-variant/30">
                       {blog.author?.name[0]}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-black uppercase font-display">{blog.author?.name}</p>
                      <p className="text-[8px] font-bold text-secondary uppercase font-mono tracking-widest">{new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(blog)}
                      className="p-2.5 bg-surface-container-low text-secondary hover:text-black hover:bg-white border border-outline-variant/30 rounded-xl transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2.5 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Compose/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-outline-variant/30"
            >
              <div className="p-8 border-b border-surface-container-low flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-container-low text-black rounded-2xl border border-outline-variant/20">
                     <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display uppercase tracking-tight text-black">
                      {editingBlog ? "Modify Content" : "Index New Node"}
                    </h3>
                    <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">CONTENT SPECIFICATION LAYER</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all text-secondary">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-surface-container-low/20 custom-scrollbar">
                <form id="blogForm" onSubmit={handleSubmit} className="space-y-10">
                  {error && (
                    <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-4 border border-red-100">
                      <AlertTriangle size={20} /> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                      {/* Title & Slug */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Article Title</label>
                          <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="ENTER COMPELLING HEADLINE..."
                            className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-sm font-black uppercase font-display"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Resource Slug (Unique ID)</label>
                          <input
                            type="text"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="auto-generated-slug"
                            className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Meta Summary / Excerpt</label>
                        <textarea
                          name="excerpt"
                          required
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="BRIEF SUMMARY FOR PREVIEW CARDS..."
                          className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase resize-none leading-relaxed"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Primary Content (HTML/Markdown Supported)</label>
                        <textarea
                          name="content"
                          required
                          value={formData.content}
                          onChange={handleInputChange}
                          rows="12"
                          placeholder="DIVE INTO THE TECHNICAL DEPTHS..."
                          className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      {/* Cover Image Upload */}
                      <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Visual Identity</label>
                        <div 
                          className="aspect-square bg-white border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-black transition-all relative overflow-hidden group"
                          onClick={() => document.getElementById("fileInput").click()}
                        >
                          {previewUrl ? (
                            <>
                              <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Upload size={24} />
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload size={32} className="text-outline-variant mb-4" />
                              <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">DRAG IMAGE OR CLICK TO BROWSE</p>
                            </>
                          )}
                          <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                      </div>

                      {/* Settings */}
                      <div className="p-8 bg-white border border-outline-variant rounded-3xl space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Taxonomy Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-black uppercase font-display cursor-pointer"
                          >
                            <option value="Tech">Technical Depth</option>
                            <option value="Design">Visual Systems</option>
                            <option value="Strategy">Strategic Axis</option>
                            <option value="Agency">Internal Nodes</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Tags (Comma Separated)</label>
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="AI, BLOCKCHAIN, WEB3..."
                            className="w-full px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-bold font-mono uppercase"
                          />
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                           <div className="flex items-center gap-3">
                              <CheckCircle2 size={18} className={formData.isPublished ? "text-green-500" : "text-outline-variant"} />
                              <span className="text-[10px] font-black uppercase font-display text-black">Published</span>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isPublished"
                              checked={formData.isPublished}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-container-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-8 border-t border-surface-container-low bg-white flex justify-end gap-4 shrink-0">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-white border border-outline-variant text-secondary text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all rounded-2xl font-mono"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  form="blogForm"
                  disabled={isSaving}
                  className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-on-background/80 transition-all rounded-2xl font-mono flex items-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "SYNCHRONIZING..." : editingBlog ? "UPDATE RESOURCE" : "INITIALIZE NODE"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Save = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

export default BlogManager;
