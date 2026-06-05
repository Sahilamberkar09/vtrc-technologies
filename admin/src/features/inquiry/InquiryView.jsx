import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import {
  Mail,
  Phone,
  User,
  MessageCircle,
  Calendar,
  Loader2,
  Trash2,
  Tag,
  Terminal,
  Shield,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_BADGE_STYLES = {
  "MVP Build": "bg-black text-white",
  Growth: "bg-black text-white",
  Dedicated: "bg-black text-white",
  General: "bg-surface-container-low text-secondary",
};

const FILTER_TABS = ["All", "MVP Build", "Growth", "Dedicated", "General"];

const InquiryView = () => {
  const { serverUrl } = useContext(userDataContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
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
      const response = await axios.get(`${serverUrl}/api/inquiries`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setInquiries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${serverUrl}/api/inquiries/${id}`, {
        withCredentials: true,
      });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      showToast("Inquiry deleted successfully");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      showToast("Failed to delete inquiry", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  const filteredInquiries =
    activeFilter === "All"
      ? inquiries
      : inquiries.filter((inq) => {
          const plan = inq.selectedPlan || "General";
          return plan === activeFilter;
        });

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
              <Shield size={20} className="text-secondary" />
              <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight">Lead Archive</h2>
           </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            Manage inbound client communications.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="px-6 py-3.5 bg-surface-container-low text-secondary hover:text-black hover:bg-white transition-all border border-outline-variant rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest font-mono"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh Archive
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {FILTER_TABS.map((tab) => {
          const count =
            tab === "All"
              ? inquiries.length
              : inquiries.filter((inq) => (inq.selectedPlan || "General") === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2.5 rounded-xl border transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-widest ${
                activeFilter === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-secondary border-outline-variant hover:border-black hover:text-black"
              }`}
            >
              {tab} · {count.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Loading Inquiries...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredInquiries.map((inquiry, idx) => {
            const planName = inquiry.selectedPlan || "General";
            const badgeClass = PLAN_BADGE_STYLES[planName] || PLAN_BADGE_STYLES["General"];

            return (
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
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono ${badgeClass}`}>
                            {planName}
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
                        <Mail size={14} /> Send Email
                      </a>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="px-4 py-2 bg-surface-container-low text-secondary rounded-xl hover:bg-black hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border border-outline-variant"
                      >
                        <Phone size={14} /> Call
                      </a>
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        disabled={deletingId === inquiry._id}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border border-red-100 disabled:opacity-20"
                      >
                        {deletingId === inquiry._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono block mb-2">
                        Email Address
                      </span>
                      <p className="text-xs font-black text-black uppercase font-display truncate">
                        {inquiry.email}
                      </p>
                    </div>
                    <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono block mb-2">
                        Phone Number
                      </span>
                      <p className="text-xs font-black text-black uppercase font-display">
                        {inquiry.phone}
                      </p>
                    </div>
                    <div className="p-6 bg-black text-white rounded-2xl">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 font-mono block mb-2">
                        Status
                      </span>
                      <p className="text-[10px] font-black uppercase tracking-widest font-mono">
                        {inquiry.status || "UNREAD"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-8 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono mb-4 flex items-center gap-3">
                      <MessageCircle size={14} /> Message Details
                    </span>
                    <p className="text-lg font-bold text-black uppercase font-display leading-tight italic">
                      "{inquiry.message}"
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 px-8 py-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-secondary">
                    ID: {inquiry._id.toUpperCase()}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-surface-container rounded-full"></div>
                    <div className="w-1 h-1 bg-surface-container rounded-full"></div>
                    <div className="w-1 h-1 bg-surface-container rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredInquiries.length === 0 && (
            <div className="border border-dashed border-outline-variant py-32 text-center rounded-3xl bg-white">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <Terminal size={28} />
              </div>
              <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                No Leads
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary mt-2">
                Waiting for new inquiries.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InquiryView;
