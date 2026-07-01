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
  ChevronDown,
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
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
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

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      const response = await axios.patch(
        `${serverUrl}/api/inquiries/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === id ? { ...inq, status: newStatus } : inq
          )
        );
        showToast("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingStatusId(null);
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
              <h2 className="text-xl font-bold text-black">Inquiries</h2>
           </div>
          <p className="text-sm text-slate-400 mt-1">
            All incoming client inquiries in one place.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="px-5 py-3 bg-slate-50 text-slate-600 hover:text-black hover:bg-white transition-all border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-semibold"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
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
              className={`px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-semibold ${
                activeFilter === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black"
              }`}
            >
              {tab} · {count.toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {loading ? (
          <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Loading inquiries...</p>
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
                          <h3 className="text-lg font-bold text-black">
                            {inquiry.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}>
                            {planName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={12} />
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:self-start">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all text-sm font-semibold flex items-center gap-2 border border-slate-200"
                      >
                        <Mail size={14} /> Email
                      </a>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all text-sm font-semibold flex items-center gap-2 border border-slate-200"
                      >
                        <Phone size={14} /> Call
                      </a>
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        disabled={deletingId === inquiry._id}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all text-sm font-semibold flex items-center gap-2 border border-red-100 disabled:opacity-20"
                      >
                        {deletingId === inquiry._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                      <span className="text-xs font-semibold text-slate-500 block mb-1">
                        Email
                      </span>
                      <p className="text-sm font-semibold text-black truncate">
                        {inquiry.email}
                      </p>
                    </div>
                    <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                      <span className="text-xs font-semibold text-slate-500 block mb-1">
                        Phone
                      </span>
                      <p className="text-sm font-semibold text-black">
                        {inquiry.phone}
                      </p>
                    </div>
                    <div className="p-6 bg-black text-white rounded-2xl relative">
                       <span className="text-xs font-semibold text-white/60 block mb-2">
                         Status
                        </span>
                        <div className="relative">
                          {updatingStatusId === inquiry._id ? (
                            <div className="flex items-center gap-2 text-sm font-semibold text-white py-2">
                              <Loader2 size={14} className="animate-spin" /> Updating...
                            </div>
                          ) : (
                            <>
                              <select
                                value={inquiry.status || "unread"}
                                onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                                className="w-full appearance-none bg-white/10 text-white text-sm font-semibold rounded-xl px-4 py-2 border border-white/20 focus:outline-none focus:border-white/50 cursor-pointer capitalize"
                              >
                                <option value="unread" className="text-black">Unread</option>
                                <option value="read" className="text-black">Read</option>
                                <option value="contacted" className="text-black">Contacted</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60" />
                            </>
                          )}
                        </div>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                    <span className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
                      <MessageCircle size={14} /> Message
                    </span>
                    <p className="text-base font-medium text-slate-800 leading-relaxed italic">
                      "{inquiry.message}"
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {inquiry._id.slice(-8).toUpperCase()}
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
            <div className="border border-dashed border-slate-200 py-24 text-center rounded-3xl bg-white">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Terminal size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No Inquiries Yet
              </h3>
              <p className="text-sm text-slate-400 mt-1">
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
