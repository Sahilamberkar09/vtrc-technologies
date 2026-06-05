import React from "react";
import { X, AlertCircle, CheckCircle, Info, HelpCircle, Terminal, Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, message, type = "info", onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    const icons = {
        info: <Info className="text-black" size={20} />,
        success: <CheckCircle className="text-black" size={20} />,
        warning: <AlertTriangle className="text-black" size={20} />,
        error: <AlertCircle className="text-red-600" size={20} />,
        confirm: <HelpCircle className="text-black" size={20} />,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-outline-variant/30"
                    >
                        <div className="p-8 border-b border-surface-container-low bg-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-surface-container-low text-black rounded-xl border border-outline-variant/20">
                                   {icons[type]}
                                </div>
                                <h3 className="text-xl font-black font-display uppercase tracking-tight text-black">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-surface-container-low rounded-xl transition-all"
                            >
                                <X size={20} className="text-outline-variant" />
                            </button>
                        </div>

                        <div className="p-10 bg-surface-container-low/30">
                            <p className="text-sm font-bold text-secondary leading-relaxed uppercase font-mono tracking-widest">{message}</p>
                        </div>

                        <div className="p-8 bg-white border-t border-surface-container-low flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="btn-outline px-6 py-3"
                            >
                                {type === "confirm" ? cancelText : "Close"}
                            </button>
                            {type === "confirm" && (
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="btn-primary px-6 py-3 shadow-lg shadow-black/10"
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
