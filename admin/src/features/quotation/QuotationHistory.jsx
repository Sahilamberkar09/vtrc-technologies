import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  History,
  Trash2,
  Pencil,
  Eye,
  X,
  IndianRupee,
  Calendar,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Shield,
  Terminal,
  ArrowRight,
  Cpu,
  Download,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { userDataContext } from "../../context/UserContext";
import Quotation from "./Quotation";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-black text-white",
};

const QuotationHistory = () => {
  const { serverUrl } = useContext(userDataContext);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [toast, setToast] = useState(null);
  const [editLoading, setEditLoading] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${serverUrl}/api/quotations`, {
        withCredentials: true,
      });
      setQuotations(res.data.data);
    } catch (err) {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/quotations/${deleteId}`, {
        withCredentials: true,
      });
      setQuotations((prev) => prev.filter((q) => q._id !== deleteId));
      showToast("success", "Record deleted successfully.");
    } catch {
      showToast("error", "Failed to delete record.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusToggle = async (q) => {
    const newStatus = q.status === "draft" ? "sent" : "draft";
    try {
      await axios.put(
        `${serverUrl}/api/quotations/${q._id}`,
        { ...q, status: newStatus },
        { withCredentials: true },
      );
      setQuotations((prev) =>
        prev.map((item) =>
          item._id === q._id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch {
      showToast("error", "Update failed.");
    }
  };

  const fetchFullAndEdit = async (id) => {
    setEditLoading(id);
    try {
      const res = await axios.get(`${serverUrl}/api/quotations/${id}`, {
        withCredentials: true,
      });
      setEditingQuotation(res.data.data);
    } catch {
      showToast("error", "Failed to initialize editor.");
    } finally {
      setEditLoading(null);
    }
  };

  if (editingQuotation) {
    return (
      <div className="flex flex-col h-full bg-[#faf9f9]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-white border-b border-slate-100 h-24">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setEditingQuotation(null);
                fetchQuotations();
              }}
              className="flex items-center gap-3 text-[10px] font-bold text-slate-500 hover:text-black border border-slate-200 hover:border-black px-5 py-2.5 rounded-lg transition-all uppercase tracking-widest font-mono"
            >
              <X size={14} /> Exit Editor
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Modification</span>
              <span className="text-xs font-black text-black font-display uppercase tracking-widest truncate max-w-[200px]">
                {editingQuotation.quotationNo}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Quotation
            editData={editingQuotation}
            onSaved={() => {
              fetchQuotations();
              showToast("success", "Changes saved.");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 selection:bg-black/10 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-8 border border-slate-100 rounded-2xl gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <History size={20} className="text-slate-400" />
              <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                History
              </h2>
           </div>
           <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
             {quotations.length.toString().padStart(2, '0')} Records Found
           </p>
        </div>
        <button
          onClick={fetchQuotations}
          className="px-6 py-3.5 bg-slate-50 text-slate-600 hover:text-black hover:bg-slate-100 transition-all flex items-center gap-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest font-mono"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh History
        </button>
      </div>

      {/* States */}
      {error && !loading && (
        <div className="flex items-center gap-4 p-6 bg-red-50 text-red-700 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest border border-red-100">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && quotations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-slate-200 rounded-2xl">
          <FileText size={48} className="mb-6 text-slate-100" />
          <h3 className="text-xl font-black text-black uppercase font-display tracking-tight">No Records</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400 mt-2">
            No history detected yet.
          </p>
        </div>
      )}

      {!loading && quotations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quotations.map((q, idx) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-slate-200 rounded-2xl hover:border-black transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="p-8 flex flex-col gap-8 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest truncate">
                      {q.quotationNo}
                    </p>
                    <p className="text-lg font-black text-black uppercase font-display truncate">
                      {q.clientName || "Unknown"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(q)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest font-mono transition-all ${statusColors[q.status]}`}
                  >
                    {q.status}
                  </button>
                </div>

                <div className="space-y-3 py-2">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Briefcase size={14} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest font-mono truncate">
                      {q.projectType || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar size={14} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
                      {q.date || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-auto">
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest">Total</span>
                  <p className="text-2xl font-black text-black font-display tracking-tight">
                    ₹{(q.totalValue || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 flex divide-x divide-slate-100 bg-slate-50">
                <button
                  onClick={() => setViewingQuotation(q)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold text-slate-600 hover:bg-black hover:text-white transition-all uppercase tracking-widest font-mono"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => fetchFullAndEdit(q._id)}
                  disabled={editLoading === q._id}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold text-slate-600 hover:bg-black hover:text-white transition-all uppercase tracking-widest font-mono disabled:opacity-20"
                >
                  {editLoading === q._id ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Pencil size={14} />
                  )}
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(q._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold text-red-400 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest font-mono"
                >
                  <Trash2 size={14} /> Purge
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Slide-over */}
      <AnimatePresence>
        {viewingQuotation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-2xl h-full bg-white flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between h-24">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Detail View</p>
                  <h3 className="text-xl font-black font-display uppercase tracking-widest truncate max-w-[400px]">
                    {viewingQuotation.quotationNo}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingQuotation(null)}
                  className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Client</span>
                          <p className="text-lg font-black text-black uppercase font-display leading-tight">{viewingQuotation.clientName}</p>
                          <p className="text-[10px] font-bold font-mono text-slate-400 truncate">{viewingQuotation.clientEmail}</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Project Type</span>
                          <p className="text-lg font-black text-black uppercase font-display leading-tight">{viewingQuotation.projectType}</p>
                       </div>
                    </div>
                    <div className="p-8 bg-black text-white rounded-2xl space-y-6 flex flex-col justify-center">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 font-mono block">Total Valuation</span>
                       <div className="space-y-1">
                          <p className="text-4xl font-black font-display tracking-tight">₹{(viewingQuotation.totalValue || 0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-white/40">Synced Data</p>
                       </div>
                    </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <Cpu size={18} className="text-slate-400" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest font-mono">Breakdown</h4>
                   </div>
                   <div className="space-y-2">
                      {viewingQuotation.investment?.map((inv, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                           <span className="text-xs font-black text-slate-600 uppercase font-display tracking-tight">{inv.item}</span>
                           <span className="text-[10px] font-black font-mono px-3 py-1 bg-white rounded-lg">
                              {inv.type === "included" ? "Included" : `₹${Number(inv.price).toLocaleString()}`}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>

                {viewingQuotation.executiveSummary && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <Terminal size={18} className="text-slate-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest font-mono">Summary</h4>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-black pl-6 py-2">
                      "{viewingQuotation.executiveSummary}"
                    </p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => {
                    const id = viewingQuotation._id;
                    setViewingQuotation(null);
                    fetchFullAndEdit(id);
                  }}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest font-mono rounded-xl hover:bg-slate-800 transition-all"
                >
                  <Pencil size={14} /> Edit Record
                </button>
                <button
                  onClick={() => setViewingQuotation(null)}
                  className="px-8 py-4 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all text-[10px] font-bold uppercase tracking-widest font-mono"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                  Delete Record?
                </h3>
                <p className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-widest leading-relaxed">
                  This action is permanent and cannot be undone.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 border border-slate-200 rounded-xl text-slate-500 font-bold font-mono text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-600 text-white font-bold font-mono text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all rounded-xl"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* System Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest ${
              toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuotationHistory;

