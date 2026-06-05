import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Data ───────────────────────────────────────────────────────────────────
const reviews = [
  {
    id: 1,
    company: "NEXORA CORP",
    sector: "FinTech",
    quote:
      "VTRC Technologies transformed our legacy banking infrastructure into a real-time, cloud-native platform. The results exceeded every benchmark we had set.",
    person: "Chief Technology Officer",
    initial: "N",
    year: "2025",
    tags: ["Cloud Migration", "FinTech", "Real-Time"],
  },
  {
    id: 2,
    company: "ASTRA HEALTH",
    sector: "HealthTech",
    quote:
      "The HIPAA-compliant data platform processes over 2 million records daily with zero downtime. Truly future-ready engineering.",
    person: "Head of Engineering",
    initial: "A",
    year: "2025",
    tags: ["HIPAA", "Data Platform", "Healthcare"],
  },
  {
    id: 3,
    company: "MERIDIAN LOG",
    sector: "Supply Chain",
    quote:
      "Our route optimization AI reduced delivery costs by 34% in the first quarter. VTRC's team is exceptionally reliable and fast to deliver.",
    person: "Operations Director",
    initial: "M",
    year: "2026",
    tags: ["AI/ML", "Logistics", "Optimization"],
  },
  {
    id: 4,
    company: "SOLARIS",
    sector: "CleanTech",
    quote:
      "The IoT monitoring dashboard gives us real-time visibility across 200+ sites. A seamless blend of design and engineering excellence.",
    person: "VP of Digital Products",
    initial: "S",
    year: "2026",
    tags: ["IoT", "Dashboard", "CleanTech"],
  },
  {
    id: 5,
    company: "VERTEX AI",
    sector: "Enterprise SaaS",
    quote:
      "Partnering with VTRC elevated our product from MVP to enterprise-grade in record time. Their attention to detail is second to none.",
    person: "Product Lead",
    initial: "V",
    year: "2026",
    tags: ["SaaS", "Enterprise", "Scale"],
  },
  {
    id: 6,
    company: "ORBIS MEDIA",
    sector: "Media & Broadcast",
    quote:
      "Our streaming platform now handles 5M concurrent users flawlessly. The architecture VTRC designed is rock-solid and elastic.",
    person: "CTO",
    initial: "O",
    year: "2025",
    tags: ["Streaming", "Architecture", "Scale"],
  },
];

// ─── Marquee logos ───────────────────────────────────────────────────────────
const logos = [
  "NEXORA CORP",
  "ASTRA HEALTH",
  "MERIDIAN LOG",
  "SOLARIS",
  "VERTEX AI",
  "ORBIS MEDIA",
  "QUANTEX",
  "HELION",
];

// ─── Testimonial Card ────────────────────────────────────────────────────────
const TestimonialCard = ({ item, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.02)",
        borderColor: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
        transition: "all 0.4s ease",
      }}
      className="relative rounded-2xl border p-8 flex flex-col gap-6 cursor-default overflow-hidden"
    >
      {/* Top glow on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Large quote mark */}
      <span
        className="absolute top-6 right-8 text-[80px] leading-none font-black select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.04)" }}
      >
        &ldquo;
      </span>

      {/* Company + sector */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "Orbitron, sans-serif",
          }}
        >
          {item.initial}
        </div>
        <div>
          <p
            className="text-xs font-black uppercase tracking-widest text-white"
            style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.2em" }}
          >
            {item.company}
          </p>
          <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {item.sector} · {item.year}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p
        className="text-base leading-relaxed flex-1"
        style={{ color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}
      >
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Person */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
          — {item.person}
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-white text-xs" style={{ opacity: 0.7 }}>★</span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-bold"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Marquee Strip ───────────────────────────────────────────────────────────
const MarqueeStrip = ({ reverse = false }) => {
  const doubled = [...logos, ...logos];
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{
          animation: `marquee-${reverse ? "rev" : "fwd"} 28s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="text-[11px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-6"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: "Orbitron, sans-serif" }}
          >
            {name}
            <span style={{ color: "rgba(255,255,255,0.08)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Clients Section ─────────────────────────────────────────────────────────
const Clients = () => {
  return (
    <section
      className="relative bg-black py-32 overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left: label + heading */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="block text-[10px] font-bold uppercase tracking-[0.8em] mb-6"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Client Impact
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Trusted
              <br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>Voices.</span>
            </motion.h2>
          </div>

          {/* Right: stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-6 flex-wrap"
          >
            {[
              { num: "50+", label: "Global Clients" },
              { num: "99%", label: "Satisfaction Rate" },
              { num: "5★", label: "Average Rating" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="px-6 py-4 rounded-xl text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-3xl font-black text-white"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {num}
                </p>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Marquee strips ── */}
      <div className="relative z-10 mb-20 flex flex-col gap-4">
        <MarqueeStrip />
        <MarqueeStrip reverse />
      </div>

      {/* ── Card Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((item, index) => (
            <TestimonialCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mt-20"
      >
        <div
          className="rounded-2xl px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ready to join them?
            </p>
            <p className="text-xl font-black uppercase" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Let's build something remarkable.
            </p>
          </div>
          <Link
            to="/start-project"
            className="px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest bg-white text-black transition-all duration-300 hover:bg-gray-100 shrink-0 no-underline"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Start a Project →
          </Link>
        </div>
      </motion.div>

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Clients;
