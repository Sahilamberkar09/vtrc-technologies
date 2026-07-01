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
  Cpu,
  Zap,
  Fingerprint,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import logo from "/VTRCLogo.png"

/* ── Animated dot-grid backdrop ──────────────────────── */
const HeroBg = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 20%, #000 100%)",
      }}
    />
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.07, 0.14, 0.07] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
      style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
    />
  </div>
));
HeroBg.displayName = "HeroBg";

/* ── Animation variants ──────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};

/* ── Reusable input field ─────────────────────────────── */
const InputField = ({ label, icon: Icon, rightEl, ...props }) => (
  <motion.div variants={fadeUp} className="space-y-1.5 group">
    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-mono group-focus-within:text-black transition-colors duration-200">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-black transition-colors duration-200">
        <Icon size={16} strokeWidth={2} />
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-11 py-4 bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all duration-200 text-sm font-semibold placeholder:text-slate-300 placeholder:font-normal"
      />
      {rightEl && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1">
          {rightEl}
        </div>
      )}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════ */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    } catch (error) {
      setErr(
        error.response?.data?.message || "Incorrect email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-black overflow-hidden font-body select-none">

      {/* ══ HERO — 42% of viewport ════════════════════════ */}
      <div className="relative flex-none" style={{ height: "42%" }}>
        <HeroBg />

        {/* Brand bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-between px-6 pt-10"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <img src={logo} alt="Logo" className="w-6 h-6" />
            </div>
            <span className="text-white text-base font-black tracking-tight uppercase font-display">
              VTRC
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white/50 font-mono uppercase tracking-widest">
              Online
            </span>
          </div>
        </motion.div>

        {/* Hero center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center gap-4"
          style={{ height: "calc(100% - 64px)" }}
        >
          {/* Icon card */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-white/15 rounded-full scale-150" />
            <div className="relative w-18 h-18 w-[72px] h-[72px] bg-white/8 border border-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <Fingerprint size={34} className="text-white/85" strokeWidth={1.2} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12">
              <Zap size={10} className="text-white/50" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                Admin Panel
              </span>
            </div>
            <h1 className="text-4xl font-black mt-2 tracking-tight font-display uppercase leading-[0.9] text-white">
              Welcome Back
            </h1>
          </div>
        </motion.div>
      </div>

      {/* ══ FORM SHEET — natural flow, no justify-between ═ */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 220, delay: 0.05 }}
        className="flex-1 bg-white rounded-t-[2rem] flex flex-col overflow-hidden"
        style={{ boxShadow: "0 -24px 60px rgba(0,0,0,0.35)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Scrollable inner — natural spacing, CTA pushes with mt-auto */}
        <div className="flex-1 flex flex-col px-7 pt-6 pb-7 min-h-0 overflow-hidden">

          {/* Sheet header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-black tracking-tight text-black font-display uppercase">
              Sign In
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              Enter your details to access your account
            </p>
          </motion.div>

          {/* Fields */}
          <motion.form
            id="login-form"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <InputField
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-black transition-colors rounded-xl"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Error banner */}
            <AnimatePresence>
              {err && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl"
                >
                  <Terminal size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <span className="text-xs font-medium text-red-600 leading-relaxed">
                    {err}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* CTA — pushed to bottom with mt-auto */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-auto pt-5 space-y-4"
          >
            <button
              type="submit"
              form="login-form"
              disabled={loading}
              className="relative w-full py-4 bg-black text-white rounded-2xl overflow-hidden group disabled:opacity-40 active:scale-[0.97] transition-transform duration-150"
            >
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative flex items-center justify-center gap-2.5 text-sm font-bold tracking-wide">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-sm text-slate-400 font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-black font-bold underline underline-offset-4 decoration-slate-300 hover:decoration-black transition-all"
              >
                Sign up
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-slate-300">
              <ShieldCheck size={12} strokeWidth={2} />
              Secured by VTRC · v2.4
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
