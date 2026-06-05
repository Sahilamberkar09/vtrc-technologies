import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import {
  Mail,
  Building2,
  Calendar,
  Trash2,
  Terminal,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  DollarSign,
  FileText,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectInquiryView = () => {
  const { serverUrl } = useContext(userDataContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/inquiries/project`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setInquiries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching project inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project inquiry?")) return;
    try {
      await axios.delete(`${serverUrl}/api/inquiries/project/${id}`, {
        withCredentials: true,
      });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      showToast("Project inquiry purged");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      showToast("Failed to delete inquiry", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  return (
    <div className="space-y-8 pb-20 selection:bg-black/10 font-body">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-12 right-12 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest ${
              toast.type === "error" ? "bg-red-600 text-white" : "bg-black text-white"
            }`}
          >
            {toast.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 border border-outline-variant rounded-2xl gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <Terminal size={20} className="text-secondary" />
              <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight">Project Initializations</h2>
           </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            High-intent project intake dossiers.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="px-6 py-3.5 bg-surface-container-low text-secondary hover:text-black hover:bg-white transition-all border border-outline-variant rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest font-mono"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Sync Dossiers
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Decrypting Intake Stream...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {inquiries.map((inquiry, idx) => (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-outline-variant rounded-3xl overflow-hidden hover:border-black transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center font-black text-xl font-display text-secondary group-hover:bg-black group-hover:text-white transition-all shrink-0">
                      {inquiry.name[0].toUpperCase()}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                          {inquiry.name}
                        </h3>
                        <span className="px-3 py-1 bg-black text-white rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono">
                          {inquiry.organization}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
                        <Calendar size={12} />
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:self-start">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="px-4 py-2 bg-surface-container-low text-secondary rounded-xl hover:bg-black hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border border-outline-variant"
                    >
                      <Mail size={14} /> Contact
                    </a>
                    <button
                      onClick={() => handleDelete(inquiry._id)}
                      className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border border-red-100"
                    >
                      <Trash2 size={14} /> Purge
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Scope & Parameters */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono block mb-3">
                        <Layers size={12} className="inline mr-2" /> Scope of Work
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {inquiry.scope.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-white border border-outline-variant rounded text-[9px] font-bold uppercase font-mono">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-surface-container-low rounded-2xl">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono block mb-2">
                          <Clock size={12} className="inline mr-2" /> Timeline
                        </span>
                        <p className="text-xl font-black text-black font-display">{inquiry.timeline}</p>
                      </div>
                      <div className="p-6 bg-black text-white rounded-2xl">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 font-mono block mb-2">
                          <DollarSign size={12} className="inline mr-2" /> Budget
                        </span>
                        <p className="text-[10px] font-black uppercase tracking-widest font-mono leading-tight">{inquiry.budget}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Brief */}
                  <div className="lg:col-span-8 p-8 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all h-full">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono mb-4 flex items-center gap-3">
                      <MessageSquare size={14} /> Architectural Brief
                    </span>
                    <p className="text-[11px] font-bold text-black uppercase font-mono leading-loose tracking-widest italic">
                      "{inquiry.brief}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low/50 px-8 py-4 border-t border-outline-variant flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-secondary">
                <span>Dossier ID: {inquiry._id.toUpperCase()}</span>
                <div className="flex items-center gap-3">
                   <Shield size={12} className="text-outline-variant" />
                   <span className="text-black">Secured Channel</span>
                </div>
              </div>
            </motion.div>
          ))}

          {inquiries.length === 0 && !loading && (
            <div className="border border-dashed border-outline-variant py-32 text-center rounded-3xl bg-white">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <Terminal size={28} />
              </div>
              <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                No Intake Dossiers
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary mt-2">
                Waiting for new project initializations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectInquiryView;
