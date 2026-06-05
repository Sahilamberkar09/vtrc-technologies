import React, { useState, useEffect, useContext } from "react";
import { 
  User, 
  Shield, 
  Key, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  RefreshCw,
  Mail,
  Fingerprint,
  Lock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import { motion } from "framer-motion";

const AdminProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CORE_OPERATOR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { serverUrl, user: currentUser } = useContext(userDataContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setRole(response.data.user.role === 'superadmin' ? "Super Architect" : "Core Operator");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [serverUrl]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match. Security verification failed.");
      return;
    }

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const response = await axios.put(
        `${serverUrl}/api/auth/profile`,
        payload,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setSuccess("Profile settings synchronized successfully.");
        setPassword("");
        setConfirmPassword("");
        setName(response.data.user.name);
        setEmail(response.data.user.email);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile settings.");
    }
  };

  const handleRevert = () => {
    setLoading(true);
    setSuccess("");
    setError("");
    axios
      .get(`${serverUrl}/api/auth/profile`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setPassword("");
          setConfirmPassword("");
        }
      })
      .catch((err) => setError("Signal lost. Revert failed."))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">Retrieving Credentials...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 selection:bg-black/10 font-body pb-20 items-start">
      {/* Profile ID Card */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-outline-variant rounded-3xl p-10 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="w-32 h-32 bg-surface-container-low border border-outline-variant/30 rounded-3xl mb-8 flex items-center justify-center text-outline-variant relative z-10 transition-transform duration-500 group-hover:scale-105">
            <User size={64} strokeWidth={1} />
            <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-xl shadow-lg">
               <Shield size={16} />
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-black mb-2 z-10 font-display uppercase">
            {name}
          </h2>
          <div className="text-[10px] font-bold text-secondary bg-surface-container-low px-5 py-2 rounded-lg mb-10 z-10 font-mono tracking-widest uppercase border border-outline-variant/20">
            {role}
          </div>

          <div className="w-full text-left bg-surface-container-low/50 p-8 rounded-2xl border border-outline-variant/30 space-y-8">
            <div className="space-y-4">
                <div className="text-[9px] font-black text-secondary uppercase tracking-widest font-mono flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Clearance Level
                </div>
                <div className="flex gap-2">
                  <ShieldCheck size={20} className="text-black" />
                  <ShieldCheck size={20} className="text-black" />
                  <ShieldCheck size={20} className="text-black" />
                  <div className="w-5 h-5 border border-outline-variant rounded-md"></div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-[9px] font-black text-secondary uppercase tracking-widest font-mono flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Operator ID
                </div>
                <div className="font-mono text-[11px] text-black font-bold bg-white px-4 py-3 border border-outline-variant rounded-xl flex items-center gap-3">
                  <Fingerprint size={14} className="text-outline-variant" />
                  VTRC-OP-{currentUser?._id.substring(currentUser._id.length - 8).toUpperCase()}
                </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-1.5">
             <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-surface-container-dim rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-surface-container rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="lg:col-span-8">
        <div className="bg-white border border-outline-variant rounded-3xl p-12">
           <div className="flex items-center justify-between border-b border-surface-container-low pb-8 mb-10">
              <div className="flex items-center gap-4">
                 <Terminal size={24} className="text-secondary" />
                 <h3 className="text-3xl font-black text-black uppercase font-display tracking-tight">
                  Credential Config
                </h3>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl text-secondary border border-outline-variant/30">
                 <Cpu size={20} />
              </div>
           </div>

          {error && (
            <div className="mb-10 p-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-4 border border-red-100">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-10 p-5 bg-black text-white rounded-2xl text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-black rounded-2xl outline-none transition-all text-xs font-bold uppercase font-display"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Channel Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-black rounded-2xl outline-none transition-all text-xs font-bold font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">New Passcode</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                    <input
                      type="password"
                      placeholder="ENTER NEW SECURITY MATRIX (OPTIONAL)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-black rounded-2xl outline-none transition-all text-xs font-bold font-mono placeholder:text-outline-variant"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-secondary font-mono">Confirm Passcode</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
                    <input
                      type="password"
                      placeholder="RE-ENTER SECURITY MATRIX"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-surface-container-low border border-transparent focus:border-black rounded-2xl outline-none transition-all text-xs font-bold font-mono placeholder:text-outline-variant"
                    />
                  </div>
                </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleRevert}
                className="btn-outline flex-1"
              >
                <RefreshCw size={16} /> Revert Changes
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 shadow-xl shadow-black/10"
              >
                <Database size={16} /> Save Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
