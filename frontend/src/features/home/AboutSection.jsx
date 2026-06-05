import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const stats = [
    { value: '150+', label: 'Projects Delivered' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '5+',   label: 'Years of Excellence' },
    { value: '24/7', label: 'Expert Support' },
];

const tagline = ['INNOVATE.', 'INTEGRATE.', 'ELEVATE.'];

const About = () => {
    const { isDark } = useTheme();

    return (
        <section
            id="about"
            className="t-section relative py-32 px-6 md:px-10 overflow-hidden"
        >
            {/* Section divider top */}
            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-white/02 blur-[120px]" />
            </div>
            <div className="absolute inset-0 vtrc-grid pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* SECTION LABEL */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="w-8 h-[1px] bg-white rounded-full" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white">
                        01 — About VTRC
                    </span>
                </motion.div>

                {/* TAGLINE */}
                <div className="mb-10">
                    {tagline.map((word, i) => (
                        <motion.div
                            key={word}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2
                                className={`text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] ${
                                    i === 2
                                        ? 'gradient-text'
                                        : i === 0
                                        ? 't-text'
                                        : isDark ? 'text-[#E2E8F0]/60' : 'text-[#1E2933]/50'
                                }`}
                            >
                                {word}
                            </h2>
                        </motion.div>
                    ))}
                </div>

                {/* DESCRIPTION + BRAND INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-light leading-relaxed t-text-muted max-w-lg"
                    >
                        VTRC Technologies delivers{' '}
                        <span className="t-text font-medium">intelligent, scalable</span>, and{' '}
                        <span className="text-zinc-400 font-medium">future-ready solutions</span> that
                        transform how businesses connect, operate, and grow.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 }}
                        className="space-y-6"
                    >
                        {[
                            { title: 'Enterprise Software', desc: 'Bespoke platforms built to scale with your business operations.' },
                            { title: 'Cloud Integration',  desc: 'Seamlessly connect your infrastructure with next-gen cloud solutions.' },
                            { title: 'AI & Automation',   desc: 'Intelligent workflows that eliminate inefficiency and drive growth.' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-4 group">
                                <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                                <div>
                                    <p className="font-semibold t-text text-sm mb-1">{item.title}</p>
                                    <p className="text-sm t-text-subtle font-light">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t t-divider">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="stat-card group cursor-default"
                        >
                            <div
                                className="text-4xl md:text-5xl font-extrabold mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff, #444444)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {stat.value}
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wider t-text-subtle group-hover:text-white transition-colors">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;