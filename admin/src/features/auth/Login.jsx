import React, { useContext, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";

const BackgroundLayers = memo(() => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#faf9f9]"></div>
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#000_1px,_transparent_1px)] bg-[length:32px_32px]"></div>
    </div>
  </div>
));

BackgroundLayers.displayName = "BackgroundLayers";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl, setIsAuthenticated, setUser } = useContext(userDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErr(error.response.data.message || "Invalid credentials");
      } else {
        setErr("Authentication failed.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf9f9] relative selection:bg-black/10 font-body overflow-hidden p-4 sm:p-6 md:p-8">
      <BackgroundLayers />

      <div className="relative z-10 w-full max-w-5xl h-full max-h-[700px] flex flex-col lg:flex-row bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
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
              <Cpu size={14} /> Control System
            </div>
            <h1 className="text-6xl font-black tracking-tight font-display uppercase leading-[0.9]">
              Command<br />Center
            </h1>
            <p className="text-lg text-white/50 font-body leading-relaxed max-w-sm">
              Authorize to oversee architecture, manage nodes, and configure systemic variables with total precision.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-white/20 font-mono">
            <Activity size={14} /> Global Axis v2.4
          </div>
        </div>

        {/* RIGHT SIDE: Registration Form */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[340px]"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tighter text-black font-display uppercase leading-tight">
                Welcome Base
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest opacity-70">
                Enter credentials to re-initialize session.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors">
                    Administrative Email
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
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs font-bold font-mono placeholder:text-slate-200 uppercase tracking-tight"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors">
                      Security Matrix
                    </label>
                  </div>
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
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent focus:border-black rounded-xl outline-none transition-all text-xs tracking-widest placeholder:text-slate-200"
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

              <div className="space-y-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  {loading ? "Authenticating..." : "Initialize Session"}
                  {!loading && <ArrowRight size={16} />}
                </button>
                
                <div className="text-center">
                  <Link to="/signup" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-all font-mono">
                    Architect New Node · <span className="text-black">Register</span>
                  </Link>
                </div>
              </div>
            </form>

            <div className="mt-20 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-200 font-mono">
               <ShieldCheck size={14} /> Secure Access Protocol
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
