import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LogoAnimation from "../../components/ui/LogoAnimation";

const steps = [
    {
        id: '01',
        title: 'Strategic Blueprint',
        desc: 'Architecting the technical foundation. We don’t just plan; we engineer the entire ecosystem for peak performance.',
        tags: ['System Arch', 'Tech Audit', 'Scale Roadmap'],
        accent: '#3B82F6',
        icon: '🎯'
    },
    {
        id: '02',
        title: 'Precision UI',
        desc: 'High-fidelity interfaces crafted with surgical precision. Minimalist aesthetics meeting functional excellence.',
        tags: ['UX/UI', 'Framer', 'Prototyping'],
        accent: '#60A5FA',
        icon: '✨'
    },
    {
        id: '03',
        title: 'Elite Engineering',
        desc: 'Surgically clean code optimized for speed and security. We build for scale from day one.',
        tags: ['React', 'Next.js', 'Performance'],
        accent: '#93C5FD',
        icon: '⚡'
    },
    {
        id: '04',
        title: 'Mission Control',
        desc: 'Full-scale deployment with automated testing and 24/7 technical surveillance for total dominance.',
        tags: ['CI/CD', 'SEO', 'Deployment'],
        accent: '#FFFFFF',
        icon: '🚀'
    }
];

const Procedure = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative bg-black text-white px-6 md:px-20 overflow-hidden">

            {/* ── INTRO HEADER ── */}
            <div className="h-screen flex flex-col justify-center max-w-4xl">
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold uppercase tracking-[1em] text-white/30 block mb-6"
                >
                    Operational Excellence
                </motion.span>
                <h2 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-10" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    The <br /> <span className="text-white/20">Method.</span>
                </h2>
                <p className="text-white/40 text-xl font-light max-w-xl leading-relaxed border-l border-white/10 pl-8">
                    A deep dive into our systematic approach to digital dominance. Each phase is a calculated move toward excellence.
                </p>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-20 flex flex-col items-center gap-4 w-fit"
                >
                    <span className="text-[10px] uppercase tracking-widest text-white/20">Scroll to Explore</span>
                    <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </div>

            {/* ── STACKED CARDS ── */}
            <div className="relative z-10 pb-[20vh]">
                {steps.map((step, index) => (
                    <StepCard
                        key={step.id}
                        step={step}
                        index={index}
                        total={steps.length}
                        progress={scrollYProgress}
                    />
                ))}
            </div>
        </section>
    );
};

const StepCard = ({ step, index, total, progress }) => {
    // Each card starts appearing after the intro (index * percentage)
    // and stays sticky. We use the index to offset the sticky position.

    // Calculate the point at which this card becomes "active"
    const start = index / total;
    const end = (index + 1) / total;

    // Scale and opacity effects for the "stack" look
    const scale = useTransform(progress, [start, end], [1, 0.9]);
    const opacity = useTransform(progress, [start, end], [1, 0.6]);
    const brightness = useTransform(progress, [start, end], [1, 0.3]);

    return (
        <div className="h-screen sticky top-0 flex items-center justify-center pointer-events-none">
            <motion.div
                style={{
                    scale,
                    opacity,
                    filter: `brightness(${brightness})`,
                    top: `calc(10% + ${index * 2.5}rem)`
                }}
                className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-20 relative overflow-hidden pointer-events-auto group"
            >
                {/* Accent Background */}
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 blur-[150px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ backgroundColor: step.accent }}
                />

                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Left: Index & Icon */}
                    <div className="flex flex-col gap-6">
                        <span className="text-8xl md:text-[10rem] font-black text-white/10 leading-none" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {step.id}
                        </span>
                        <div className="text-4xl md:text-6xl filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                            {step.icon}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1">
                        <h3 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {step.title}
                        </h3>
                        <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
                            {step.desc}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {step.tags.map(tag => (
                                <span key={tag} className="text-xs uppercase tracking-widest px-6 py-3 bg-white/05 border border-white/10 rounded-full text-white/40 group-hover:border-white/30 group-hover:text-white transition-all duration-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Line */}
                <div
                    className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-700"
                    style={{
                        width: '0%',
                        backgroundColor: step.accent,
                        '--group-hover-width': '100%'
                    }}
                // Custom hover logic via CSS class or inline style if needed, 
                // but for now let's keep it simple.
                />
            </motion.div>
        </div>
    );
};

export default Procedure;
