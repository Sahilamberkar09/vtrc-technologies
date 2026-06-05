import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiZap, FiCode, FiTrendingUp, FiShield,
    FiSmartphone, FiSearch, FiCheckCircle, FiArrowUpRight
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/* ─────────────────────────────────────────────
   ANIMATED NUMBER HOOK
───────────────────────────────────────────── */
const useCounter = (target, duration = 1500, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
};

/* ─────────────────────────────────────────────
   CARD 1 — PAGESPEED GAUGE (circle)
───────────────────────────────────────────── */
const PageSpeedCard = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const score = useCounter(100, 1800, inView);

    const radius = 42;
    const circ   = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="bento-card flex flex-col justify-between"
        >
            <div>
                <span className="bento-label">Performance</span>
                <h3 className="bento-title mt-2">Perfect PageSpeed Score</h3>
            </div>
            <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r={radius} fill="none"
                            stroke="url(#gauge-grad)" strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circ}
                            strokeDashoffset={inView ? offset : circ}
                            style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }}
                        />
                        <defs>
                            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#444444" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold gradient-text">{score}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest t-text-subtle">/ 100</span>
                    </div>
                </div>
            </div>
            <p className="text-xs t-text-subtle leading-relaxed">
                Every site we ship scores 95–100 on Google PageSpeed — guaranteed.
            </p>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   CARD 2 — DELIVERY TIMELINE (wide)
───────────────────────────────────────────── */
const steps = [
    { n: '01', label: 'Discovery',   days: 'Week 1' },
    { n: '02', label: 'Design',      days: 'Week 2' },
    { n: '03', label: 'Development', days: 'Week 3–4' },
    { n: '04', label: 'Launch 🚀',   days: 'Week 5' },
];

const TimelineCard = () => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65 }}
        className="bento-card col-span-2"
    >
        <span className="bento-label">Delivery</span>
        <h3 className="bento-title mt-2 mb-6">From Brief to Live in 5 Weeks</h3>
        <div className="relative">
            {/* connector line */}
            <div className="absolute top-5 left-5 right-5 h-px bg-white/10 hidden md:block" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((s, i) => (
                    <motion.div
                        key={s.n}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        className="flex flex-col items-center text-center gap-2"
                    >
                        <div className="relative z-10 w-10 h-10 rounded-full border-2 border-white bg-white/10
                            flex items-center justify-center text-[10px] font-extrabold text-white">
                            {s.n}
                        </div>
                        <p className="text-[11px] font-bold t-text uppercase tracking-wide">{s.label}</p>
                        <span className="text-[10px] t-text-subtle">{s.days}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   CARD 3 — CODE QUALITY (syntax snippet)
───────────────────────────────────────────── */
const CodeCard = () => {
    const { isDark } = useTheme();
    const lines = [
        { tokens: [{ t: 'const ', c: 'text-white' }, { t: 'vtrc', c: 'text-zinc-400' }, { t: ' = {', c: 't-text-muted' }] },
        { tokens: [{ t: '  stack', c: 'text-zinc-400' }, { t: ': [', c: 't-text-muted' }, { t: '"React"', c: 'text-zinc-200' }, { t: ', ...],', c: 't-text-muted' }] },
        { tokens: [{ t: '  speed', c: 'text-zinc-400' }, { t: ': ', c: 't-text-muted' }, { t: '"100/100"', c: 'text-zinc-200' }, { t: ',', c: 't-text-muted' }] },
        { tokens: [{ t: '  seo  ', c: 'text-zinc-400' }, { t: ': ', c: 't-text-muted' }, { t: '"Optimised"', c: 'text-zinc-200' }, { t: ',', c: 't-text-muted' }] },
        { tokens: [{ t: '  ship ', c: 'text-zinc-400' }, { t: ': ', c: 't-text-muted' }, { t: '"5 Weeks"', c: 'text-zinc-200' }, { t: ',', c: 't-text-muted' }] },
        { tokens: [{ t: '};', c: 't-text-muted' }] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
            className="bento-card"
        >
            <span className="bento-label">Engineering</span>
            <h3 className="bento-title mt-2 mb-4">Clean, Maintainable Code</h3>
            <div className={`rounded-xl p-4 font-mono text-[11px] leading-6 overflow-hidden
                ${isDark ? 'bg-[#0B1219] border border-[#3B82F6]/10' : 'bg-slate-900 border border-slate-700'}`}>
                {/* Title bar */}
                <div className="flex gap-1.5 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                {lines.map((line, li) => (
                    <motion.div
                        key={li}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: li * 0.08 }}
                        className="flex flex-wrap"
                    >
                        <span className="mr-3 text-slate-600 select-none">{String(li + 1).padStart(2, '0')}</span>
                        {line.tokens.map((tok, ti) => (
                            <span key={ti} className={tok.c}>{tok.t}</span>
                        ))}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   CARD 4 — CONVERSION CHART (results)
───────────────────────────────────────────── */
const bars = [22, 28, 35, 30, 42, 38, 55, 48, 62, 58, 75, 80];
const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];

const ConversionCard = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const growth = useCounter(247, 1600, inView);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="bento-card col-span-2"
        >
            <div className="flex items-start justify-between mb-6">
                <div>
                    <span className="bento-label">Results</span>
                    <h3 className="bento-title mt-2">Websites That Drive Real Growth</h3>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-extrabold gradient-text">+{growth}%</div>
                    <div className="text-[10px] t-text-subtle uppercase tracking-wider">Avg. conversion lift</div>
                </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-24">
                {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                            initial={{ scaleY: 0 }}
                            animate={inView ? { scaleY: 1 } : {}}
                            transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                            style={{ height: `${h}%`, originY: 1 }}
                            className={`w-full rounded-t-sm ${i >= 9
                                ? 'bg-gradient-to-t from-white to-zinc-400'
                                : 'bg-white/10'
                            }`}
                        />
                        <span className="text-[8px] t-text-faint">{months[i]}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs t-text-subtle mt-3 leading-relaxed">
                Average conversion rate increase across 50+ client websites tracked over 12 months.
            </p>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   CARD 5 — UPTIME / RELIABILITY
───────────────────────────────────────────── */
const bars2Data = Array.from({ length: 30 }, (_, i) => ({
    h: i === 11 || i === 22 ? 20 : Math.random() * 60 + 40,
    ok: i !== 11 && i !== 22,
}));

const UptimeCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bento-card"
        >
            <span className="bento-label">Reliability</span>
            <div className="flex items-center gap-2 mt-2 mb-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <h3 className="bento-title">99.98% Uptime</h3>
            </div>
            <p className="text-[11px] t-text-subtle mb-4">30-day monitoring window</p>
            <div className="flex items-end gap-0.5 h-12">
                {bars2Data.map((b, i) => (
                    <div
                        key={i}
                        style={{ height: `${b.h}%` }}
                        className={`flex-1 rounded-sm ${b.ok ? 'bg-emerald-400/60' : 'bg-red-400/50'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   CARD 6 — MOBILE FIRST
───────────────────────────────────────────── */
const MobileCard = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bento-card flex flex-col"
    >
        <span className="bento-label">Cross-Platform</span>
        <h3 className="bento-title mt-2 mb-4">Mobile-First by Design</h3>
        {/* Fake mobile frame */}
        <div className="mx-auto w-20 h-36 rounded-2xl border-2 border-[#3B82F6]/30 bg-[#3B82F6]/05 flex flex-col overflow-hidden p-1.5 gap-1">
            <div className="w-6 h-1 rounded-full bg-[#3B82F6]/30 mx-auto mb-1" />
            <div className="w-full h-2 rounded bg-[#3B82F6]/20" />
            <div className="w-full h-6 rounded bg-[#3B82F6]/15" />
            <div className="grid grid-cols-2 gap-1 flex-1">
                <div className="rounded bg-[#3B82F6]/10" />
                <div className="rounded bg-[#93C5FD]/10" />
            </div>
            <div className="w-full h-1.5 rounded bg-[#3B82F6]/20" />
        </div>
        <p className="text-[11px] t-text-subtle mt-4 leading-relaxed text-center">
            Responsive across all 6k+ device screen sizes.
        </p>
    </motion.div>
);

/* ─────────────────────────────────────────────
   CARD 7 — SEO OPTIMISED
───────────────────────────────────────────── */
const SeoCard = () => {
    const checks = ['Semantic HTML5', 'Core Web Vitals', 'Schema Markup', 'OG Tags & Sitemap'];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bento-card"
        >
            <span className="bento-label">Visibility</span>
            <h3 className="bento-title mt-2 mb-5">SEO Baked In from Day 1</h3>
            <div className="space-y-2.5">
                {checks.map((c, i) => (
                    <motion.div
                        key={c}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <FiCheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-[12px] t-text-muted font-medium">{c}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   MINI STAT STRIP
───────────────────────────────────────────── */
const miniStats = [
    { icon: <FiZap size={14}/>,        val: '5 Wks',  label: 'Avg. launch time' },
    { icon: <FiCode size={14}/>,       val: '500k+',  label: 'Lines of code shipped' },
    { icon: <FiTrendingUp size={14}/>, val: '3.2×',   label: 'Avg. conversion increase' },
    { icon: <FiShield size={14}/>,     val: '100%',   label: 'Client retention' },
    { icon: <FiSmartphone size={14}/>, val: '6k+',    label: 'Screen sizes tested' },
    { icon: <FiSearch size={14}/>,     val: 'Top 3',  label: 'Average SEO rank achieved' },
];

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
const WhyChooseUs = () => {
    const { isDark } = useTheme();

    return (
        <section id="services" className="t-section relative py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 vtrc-grid pointer-events-none opacity-40" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
            <motion.div
                animate={{ opacity: [0.04, 0.08, 0.04], scale: [1, 1.08, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#3B82F6]/06 blur-[160px] pointer-events-none"
            />

            <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">

                {/* ── SECTION HEADER ─────────────────── */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-5"
                    >
                        <div className="w-8 h-[1px] bg-white rounded-full" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white">
                            03 — Why Choose VTRC
                        </span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight t-text leading-[1.05]"
                        >
                            We build websites that{' '}
                            <span style={{
                                background: 'linear-gradient(120deg, #ffffff 0%, #444444 60%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                actually work.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="t-text-muted text-base font-light leading-relaxed max-w-sm lg:text-right"
                        >
                            Performance, aesthetics, and conversion — we don't compromise on any of them.
                        </motion.p>
                    </div>
                </div>

                {/* ── BENTO GRID ─────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {/* Row 1: Timeline (wide) + PageSpeed */}
                    <div className="lg:col-span-2"><TimelineCard /></div>
                    <PageSpeedCard />

                    {/* Row 2: Code + Conversion (wide) */}
                    <CodeCard />
                    <div className="lg:col-span-2"><ConversionCard /></div>

                    {/* Row 3: Uptime + Mobile + SEO */}
                    <UptimeCard />
                    <MobileCard />
                    <SeoCard />
                </div>

                {/* ── MINI STAT STRIP ─────────────────── */}
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px
                    border t-divider rounded-2xl overflow-hidden
                    ${isDark ? 'bg-[#3B82F6]/08' : 'bg-[#3B82F6]/10'}`}>
                    {miniStats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="t-section flex flex-col items-center text-center gap-2 px-4 py-6 group cursor-default"
                        >
                            <span className="text-white group-hover:scale-110 transition-transform">{s.icon}</span>
                            <span className="text-xl font-extrabold gradient-text">{s.val}</span>
                            <span className="text-[10px] t-text-subtle uppercase tracking-wide leading-tight">{s.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* ── CTA ─────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center mt-12"
                >
                    <Link
                        to="/start-project"
                        className="group flex items-center gap-3 px-8 py-4 rounded-full
                            text-[12px] font-bold uppercase tracking-[0.18em] text-black
                            bg-white hover:bg-zinc-200 transition-all duration-300
                            hover:-translate-y-0.5"
                    >
                        Start Your Project
                        <FiArrowUpRight size={14} className="group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
