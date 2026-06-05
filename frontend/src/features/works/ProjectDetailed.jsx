import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetailed = () => {
  const { projectId } = useParams();
  
  // Ensure the page scrolls to the top when navigated to
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  // Format the project slug (e.g., 'chronos-monolith') into a display title
  const formattedProject = projectId ? projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Project Name';

  const projectWords = formattedProject.split(' ');
  const word1 = projectWords[0] || 'Project';
  const word2 = projectWords.slice(1).join(' ') || 'Name';

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-12 md:pt-24 pb-24">
        
        {/* ── HERO SECTION ── */}
        <header className="pt-4 pb-16 md:pt-8 md:pb-32 border-b-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="mb-8">
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase bg-black text-white px-3 py-1">Case Study</span>
              </div>
              <h1 className="font-['Syne'] text-[clamp(40px,10vw,120px)] font-extrabold uppercase leading-[0.9] m-0 break-words text-black">
                {word1}<br/>{word2}
              </h1>
            </div>
            <div className="md:col-span-4 flex flex-col gap-4 mt-8 md:mt-0">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase m-0 text-black">Client</p>
                <p className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase m-0 text-[#5d5f5f]">Confidential</p>
              </div>
              <div className="flex items-center justify-between border-b border-black pb-3">
                <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase m-0 text-black">Year</p>
                <p className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase m-0 text-[#5d5f5f]">2024</p>
              </div>
              <div className="flex items-center justify-between border-b border-black pb-3">
                <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase m-0 text-black">Role</p>
                <p className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase m-0 text-[#5d5f5f]">Architecture & Design</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Content Sections: Bento Grid Approach ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 border-x-2 border-black bg-white">
          
          {/* The Challenge */}
          <div className="md:col-span-7 border-b-2 md:border-r-2 border-black p-8 md:p-12">
            <h2 className="font-['Syne'] text-[32px] font-bold uppercase mb-8 text-black m-0">The Challenge</h2>
            <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] mb-6 m-0">
              {formattedProject} required a complete architectural overhaul to support their rapidly scaling user base. The existing infrastructure was fragile, heavily layered with technical debt, and failed to communicate the brand's core values of precision and reliability.
            </p>
            <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] m-0">
              Our mission was to strip away the superfluous and engineer a brutalist, high-performance digital monument. We focused on structural honesty, laying bare the functional components of the system to create an interface that is both intimidatingly powerful and flawlessly intuitive.
            </p>
          </div>
          
          {/* Scope */}
          <div className="md:col-span-5 border-b-2 border-black p-8 md:p-12 bg-[#f4f3f3]">
            <h3 className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase mb-8 opacity-60 text-black m-0">Scope</h3>
            <ul className="space-y-6 list-none p-0 m-0">
              <li className="flex gap-4">
                <span className="font-['Syne'] text-[32px] font-bold leading-none text-black">01</span>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] m-0 mt-1">Full-stack architectural redesign and migration.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-['Syne'] text-[32px] font-bold leading-none text-black">02</span>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] m-0 mt-1">Implementation of a brutalist, high-contrast design system.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-['Syne'] text-[32px] font-bold leading-none text-black">03</span>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] m-0 mt-1">Optimization of real-time data streaming pipelines.</p>
              </li>
            </ul>
          </div>
          
          {/* Key Features */}
          <div className="md:col-span-6 border-b-2 md:border-r-2 border-black p-8 md:p-12">
            <h2 className="font-['Syne'] text-[32px] font-bold uppercase mb-8 text-black m-0">Key Features</h2>
            <div className="space-y-4">
              <div className="p-6 border border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
                <h4 className="font-['JetBrains_Mono'] text-[12px] uppercase font-bold mb-3 text-black group-hover:text-white m-0">Monolithic Architecture</h4>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] group-hover:text-white/80 m-0">Engineered a robust, unyielding backend capable of processing millions of concurrent requests with zero latency.</p>
              </div>
              <div className="p-6 border border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
                <h4 className="font-['JetBrains_Mono'] text-[12px] uppercase font-bold mb-3 text-black group-hover:text-white m-0">Typography as UI</h4>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] group-hover:text-white/80 m-0">Replaced generic iconography with aggressive, utilitarian typography to establish visual hierarchy and guide user focus.</p>
              </div>
              <div className="p-6 border border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
                <h4 className="font-['JetBrains_Mono'] text-[12px] uppercase font-bold mb-3 text-black group-hover:text-white m-0">Fluid Grid System</h4>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] group-hover:text-white/80 m-0">A responsive bento-grid layout that mathematically scales across all viewports without breaking structural alignment.</p>
              </div>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="md:col-span-6 border-b-2 border-black p-8 md:p-12">
            <h2 className="font-['Syne'] text-[32px] font-bold uppercase mb-8 text-black m-0">Tech Stack</h2>
            <ul className="space-y-6 font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] list-none p-0 m-0">
              <li className="flex items-start gap-4">
                <span className="font-['JetBrains_Mono'] font-bold text-black mt-1">01</span>
                <span><strong className="text-black font-bold">Frontend:</strong> React 18, Tailwind CSS, Framer Motion for micro-interactions.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="font-['JetBrains_Mono'] font-bold text-black mt-1">02</span>
                <span><strong className="text-black font-bold">Backend:</strong> Node.js, Express, Go for high-performance microservices.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="font-['JetBrains_Mono'] font-bold text-black mt-1">03</span>
                <span><strong className="text-black font-bold">Database:</strong> PostgreSQL, Redis for aggressive caching layer.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="font-['JetBrains_Mono'] font-bold text-black mt-1">04</span>
                <span><strong className="text-black font-bold">Infrastructure:</strong> AWS, Docker, Kubernetes for uncompromising scalability.</span>
              </li>
            </ul>
          </div>
          
        </section>

        {/* ── Call To Action Section ── */}
        <section className="border-x-2 border-b-2 border-black w-full bg-black text-white p-12 md:p-24 flex flex-col items-center text-center">
          <h2 className="font-['Syne'] text-[clamp(40px,6vw,80px)] font-bold uppercase mb-8 m-0 leading-tight">
            Ready to engineer<br/>your own monument?
          </h2>
          <p className="font-['Geist'] text-[18px] leading-[1.6] max-w-2xl mb-12 opacity-80 m-0">
            We partner with organizations that prioritize structural integrity and bold, uncompromising design. Let's discuss your next massive undertaking.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <button className="bg-white text-black font-['Syne'] text-[18px] md:text-[20px] font-bold uppercase tracking-tighter px-10 py-5 border-2 border-white hover:bg-transparent hover:text-white transition-colors duration-300 cursor-pointer">
              View Live Site
            </button>
            <Link to="/start-project" className="bg-transparent text-white font-['Syne'] text-[18px] md:text-[20px] font-bold uppercase tracking-tighter px-10 py-5 border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer no-underline block text-center">
              Start a Project
            </Link>
          </div>
        </section>

        {/* ── Visual Anchor ── */}
        <section className="py-16">
          <div className="relative w-full aspect-[21/9] border-2 border-black overflow-hidden group">
            <img 
              alt="Project Visuals"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdQMYDZvBdFOk7OxLlmf0SJjE3fWqyLY_rZ-QDU8SqaqwEwQauTACJYDK2hVqbjOVN33LRxPEp6rGwb1UuK9dSW5phUB00VD9oANFkdFJmj4RqTkqhIwExR_XU4m-i1BEunYFOf09ubRDLwBMI4n5cuHtGtVcRUmHJLazuKgbtim864qAxJxWHHJZP7n2dVh6JujcKAomrpxWcbLGUkCJLdrgOOFiPT3kTTw0Akr66BfME1ceS-xfmIlzxOT4cJTVpXoMXGgeW1A"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute bottom-6 left-6 bg-[#faf9f9] px-4 py-2 border border-black">
              <p className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase m-0 text-black">VTRC // {formattedProject}</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default ProjectDetailed;
