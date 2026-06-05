import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTerminal,
  FiLayers,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";
import LogoAnimation from "../../components/ui/LogoAnimation";

/* ── ASSETS ── */
import lionImg from "../../assets/Lion.jpg";

const Pillar = ({ title, subtitle, icon: Icon, delay }) => (
  <motion.div className="group relative p-1 border-l border-white/10 hover:border-white transition-colors">
    <div className="pl-8">
      <Icon
        className="text-white mb-6 opacity-30 group-hover:opacity-100 transition-opacity"
        size={28}
      />
      <h3
        className="text-2xl font-bold mb-2 tracking-tighter uppercase"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-white/40 group-hover:text-white/70 transition-colors leading-relaxed font-light">
        {subtitle}
      </p>
    </div>
  </motion.div>
);

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#000000] text-white selection:bg-white selection:text-black"
    >
      {/* ── 1. THE KINETIC HEADER ── */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        <motion.div
          style={{ x: xLeft }}
          className="absolute top-20 left-0 whitespace-nowrap opacity-[0.03] select-none pointer-events-none"
        >
          <span className="text-[15vw] font-black uppercase tracking-tighter">
            Architects of Code — Architects of Code —
          </span>
        </motion.div>

        <div className="z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-xs font-bold tracking-[1em] uppercase mb-6 block"
          >
            VTRC / Technical Manifesto
          </motion.span>
          <h1
            className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] uppercase italic"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Kill the <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/20">
              Ordinary.
            </span>
          </h1>
        </div>

        <motion.div
          style={{ x: xRight }}
          className="absolute bottom-20 right-0 whitespace-nowrap opacity-[0.03] select-none pointer-events-none"
        >
          <span className="text-[15vw] font-black uppercase tracking-tighter text-white">
            VTRC TECHNOLOGIES — VTRC TECHNOLOGIES —
          </span>
        </motion.div>
      </section>

      {/* ── 2. THE ENGINEERING PILLARS ── */}
      <section className="py-32 px-6 md:px-20 border-y border-white/05 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <Pillar
            icon={FiTerminal}
            title="Zero-Latency"
            subtitle="We optimize for the microsecond. Our codebases aren't just functional; they're surgically efficient."
            delay={0.1}
          />
          <Pillar
            icon={FiLayers}
            title="Brutalist Design"
            subtitle="Stripping away the noise. We build digital structures that are bold, functional, and unapologetic."
            delay={0.2}
          />
          <Pillar
            icon={FiActivity}
            title="Deep Logic"
            subtitle="Beyond CRUD apps. We engineer proprietary algorithms that solve actual business friction."
            delay={0.3}
          />
          <Pillar
            icon={FiGlobe}
            title="Borderless"
            subtitle="Infrastructure built for a planetary scale. High availability, anywhere on the grid."
            delay={0.4}
          />
        </div>
      </section>

      {/* ── 3. THE NARRATIVE (IMAGE & CONTENT) ── */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-white/20 to-white/5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/10">
              <LogoAnimation />
            </div>
            {/* Floating Tech Tag */}
            <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-xl hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                Status: Operational
              </p>
              <p className="text-2xl font-black mt-2">NYC / 40.7128° N</p>
            </div>
          </div>

          <div>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase mb-8 leading-none"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              The Anti-Agency <br />
              <span className="text-white/40">Philosophy.</span>
            </h2>
            <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed">
              <p>
                Most firms sell "digital transformation" as a buzzword. We treat
                it as a high-stakes engineering problem. VTRC was founded
                because the web got boring—cluttered with templates and
                slow-moving logic.
              </p>
              <p>
                We are a lean collective of elite technical architects. When you
                work with us, you aren't talking to account managers; you're
                talking to the people writing the kernels of your next
                ecosystem.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6 p-6 border border-white/05 rounded-2xl bg-white/02 backdrop-blur-sm">
              <img
                src={lionImg}
                alt="Founder"
                className="w-16 h-16 rounded-full object-cover border border-white/20"
              />
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest text-sm">
                  VTRC Founders
                </h4>
                <p className="text-white/40 text-xs italic">
                  "We build the tools we wish we had."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE VOID (FINAL CALL) ── */}
      <section className="py-40 px-6 relative overflow-hidden bg-white text-black">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.8]">
            Build <br /> The Void.
          </h2>
          <p className="text-xl font-bold mb-12 max-w-lg mx-auto uppercase tracking-tight">
            We are currently accepting high-impact partnerships for the next
            fiscal quarter.
          </p>
          <Link
            to="/contact-us"
            className="group relative inline-flex items-center gap-8 bg-black text-white px-10 py-5 rounded-full overflow-hidden"
          >
            <span className="relative z-10 font-bold uppercase tracking-widest">
              Secure Your Slot
            </span>
            <FiArrowRight
              className="relative z-10 group-hover:translate-x-2 transition-transform"
              size={24}
            />
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween" }}
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
