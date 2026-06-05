import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  User,
  Tag,
  ArrowRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Layout,
  FileText,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CareerManager = () => {
  const { serverUrl } = useContext(userDataContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    jobTitle: "",
    slug: "",
    department: "Engineering",
    location: "Remote",
    jobType: "Full-time",
    description: "",
    requirements: "",
    benefits: "",
    salaryRange: "",
    isOpen: true,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/careers/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
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

    if (name === "jobTitle" && !editingJob) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
      }));
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      jobTitle: "",
      slug: "",
      department: "Engineering",
      location: "Remote",
      jobType: "Full-time",
      description: "",
      requirements: "",
      benefits: "",
      salaryRange: "",
      isOpen: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      jobTitle: job.jobTitle,
      slug: job.slug,
      department: job.department,
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      requirements: job.requirements.join("\n"),
      benefits: job.benefits.join("\n"),
      salaryRange: job.salaryRange,
      isOpen: job.isOpen,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      requirements: formData.requirements.split("\n").filter(r => r.trim() !== ""),
      benefits: formData.benefits.split("\n").filter(b => b.trim() !== ""),
    };

    try {
      if (editingJob) {
        await axios.put(`${serverUrl}/api/careers/${editingJob._id}`, payload, {
          withCredentials: true,
        });
        setSuccess("Job listing updated successfully");
      } else {
        await axios.post(`${serverUrl}/api/careers`, payload, {
          withCredentials: true,
        });
        setSuccess("Job listing created successfully");
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await axios.delete(`${serverUrl}/api/careers/${id}`, { withCredentials: true });
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 selection:bg-black/10 font-body">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 border border-outline-variant rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-secondary" />
            <h2 className="text-3xl font-black text-black font-display uppercase tracking-tight">Talent Acquisition</h2>
          </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            Manage global career openings and organizational growth.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-on-background/80 transition-all rounded-2xl flex items-center gap-3 shadow-xl shadow-black/10"
        >
          <Plus size={16} /> Post Opening
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY ROLE, DEPARTMENT, OR LOCATION..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[10px] font-bold font-mono uppercase tracking-widest placeholder:text-outline-variant"
          />
        </div>
        <button onClick={fetchJobs} className="p-4 bg-white border border-outline-variant rounded-2xl text-secondary hover:text-black hover:border-black transition-all">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Synchronizing Talent Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job, idx) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-outline-variant rounded-3xl p-8 hover:border-black transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              <div className="flex items-start gap-6">
                 <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary border border-outline-variant/30 group-hover:bg-black group-hover:text-white transition-all">
                    <Briefcase size={28} strokeWidth={1.5} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                       <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">{job.jobTitle}</h3>
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border ${job.isOpen ? 'bg-black text-white border-black' : 'bg-surface-container-dim text-secondary border-outline-variant'}`}>
                          {job.isOpen ? 'ACTIVE' : 'CLOSED'}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-secondary font-mono uppercase tracking-widest flex-wrap">
                       <span className="flex items-center gap-2"><Building2 size={12} /> {job.department}</span>
                       <span className="flex items-center gap-2"><MapPin size={12} /> {job.location}</span>
                       <span className="flex items-center gap-2"><Clock size={12} /> {job.jobType}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button
                    onClick={() => openEditModal(job)}
                    className="flex-1 md:flex-none px-6 py-3 bg-surface-container-low text-secondary hover:text-black hover:bg-white border border-outline-variant/30 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                 >
                    <Edit2 size={14} /> Configure
                 </button>
                 <button
                    onClick={() => handleDelete(job._id)}
                    className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border border-red-100 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                 >
                    <Trash2 size={14} /> Remove
                 </button>
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && !loading && (
            <div className="border border-dashed border-outline-variant py-32 text-center rounded-3xl bg-white">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                No Vacancies Found
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary mt-2">
                No talent nodes matching your current query.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Post/Edit Modal */}
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
                     <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display uppercase tracking-tight text-black">
                      {editingJob ? "Configure Role" : "Post Vacancy"}
                    </h3>
                    <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">ORGANIZATIONAL GROWTH LAYER</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all text-secondary">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-surface-container-low/20 custom-scrollbar">
                <form id="jobForm" onSubmit={handleSubmit} className="space-y-10">
                  {error && (
                    <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-4 border border-red-100">
                      <AlertTriangle size={20} /> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                      {/* Title & Slug */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Job Title</label>
                          <input
                            type="text"
                            name="jobTitle"
                            required
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. SENIOR BLOCKCHAIN ENGINEER"
                            className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-sm font-black uppercase font-display"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Role Slug</label>
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

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Role Description</label>
                        <textarea
                          name="description"
                          required
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="5"
                          placeholder="OUTLINE THE CORE MISSION AND RESPONSIBILITIES..."
                          className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase resize-none leading-relaxed"
                        />
                      </div>

                      {/* Requirements & Benefits */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Requirements (One per line)</label>
                          <textarea
                            name="requirements"
                            required
                            value={formData.requirements}
                            onChange={handleInputChange}
                            rows="8"
                            placeholder="TECHNICAL STACK, EXPERIENCE..."
                            className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase resize-none leading-relaxed"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Benefits (One per line)</label>
                          <textarea
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleInputChange}
                            rows="8"
                            placeholder="EQUITY, HEALTHCARE, REMOTE ALLOWANCE..."
                            className="w-full px-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[11px] font-bold font-mono uppercase resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      {/* Classification Settings */}
                      <div className="p-8 bg-white border border-outline-variant rounded-3xl space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Department Axis</label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-black uppercase font-display cursor-pointer"
                          >
                            <option value="Engineering">Engineering Nodes</option>
                            <option value="Design">Visual Systems</option>
                            <option value="Product">Product Strategy</option>
                            <option value="Operations">Internal Operations</option>
                            <option value="Marketing">Growth & Acquisition</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Location Node</label>
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-black uppercase font-display cursor-pointer"
                          >
                            <option value="Remote">Remote Sync</option>
                            <option value="Hybrid">Hybrid Grid</option>
                            <option value="On-site">Physical Node</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Engagement Type</label>
                          <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-black uppercase font-display cursor-pointer"
                          >
                            <option value="Full-time">Full-time Sync</option>
                            <option value="Part-time">Part-time Node</option>
                            <option value="Contract">Project Contract</option>
                            <option value="Internship">Training Phase</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Allocation Range</label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                            <input
                              type="text"
                              name="salaryRange"
                              value={formData.salaryRange}
                              onChange={handleInputChange}
                              placeholder="e.g. $120K - $180K"
                              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-[10px] font-bold font-mono uppercase"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                           <div className="flex items-center gap-3">
                              <CheckCircle2 size={18} className={formData.isOpen ? "text-green-500" : "text-outline-variant"} />
                              <span className="text-[10px] font-black uppercase font-display text-black">Active Listing</span>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isOpen"
                              checked={formData.isOpen}
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
                  form="jobForm"
                  disabled={isSaving}
                  className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-on-background/80 transition-all rounded-2xl font-mono flex items-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "SYNCHRONIZING..." : editingJob ? "UPDATE ROLE" : "POST OPENING"}
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

export default CareerManager;
