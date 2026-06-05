import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import {
  Search,
  Trash2,
  Briefcase,
  Calendar,
  User,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApplicationManager = () => {
  const { serverUrl } = useContext(userDataContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/careers/applications`, {
        withCredentials: true,
      });
      console.log("Fetch Applications Success:", response.data);
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setIsUpdating(true);
    try {
      await axios.patch(`${serverUrl}/api/careers/applications/${id}`, { status }, {
        withCredentials: true,
      });
      setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
      if (selectedApp?._id === id) setSelectedApp({ ...selectedApp, status });
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${serverUrl}/api/careers/applications/${id}`, { withCredentials: true });
      setApplications(applications.filter((app) => app._id !== id));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredApps = applications.filter(
    (app) =>
      (app.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (app.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (app.discipline?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDownloadUrl = (url) => {
    if (!url || typeof url !== 'string') return "";
    // If it's a Cloudinary image-type PDF, try to use raw-type for better download support
    if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
      return url.replace("/image/upload/", "/raw/upload/");
    }
    return url;
  };

  const handleDownload = async (url, filename) => {
    const downloadUrl = getDownloadUrl(url);
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: try opening the modified URL in a new tab
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8 pb-20 selection:bg-black/10 font-body">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 border border-outline-variant rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-secondary" />
            <h2 className="text-3xl font-black text-black font-display uppercase tracking-tight">Applicant Dossier</h2>
          </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            Review and manage speculative job applications.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY NAME, EMAIL, OR DISCIPLINE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-outline-variant focus:border-black rounded-2xl outline-none transition-all text-[10px] font-bold font-mono uppercase tracking-widest placeholder:text-outline-variant"
          />
        </div>
        <button onClick={fetchApplications} className="p-4 bg-white border border-outline-variant rounded-2xl text-secondary hover:text-black hover:border-black transition-all">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Parsing Applications...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredApps.map((app, idx) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-outline-variant rounded-3xl p-8 hover:border-black transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 cursor-pointer"
              onClick={() => { setSelectedApp(app); setIsModalOpen(true); }}
            >
              <div className="flex items-start gap-6">
                 <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary border border-outline-variant/30 group-hover:bg-black group-hover:text-white transition-all">
                    <User size={28} strokeWidth={1.5} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                       <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">{app.name}</h3>
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border ${getStatusColor(app.status)}`}>
                          {app.status}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-secondary font-mono uppercase tracking-widest flex-wrap">
                       <span className="flex items-center gap-2"><Briefcase size={12} /> {app.jobId?.jobTitle || "Speculative Application"}</span>
                       <span className="flex items-center gap-2 text-black/60"><Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                       <span className="text-black/40">ID: {app._id.slice(-6).toUpperCase()}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 group-hover:border-black group-hover:text-black transition-all">
                    View Full Dossier
                 </div>
              </div>
            </motion.div>
          ))}

          {filteredApps.length === 0 && !loading && (
            <div className="border border-dashed border-outline-variant py-32 text-center rounded-3xl bg-white">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                No Applications Found
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary mt-2">
                The recruitment pipeline is currently empty.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detailed View Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-outline-variant/30"
            >
              <div className="p-8 border-b border-surface-container-low flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center">
                     <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display uppercase tracking-tight text-black">{selectedApp.name}</h3>
                    <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-widest">{selectedApp.discipline} CANDIDATE</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all text-secondary">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-surface-container-low/20 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-8 space-y-10">
                    <section className="space-y-4">
                      <div className="flex items-center gap-3">
                         <MessageSquare size={18} className="text-black" />
                         <h4 className="text-sm font-black uppercase font-display text-black">The Pitch</h4>
                      </div>
                      <div className="p-8 bg-white border border-outline-variant rounded-3xl">
                         <p className="text-[11px] font-bold font-mono uppercase tracking-widest text-secondary leading-loose italic">
                           "{selectedApp.pitch}"
                         </p>
                      </div>
                    </section>

                    <section className="space-y-4">
                       <div className="flex items-center gap-3">
                          <FileText size={18} className="text-black" />
                          <h4 className="text-sm font-black uppercase font-display text-black">Resume / CV</h4>
                       </div>
                       <button 
                         onClick={() => handleDownload(selectedApp.resume, `${selectedApp.name.replace(/\s+/g, '_')}_Resume.pdf`)}
                         className="w-full flex items-center justify-between p-6 border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all group"
                       >
                         <span className="text-[10px] font-bold font-mono uppercase tracking-widest">Download Resume File</span>
                         <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </button>
                    </section>

                    <section className="space-y-4">
                       <div className="flex items-center gap-3">
                          <ExternalLink size={18} className="text-black" />
                          <h4 className="text-sm font-black uppercase font-display text-black">Technical Dossier</h4>
                       </div>
                       <a 
                         href={selectedApp.portfolio} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center justify-between p-6 bg-surface-container-low text-secondary rounded-2xl hover:bg-black hover:text-white transition-all group border border-outline-variant/30"
                       >
                         <span className="text-[10px] font-bold font-mono uppercase tracking-widest">{selectedApp.portfolio}</span>
                         <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </a>
                    </section>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="p-8 bg-white border border-outline-variant rounded-3xl space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Contact Vector</label>
                           <p className="text-[11px] font-bold text-black uppercase font-mono break-all">{selectedApp.email}</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Current Status</label>
                           <div className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-mono text-center ${getStatusColor(selectedApp.status)}`}>
                              {selectedApp.status}
                           </div>
                        </div>

                        <div className="pt-6 border-t border-surface-container-low space-y-3">
                           <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono block mb-4">Execute Action</label>
                           <button 
                             onClick={() => handleUpdateStatus(selectedApp._id, 'shortlisted')}
                             disabled={isUpdating}
                             className="w-full py-3 bg-green-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest font-mono hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <CheckCircle2 size={14} /> Shortlist
                           </button>
                           <button 
                             onClick={() => handleUpdateStatus(selectedApp._id, 'reviewed')}
                             disabled={isUpdating}
                             className="w-full py-3 bg-blue-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest font-mono hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <Search size={14} /> Mark Reviewed
                           </button>
                           <button 
                             onClick={() => handleUpdateStatus(selectedApp._id, 'rejected')}
                             disabled={isUpdating}
                             className="w-full py-3 bg-red-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest font-mono hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <XCircle size={14} /> Reject
                           </button>
                           <button 
                             onClick={() => handleDelete(selectedApp._id)}
                             disabled={isUpdating}
                             className="w-full py-3 bg-surface-container-low text-secondary rounded-xl text-[9px] font-bold uppercase tracking-widest font-mono hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                           >
                              <Trash2 size={14} /> Purge Application
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationManager;
