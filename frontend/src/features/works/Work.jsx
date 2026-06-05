import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ── Project Card ── */
const ProjectCard = ({ project, index }) => {
  const isFeatured = index % 5 === 4; // every 5th card is a wide featured card

  return (
    <Link
      to={project.link || '#'}
      className={`group block no-underline border-2 border-black bg-white overflow-hidden flex flex-col${
        isFeatured ? ' md:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#eeeeee]" style={{ height: isFeatured ? '360px' : '260px' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
        />
        {/* index badge */}
        <span className="absolute top-4 left-4 bg-black text-white font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-widest px-2 py-1">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t-2 border-black flex items-center justify-between gap-4 bg-[#faf9f9]">
        <div>
          <h2 className="font-['Syne'] text-[20px] font-bold uppercase text-black m-0 leading-tight">
            {project.title}
          </h2>
          <p className="font-['JetBrains_Mono'] text-[11px] font-medium text-[#5d5f5f] uppercase mt-1 mb-0 tracking-widest">
            {project.subtitle || project.category}
          </p>
        </div>
        <span className="material-symbols-outlined text-[22px] text-black flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
          arrow_forward
        </span>
      </div>
    </Link>
  );
};

/* ── Page ── */
const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Projects', value: projects.length > 0 ? `${projects.length}+` : '0' },
    { label: 'Years Active', value: '12' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Awards', value: '42' },
  ];

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-16 pt-14 md:pt-20 pb-24">

        {/* ── HERO ── */}
        <section className="mb-16">
          {/* Label badge */}
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 border border-black">
            <span className="w-2 h-2 rounded-full bg-black inline-block" />
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
              Selected Works // 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-['Syne'] text-[clamp(32px,5vw,68px)] leading-[1] tracking-[-0.03em] font-extrabold text-black uppercase m-0 mb-6">
            Proving the{' '}
            <span className="italic text-transparent" style={{ WebkitTextStroke: '2px black' }}>
              Impossible
            </span>
            <br />
            Permanent
          </h1>

          {/* Divider row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-t-2 border-black pt-6">
            <p className="font-['Geist'] text-[15px] leading-[1.7] text-[#5d5f5f] max-w-md m-0">
              VTRC Technologies architects the digital foundations for the world's most ambitious
              industrial and creative entities. We engineer digital monuments.
            </p>
            <Link
              to="/contact-us"
              className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-black border-b-2 border-black pb-0.5 hover:opacity-50 transition-opacity whitespace-nowrap self-start md:self-auto"
            >
              Start a Project →
            </Link>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="border-2 border-black mb-5 grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-2 divide-black">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 md:px-8 py-5 flex flex-col gap-1 bg-white${
                i < 2 ? ' border-b-2 md:border-b-0 border-black' : ''
              }`}
            >
              <p className="font-['JetBrains_Mono'] text-[11px] font-medium text-[#5d5f5f] uppercase m-0 tracking-widest">
                {s.label}
              </p>
              <p className="font-['Syne'] text-[28px] md:text-[32px] font-bold text-black m-0 leading-none">
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {/* ── PROJECT GRID ── */}
        <section className="border-2 border-black bg-white">
          {/* Header bar */}
          <div className="border-b-2 border-black px-6 md:px-8 py-3.5 flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
              Project Archive
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
              {loading ? '—' : `${projects.length} Entries`}
            </span>
          </div>

          {/* Grid body */}
          <div className="p-5">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-6">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-widest font-bold text-[#5d5f5f]">
                  Loading Archive…
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-32 border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-center gap-3">
                <p className="font-['Syne'] text-[20px] font-bold uppercase text-black m-0">
                  No Monuments Found
                </p>
                <p className="font-['Geist'] text-[14px] text-[#5d5f5f] m-0">
                  The digital archive is currently empty.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mt-5 border-2 border-black bg-black text-white px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-white/50 m-0 mb-3">
              Ready to Begin?
            </p>
            <h2 className="font-['Syne'] text-[clamp(24px,3.5vw,44px)] leading-[1.1] font-bold uppercase text-white m-0">
              Build the Permanent
            </h2>
            <p className="font-['Geist'] text-[14px] leading-[1.7] text-white/60 mt-4 m-0 max-w-md">
              Our queue for Q4 is opening. We seek partners who value structural integrity and
              long-form digital strategy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact-us"
              className="bg-white text-black px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 tracking-widest whitespace-nowrap"
            >
              Contact Strategy Team
            </Link>
            <Link
              to="/services"
              className="bg-transparent text-white px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase border-2 border-white/30 hover:border-white transition-all duration-300 tracking-widest whitespace-nowrap"
            >
              Our Services
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Work;
