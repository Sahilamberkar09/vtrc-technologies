import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Activity
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import { useContext } from "react";

const BackgroundLayers = memo(() => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#faf9f9]"></div>
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#000_1px,_transparent_1px)] bg-[length:32px_32px]"></div>
    </div>
  </div>
));

BackgroundLayers.displayName = "BackgroundLayers";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(userDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErr(error.response.data.message || "Registration failed.");
      } else {
        setErr("Structural error during node initialization.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf9f9] relative selection:bg-black/10 font-body overflow-hidden p-4 sm:p-6 md:p-8">
      <BackgroundLayers />

      <div className="relative z-10 w-full max-w-5xl h-full max-h-[850px] flex flex-col lg:flex-row bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
        {/* LEFT SIDE: Branding Statement */}
        <div className="hidden lg:flex flex-col relative w-[45%] p-20 justify-between bg-black text-white">
           <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-2xl font-black tracking-tighter flex items-center gap-3 font-display uppercase">
              VTRC
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60 font-mono">
              <Cpu size={14} /> Node Registry
            </div>
            <h1 className="text-6xl font-black tracking-tight font-display uppercase leading-[0.9]">
              Architect<br />Access
            </h1>
            <p className="text-lg text-white/50 font-body leading-relaxed max-w-sm">
              Initialize your administrative node to join the core operational axis and manage digital monuments.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-white/20 font-mono">
            <Activity size={14} /> Protocol Initialization
          </div>
        </div>

        {/* RIGHT SIDE: Registration Form */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[340px]"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tighter text-black font-display uppercase leading-tight">
                New Operator
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest opacity-70">
                Complete registration to initialize node.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Name Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors">
                    Operator Identity
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs font-bold font-mono placeholder:text-slate-200 uppercase tracking-tight"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors">
                    Channel Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      placeholder="operator@vtrc.tech"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs font-bold font-mono placeholder:text-slate-200 uppercase tracking-tight"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors">
                    Security Matrix
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs tracking-widest placeholder:text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center text-slate-300 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {err && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest font-mono border border-red-100"
                >
                  <Terminal size={14} />
                  <span>{err}</span>
                </motion.div>
              )}

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  {loading ? "Registering..." : "Initialize Node"}
                  {!loading && <ArrowRight size={16} />}
                </button>
                
                <div className="text-center">
                  <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-all font-mono">
                    Already an Operator? · <span className="text-black">Sign In</span>
                  </Link>
                </div>
              </div>
            </form>

            <div className="mt-16 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-200 font-mono">
               <ShieldCheck size={14} /> Encrypted Node Entry
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
