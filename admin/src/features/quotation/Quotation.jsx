import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Download,
  Plus,
  Trash2,
  Building2,
  User,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Calendar,
  IndianRupee,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Save,
  Pencil,
  Terminal,
  Cpu,
  Layers,
  Shield,
  Activity,
  ArrowRight,
  ChevronRight,
  Database,
  X,
  PlusCircle,
} from "lucide-react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generateRandomQuotation = () => {
  return `VTRC-SPEC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const Quotation = ({ editData = null, onSaved = null }) => {
  const { serverUrl } = useContext(userDataContext);
  const [activeTab, setActiveTab] = useState("edit");
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    quotationNo: generateRandomQuotation(),
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    clientName: "Client Entity",
    clientAddress: "City, Country",
    clientEmail: "client@example.com",
    projectType: "Custom Development",
    executiveSummary:
      "A comprehensive digital solution tailored to your strategic objectives. This project focuses on high-performance architecture, seamless user experience, and scalable infrastructure.",
    deliverables: [
      {
        title: "System Architecture",
        description: "Core structural framework and backend logic layer.",
      },
      {
        title: "User Experience Design",
        description: "High-fidelity interfaces and interactive prototypes.",
      },
      {
        title: "Database Integration",
        description: "Centralized data management and optimization.",
      },
    ],
    roadmap: [
      { step: "01", label: "Discovery", duration: "1-2 Weeks" },
      { step: "02", label: "Design", duration: "2-3 Weeks" },
      { step: "03", label: "Development", duration: "4-6 Weeks" },
      { step: "04", label: "Launch", duration: "Final Phase" },
    ],
    investment: [
      {
        item: "Strategic Architecture Implementation",
        price: 25000,
        type: "fixed",
      },
      {
        item: "Cloud Infrastructure & Hosting",
        price: 5000,
        type: "fixed",
      },
      {
        item: "QA & Security Audit",
        price: 3500,
        type: "fixed",
      }
    ],
    totalValue: 25000,
    signatureImage: null,
    supportPlan: {
      name: "Maintenance & Support",
      subType: "Standard",
      price: 1500,
      unit: "/ Month",
      description:
        "Ongoing system stability, security updates, and priority technical assistance.",
    },
    milestones: [
      "50% Initial deposit to commence project.",
      "50% Final settlement prior to deployment.",
    ],
    terms: [
      "Maintenance starts upon project completion.",
      "Additional features will be quoted separately.",
      "Full ownership transfers upon final payment.",
    ],
  });

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
    }
  }, [editData]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editData?._id) {
        await axios.put(`${serverUrl}/api/quotations/${editData._id}`, formData, {
          withCredentials: true,
        });
        showToast("success", "Project specification updated successfully.");
      } else {
        await axios.post(`${serverUrl}/api/quotations`, formData, {
          withCredentials: true,
        });
        showToast("success", "Project specification initialized.");
      }
      if (onSaved) onSaved();
    } catch (err) {
      showToast("error", "An error occurred while saving the specification.");
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateQuotationNo = () => {
    setFormData((prev) => ({
      ...prev,
      quotationNo: generateRandomQuotation(),
    }));
  };

  // Removed usePDF hook for manual implementation
  const targetRef = useRef(null);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      setActiveTab("preview");

      // Wait for tab switch and DOM stability
      await new Promise(resolve => setTimeout(resolve, 800));

      const element = document.getElementById("quotation-print-area");
      if (!element) throw new Error("Print area not found");

      // Scroll to top of the container
      const container = element.parentElement;
      if (container) container.scrollTop = 0;
      window.scrollTo(0, 0);

      // Brief pause for scroll to finish
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false, // Changed to false for better CORS compatibility
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Use a wider window for initial capture to ensure layout is fully expanded
        onclone: (clonedDoc) => {
          const area = clonedDoc.getElementById("quotation-print-area");
          if (area) {
            area.style.position = "static";
            area.style.margin = "0";
            area.style.width = "210mm";
            area.style.visibility = "visible";
            area.style.display = "block";

            // Show PDF-only sections
            const pdfOnly = clonedDoc.querySelectorAll(".pdf-only");
            pdfOnly.forEach(el => {
              el.style.setProperty('display', 'block', 'important');
              el.style.visibility = 'visible';
            });
          }
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const filename = `VTRC_SPEC_${formData.clientName.replace(/\s+/g, "_")}_${formData.quotationNo}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("PDF Export failed:", error);
      // More reliable fallback: show alert then print
      alert("Preparing browser print fallback for high-fidelity export.");
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('download') === 'true' && activeTab === 'preview') {
      handleDownload();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData((prev) => {
      const updated = { ...prev, [arrayName]: newArray };
      if (arrayName === "investment") {
        const total = newArray.reduce(
          (acc, curr) => acc + (Number(curr.price) || 0),
          0,
        );
        updated.totalValue = total;
      }
      return updated;
    });
  };

  const addItem = (arrayName, emptyItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyItem],
    }));
  };

  const removeItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData((prev) => {
      const updated = { ...prev, [arrayName]: newArray };
      if (arrayName === "investment") {
        const total = newArray.reduce(
          (acc, curr) => acc + (Number(curr.price) || 0),
          0,
        );
        updated.totalValue = total;
      }
      return updated;
    });
  };

  const handleMilestoneChange = (index, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = value;
    setFormData((prev) => ({ ...prev, milestones: newMilestones }));
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...formData.terms];
    newTerms[index] = value;
    setFormData((prev) => ({ ...prev, terms: newTerms }));
  };

  const handleSupportChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      supportPlan: { ...prev.supportPlan, [field]: value },
    }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, signatureImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full selection:bg-black/10 font-body overflow-hidden">
      {/* Print-Only CSS to ensure perfect PDF generation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: A4; margin: 0 !important; }
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 210mm !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
          /* Hide all UI elements */
          .print-exclude, aside, header, nav, button { display: none !important; }
          
          /* Special handling for the quotation area to ensure it's visible even if nested */
          #quotation-print-area {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            z-index: 9999 !important;
            background: white !important;
            margin: 0 !important;
          }
          
          /* Hide ancestors' other children but keep ancestors themselves visible */
          body > div:not(#quotation-print-area) { visibility: hidden; }
          #quotation-print-area * { visibility: visible !important; }
          .pdf-only { display: block !important; visibility: visible !important; }
        }
      `}} />
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 bg-white border-b border-surface-container-low print-exclude">
        <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === "edit" ? "bg-black text-white" : "text-secondary hover:text-black"}`}
          >
            Configure
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === "preview" ? "bg-black text-white" : "text-secondary hover:text-black"}`}
          >
            Preview
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`btn-primary flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center gap-2 whitespace-nowrap ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? <RefreshCw className="animate-spin" size={16} /> : editData?._id ? <Pencil size={16} /> : <Save size={16} />}
            <span className="text-[10px] uppercase tracking-widest">{isSaving ? 'Saving...' : editData?._id ? 'Update Spec' : 'Save Spec'}</span>
          </button>
          {activeTab === "preview" && (
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className={`btn-outline flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center gap-2 shadow-xl shadow-black/5 whitespace-nowrap ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download size={16} />
              <span className="text-[10px] uppercase tracking-widest">{isExporting ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`fixed bottom-10 right-10 z-[200] flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl text-white text-[10px] font-bold uppercase tracking-widest ${toast.type === 'success' ? 'bg-black' : 'bg-red-600'
              }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {isExporting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-8 pointer-events-none print-exclude">
          <div className="flex flex-col items-center gap-6 p-12 bg-white rounded-3xl shadow-2xl max-w-md w-full border border-outline-variant pointer-events-auto">
            <RefreshCw className="animate-spin text-black" size={48} />
            <div className="text-center space-y-2">
              <p className="font-black text-black text-2xl uppercase font-display tracking-tight">Generating Document</p>
              <p className="text-secondary text-[10px] font-bold uppercase tracking-widest font-mono">Optimizing structural PDF specifications...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-8 bg-background">
        {activeTab === "edit" ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Info */}
            <section className="bg-white p-10 border border-outline-variant rounded-3xl shadow-sm">
              <div className="flex items-center gap-4 mb-8 border-b border-surface-container-low pb-6">
                <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                  Document Metadata
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Reference ID
                  </label>
                  <div className="relative">
                    <input
                      name="quotationNo"
                      value={formData.quotationNo}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono uppercase pr-14"
                    />
                    <button
                      onClick={regenerateQuotationNo}
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-outline-variant hover:text-black transition-all"
                      title="Regenerate"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Date Created
                  </label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </section>

            {/* Client Info */}
            <section className="bg-white p-10 border border-outline-variant rounded-3xl shadow-sm">
              <div className="flex items-center gap-4 mb-8 border-b border-surface-container-low pb-6">
                <div className="p-2.5 bg-black text-white rounded-xl">
                  <User size={20} />
                </div>
                <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                  Entity Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Client Name
                  </label>
                  <input
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-sm uppercase font-display"
                    placeholder="Enter entity name..."
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Billing Address
                  </label>
                  <textarea
                    name="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs uppercase font-mono resize-none"
                    placeholder="Physical location..."
                  ></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Communication Channel
                  </label>
                  <input
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">
                    Project Type
                  </label>
                  <input
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono uppercase"
                    placeholder="e.g. Mobile App Development"
                  />
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section className="bg-white p-10 border border-outline-variant rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-8 border-b border-surface-container-low pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-black text-white rounded-xl">
                    <Activity size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                    Project Roadmap
                  </h3>
                </div>
                <button
                  onClick={() =>
                    addItem("roadmap", {
                      step: String(formData.roadmap.length + 1).padStart(
                        2,
                        "0",
                      ),
                      label: "",
                      duration: "",
                    })
                  }
                  className="flex items-center gap-2 bg-surface-container-low text-secondary text-[9px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-black hover:text-white transition-all rounded-lg border border-outline-variant/30"
                >
                  <Plus size={14} /> Add Phase
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {formData.roadmap.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative p-6 bg-surface-container-low/30 border border-outline-variant/20 rounded-2xl text-center hover:border-black transition-all"
                  >
                    <button
                      onClick={() => removeItem(idx, "roadmap")}
                      className="absolute -top-2 -right-2 bg-white border border-outline-variant text-outline-variant p-1.5 rounded-lg shadow-sm hover:text-red-500 hover:border-red-100 transition-all z-10"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black mb-4 mx-auto font-mono">
                      {item.step}
                    </div>
                    <input
                      value={item.label}
                      onChange={(e) =>
                        handleArrayChange(
                          idx,
                          "label",
                          e.target.value,
                          "roadmap",
                        )
                      }
                      className="w-full bg-transparent text-[10px] font-bold text-black uppercase text-center outline-none mb-1 font-mono tracking-widest placeholder:text-outline-variant"
                      placeholder="Phase Name"
                    />
                    <input
                      value={item.duration}
                      onChange={(e) =>
                        handleArrayChange(
                          idx,
                          "duration",
                          e.target.value,
                          "roadmap",
                        )
                      }
                      className="w-full bg-transparent text-[11px] font-black text-secondary text-center outline-none font-display uppercase placeholder:text-outline-variant"
                      placeholder="Duration"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Investment Items */}
            <section className="bg-white p-10 border border-outline-variant rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-8 border-b border-surface-container-low pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-black text-white rounded-xl">
                    <Database size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                    Investment Table
                  </h3>
                </div>
                <button
                  onClick={() =>
                    addItem("investment", { item: "", price: 0, type: "fixed" })
                  }
                  className="flex items-center gap-2 bg-surface-container-low text-secondary text-[9px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-black hover:text-white transition-all rounded-lg border border-outline-variant/30"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="space-y-4">
                {formData.investment.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-5 bg-surface-container-low/30 border border-outline-variant/20 rounded-2xl group hover:border-black transition-all">
                    <div className="flex-1">
                      <input
                        value={item.item}
                        onChange={(e) =>
                          handleArrayChange(
                            idx,
                            "item",
                            e.target.value,
                            "investment",
                          )
                        }
                        className="w-full px-5 py-3 border border-transparent focus:border-black outline-none bg-white rounded-xl font-bold text-xs uppercase font-mono transition-all"
                        placeholder="Component name..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 relative">
                        <IndianRupee size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleArrayChange(
                              idx,
                              "price",
                              e.target.value,
                              "investment",
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 border border-transparent focus:border-black outline-none bg-white rounded-xl font-black text-xs font-mono transition-all"
                          placeholder="0"
                        />
                      </div>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleArrayChange(
                            idx,
                            "type",
                            e.target.value,
                            "investment",
                          )
                        }
                        className="w-32 px-4 py-3 border border-transparent focus:border-black outline-none bg-white rounded-xl font-bold text-[10px] uppercase font-mono cursor-pointer transition-all"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="included">Included</option>
                        <option value="optional">Optional</option>
                      </select>
                      <button
                        onClick={() => removeItem(idx, "investment")}
                        className="p-3 text-outline-variant hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-surface-container-low flex justify-between items-center px-6">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">Total Structural Value</span>
                <span className="text-3xl font-black text-black font-display">
                  ₹{formData.totalValue.toLocaleString("en-IN")}
                </span>
              </div>
            </section>

            {/* Support Plan */}
            <section className="bg-white p-10 border border-outline-variant rounded-3xl shadow-sm">
              <div className="flex items-center gap-4 mb-8 border-b border-surface-container-low pb-6">
                <div className="p-2.5 bg-black text-white rounded-xl">
                  <Shield size={20} />
                </div>
                <h3 className="text-2xl font-black text-black uppercase font-display tracking-tight">
                  Maintenance Protocol
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">Plan Name</label>
                      <input
                        value={formData.supportPlan.name}
                        onChange={(e) => handleSupportChange("name", e.target.value)}
                        className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs uppercase font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">Price</label>
                      <input
                        type="number"
                        value={formData.supportPlan.price}
                        onChange={(e) => handleSupportChange("price", e.target.value)}
                        className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">Unit</label>
                      <input
                        value={formData.supportPlan.unit}
                        onChange={(e) => handleSupportChange("unit", e.target.value)}
                        className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-secondary uppercase tracking-widest font-mono">Plan Description</label>
                    <textarea
                      value={formData.supportPlan.description}
                      onChange={(e) => handleSupportChange("description", e.target.value)}
                      className="w-full px-5 py-3.5 bg-surface-container-low border border-transparent focus:border-black rounded-xl outline-none transition-all font-bold text-xs font-mono uppercase resize-none h-24"
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            {/* Signature Upload Card */}
            <section className="px-8 pb-12">
              <div className="card-premium space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Authorized Signature</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold">Authentication Node</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Upload Signature Image</label>
                  <div className="flex items-center gap-6">
                    {formData.signatureImage ? (
                      <div className="relative group">
                        <img
                          src={formData.signatureImage}
                          alt="Signature Preview"
                          className="h-20 w-48 object-contain bg-slate-50 rounded-lg border border-slate-200"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, signatureImage: null }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="h-20 w-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-black/20 hover:bg-slate-50 transition-all">
                        <svg className="w-6 h-6 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest">Select Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleSignatureUpload} />
                      </label>
                    )}
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase font-mono">
                        Upload a transparent PNG signature for best results. This will be embedded in the final PDF specification at the legal section.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>


          </div>
        ) : (
          /* Preview Mode */
          <div
            id="quotation-print-area"
            className="w-[210mm] mx-auto bg-white overflow-hidden relative"
            ref={targetRef}
            style={{ minHeight: '297mm' }}
          >
            {/* Dedicated PDF Style Overrides */}
            <style dangerouslySetInnerHTML={{
              __html: `
              [data-pdf-content] {
                font-family: 'Geist', sans-serif !important;
                -webkit-print-color-adjust: exact;
                width: 210mm;
                margin: 0;
                background: white;
              }
              [data-pdf-content] h1, [data-pdf-content] h2, [data-pdf-content] h3, [data-pdf-content] h4 {
                font-family: 'Syne', sans-serif !important;
                letter-spacing: -0.02em;
              }
              [data-pdf-content] .font-mono {
                font-family: 'JetBrains Mono', monospace !important;
              }
              [data-pdf-content] section {
                page-break-inside: avoid;
                margin-bottom: 20px;
              }
              /* Force white background for capture */
              .bg-white { background-color: #ffffff !important; }
              .bg-black { background-color: #000000 !important; }
            `}} />

            <div data-pdf-content className="w-full bg-white">
              {/* PDF Header - Full Width & Bleed Top */}
              <div className="px-16 pt-12 pb-10 bg-black text-white relative w-full">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black tracking-tighter uppercase font-display">VTRC</span>
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-3xl font-black uppercase font-display tracking-tight leading-none">
                        Project<br />Specification
                      </h1>
                      <div className="h-0.5 w-12 bg-white/20"></div>
                    </div>
                  </div>
                  <div className="text-right pt-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-3 font-mono">Prepared For</p>
                    <h2 className="text-2xl font-black text-white uppercase font-display leading-none mb-2">{formData.clientName}</h2>
                    <p className="text-[9px] font-bold text-white/40 uppercase font-mono tracking-widest">{formData.clientProject}</p>
                  </div>
                </div>
              </div>

              {/* Entity Details Block */}
              <div className="p-12 border-b border-surface-container bg-surface-container-low/20">
                <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 font-mono">Issuing Agency</p>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-black uppercase font-display">VTRC Technologies</h3>
                      <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-tight">Strategic Architecture Unit</p>
                      <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-tight">VTRC.TECH / OPERATIONAL AXIS</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 font-mono">Client Entity</p>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-black uppercase font-display">{formData.clientName}</h3>
                      <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-tight">{formData.clientAddress}</p>
                      <p className="text-[10px] font-bold text-secondary uppercase font-mono tracking-tight">{formData.clientEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-12">
                {/* 01 Financial Allocation */}
                <section className="space-y-8 pt-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black border-b border-black pb-4 font-mono flex items-center gap-4">
                    <div className="w-2 h-2 bg-black rounded-full"></div> 01 Financial Allocation
                  </h3>
                  <div className="overflow-hidden border border-black rounded-2xl mx-12">
                    <table className="w-full border-collapse table-fixed">
                      <thead>
                        <tr className="bg-black text-white font-mono text-[9px] font-bold uppercase tracking-widest">
                          <th className="px-6 py-4 text-left w-2/3">Structural Component</th>
                          <th className="px-6 py-4 text-right w-1/3">Allocation</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs font-bold uppercase">
                        {formData.investment.map((item, idx) => (
                          <tr key={idx} className="border-b border-surface-container">
                            <td className="px-6 py-5 text-black truncate">{item.item}</td>
                            <td className="px-6 py-5 text-right text-black font-black">
                              {item.type === 'included' ? 'INCLUDED' : `₹${Number(item.price).toLocaleString('en-IN')}`}
                            </td>
                          </tr>
                        ))}
                        {/* Integrated Maintenance Row */}
                        <tr className="border-b border-surface-container bg-surface-container-low/20">
                          <td className="px-6 py-5">
                            <p className="text-black font-black">{formData.supportPlan.name}</p>
                            <p className="text-[9px] text-secondary lowercase font-mono">{formData.supportPlan.description}</p>
                          </td>
                          <td className="px-6 py-5 text-right text-black font-black">
                            ₹{formData.supportPlan.price}{formData.supportPlan.unit}
                          </td>
                        </tr>
                        <tr className="bg-surface-container-low">
                          <td className="px-6 py-6 font-black text-black">Total Initial Value</td>
                          <td className="px-6 py-6 text-right text-2xl font-black text-black font-display">₹{formData.totalValue.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Note Section */}
                  <div className="mx-12 mt-6 p-6 border-l-2 border-black bg-surface-container-low/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 font-mono">Note</p>
                    <p className="text-[11px] font-bold text-black font-mono leading-relaxed uppercase">
                      The above financial allocation is a comprehensive estimate based on initial strategic analysis. Final figures may be adjusted according to scope refinements.
                    </p>
                  </div>
                </section>


                {/* Terms & Conditions - PDF ONLY COMPACT */}
                <section className="pdf-only hidden space-y-8 pt-12 border-t border-surface-container">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-black uppercase font-display tracking-tight mb-2">Terms & Conditions</h2>
                    <p className="text-[9px] font-bold text-secondary uppercase font-mono tracking-[0.5em]">LEGAL GOVERNANCE PROTOCOL</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 text-[9px] font-bold text-secondary uppercase font-mono leading-relaxed max-w-3xl mx-auto">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-black font-black border-b border-black pb-2">01. INTELLECTUAL PROPERTY NODE</h4>
                        <p>ALL INTELLECTUAL PROPERTY RIGHTS, PATENTS, AND TRADE SECRETS RELATING TO THE DEVELOPED SOLUTION REMAIN THE EXCLUSIVE PROPERTY OF VTRC TECHNOLOGIES UNTIL ALL OUTSTANDING INVOICES ARE SETTLED IN FULL. UPON FINAL PAYMENT, A NON-EXCLUSIVE, PERPETUAL LICENSE IS GRANTED TO THE CLIENT ENTITY.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-black font-black border-b border-black pb-2">02. ESTIMATE VALIDITY AXIS</h4>
                        <p>THIS QUOTATION REPRESENTS A STRATEGIC ESTIMATE AND REMAINS VALID FOR A PERIOD OF 30 CALENDAR DAYS FROM THE DATE OF ISSUE. VTRC TECHNOLOGIES RESERVES THE RIGHT TO RENEGOTIATE TERMS IF COMMENCEMENT IS DELAYED BEYOND THIS WINDOW.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-black font-black border-b border-black pb-2">03. SCOPE DYNAMICS</h4>
                        <p>ANY MODIFICATIONS, ADDITIONS, OR REMOVALS FROM THE DEFINED PROJECT SCOPE AFTER THE INITIAL KICK-OFF WILL BE SUBJECT TO A CHANGE REQUEST PROTOCOL. THIS MAY RESULT IN ADJUSTMENTS TO BOTH THE FINANCIAL ALLOCATION AND THE PROJECT TIMELINE.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-black font-black border-b border-black pb-2">04. PAYMENT MILESTONES</h4>
                        <p>ENGAGEMENT REQUIRES A 50% INITIAL DEPOSIT TO INITIALIZE RESOURCE ALLOCATION. THE REMAINING 50% IS PAYABLE UPON PROJECT COMPLETION AND PRIOR TO FINAL DEPLOYMENT OR HANDOVER OF PRODUCTION ASSETS.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-black font-black border-b border-black pb-2">05. CONFIDENTIALITY PROTOCOL</h4>
                        <p>BOTH PARTIES AGREE TO MAINTAIN THE STRICTEST CONFIDENTIALITY REGARDING ALL PROPRIETARY INFORMATION, STRATEGIC DATA, AND INTERNAL WORKFLOWS SHARED DURING THE COURSE OF THIS ENGAGEMENT.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-24 flex justify-between items-end">
                    <div className="space-y-8">
                      <div className="relative">
                        {formData.signatureImage ? (
                          <img
                            src={formData.signatureImage}
                            alt="Signature"
                            className="h-16 w-48 object-contain absolute bottom-4 left-0"
                          />
                        ) : (
                          <div className="h-16 w-48"></div> // Spacer
                        )}
                        <div className="w-48 h-1 bg-black"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-black uppercase font-display">Authorized Signature</p>
                        <p className="text-[9px] font-bold text-secondary uppercase font-mono tracking-widest">VTRC TECHNOLOGIES CORE UNIT</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-outline-variant uppercase font-mono tracking-[0.5em]">DOCUMENT AUTHENTICATED</p>
                    </div>
                  </div>
                </section>

              </div>

              <div className="h-24 w-full bg-white"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotation;
