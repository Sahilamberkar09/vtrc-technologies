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
  Zap,
  ListTodo,
  Terminal,
  Cpu,
  ArrowRight,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_BADGE_STYLES = {
  "MVP Build": "bg-black text-white",
  Growth: "bg-black text-white",
  Dedicated: "bg-black text-white",
};

const FILTER_TABS = ["All Plans", "MVP Build", "Growth", "Dedicated"];

const PLAN_FEATURES = {
  "MVP Build": [
    "Custom Landing Page",
    "Core Features MVP",
    "Auth & Database Setup",
    "Responsive UI/UX",
    "1 Month Tech Support",
  ],
  Growth: [
    "Full Custom Web App",
    "Advanced APIs",
    "Admin Dashboard",
    "Payment Gateway",
    "3 Months Tech Support",
  ],
  Dedicated: [
    "Dedicated Dev Squad",
    "Cloud Architecture",
    "Complex Microservices",
    "Priority SLA Support",
    "DevOps Integration",
  ],
};

const PlanInquiryView = () => {
  const { serverUrl } = useContext(userDataContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Plans");
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
        const planOnly = response.data.data.filter(inq => inq.selectedPlan && inq.selectedPlan !== "General");
        setInquiries(planOnly);
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
      showToast("Inquiry removed from archive");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      showToast("Failed to remove inquiry", "error");
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
    activeFilter === "All Plans"
      ? inquiries
      : inquiries.filter((inq) => inq.selectedPlan === activeFilter);

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
              <Zap size={20} className="text-secondary" />
              <h2 className="text-2xl font-black text-black font-display uppercase tracking-tight">Strategic Leads</h2>
           </div>
          <p className="text-[10px] font-bold text-secondary font-mono uppercase tracking-widest">
            Manage inbound high-intent project inquiries.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="px-6 py-3.5 bg-surface-container-low text-secondary hover:text-black hover:bg-white transition-all border border-outline-variant rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest font-mono"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Sync Leads
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {FILTER_TABS.map((tab) => {
          const count =
            tab === "All Plans"
              ? inquiries.length
              : inquiries.filter((inq) => inq.selectedPlan === tab).length;
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
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Loading Acquisition Stream...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredInquiries.map((inquiry, idx) => {
            const planName = inquiry.selectedPlan;
            const badgeClass = PLAN_BADGE_STYLES[planName] || PLAN_BADGE_STYLES["MVP Build"];
            const features = PLAN_FEATURES[planName] || [];

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

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono block mb-3">
                          Contact Details
                        </span>
                        <div className="text-[11px] font-black text-black uppercase font-display space-y-3">
                          <p className="flex items-center gap-3">
                             <Mail size={14} className="text-outline-variant" /> {inquiry.email}
                          </p>
                          <p className="flex items-center gap-3">
                             <Phone size={14} className="text-outline-variant" /> {inquiry.phone}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-black text-white rounded-2xl">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 font-mono block mb-3">
                          Interested In
                        </span>
                        <p className="text-2xl font-black text-white uppercase font-display tracking-tight">
                          {planName}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-8 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant transition-all h-full">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono mb-4 flex items-center gap-3">
                        <MessageCircle size={14} /> Project Brief
                      </span>
                      <p className="text-lg font-bold text-black uppercase font-display leading-tight italic">
                        "{inquiry.message}"
                      </p>
                    </div>

                    <div className="lg:col-span-3 p-6 bg-surface-container-low rounded-2xl border border-transparent h-full">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono mb-4 flex items-center gap-3">
                        <ListTodo size={14} /> Plan Scope
                      </span>
                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <li key={i} className="text-[10px] font-bold text-black uppercase font-mono flex items-start gap-2">
                            <div className="w-1 h-1 bg-black rounded-full mt-1.5 shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 px-8 py-4 flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-secondary border-t border-outline-variant">
                  <span>ID: {inquiry._id.toUpperCase()}</span>
                  <div className="flex items-center gap-3">
                     <Shield size={12} className="text-outline-variant" />
                     <span className="text-black">Lead Verified</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredInquiries.length === 0 && (
            <div className="border border-dashed border-outline-variant py-32 text-center rounded-3xl bg-white">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">
                No Plan Leads
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary mt-2">
                Waiting for strategic project inquiries.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanInquiryView;
