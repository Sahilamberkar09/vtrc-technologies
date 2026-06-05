import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    index: '01',
    title: 'Design',
    subtitle: 'Visual Architecture / UI & UX / Systems',
    pillars: [
      {
        name: 'SYSTEMIC CLARITY',
        body: 'We design frameworks, not just screens. Every element is governed by rigorous logic that ensures scalability and brand coherence across all touchpoints.',
      },
      {
        name: 'TECHNICAL BEAUTY',
        body: 'Minimalist aesthetics meet complex functionality. We strip away the noise to reveal core utility — creating interfaces that feel inevitable.',
      },
    ],
    tags: ['Interaction Design', 'Design Tokens', 'Prototyping', 'Brand Identity'],
    icon: 'brush',
  },
  {
    index: '02',
    title: 'Develop',
    subtitle: 'Front-end / Back-end / Architecture',
    pillars: [
      {
        name: 'ENGINEERED STACK',
        body: 'We build with performance as the primary metric. Our codebases are lean, secure, and built using industry-standard technologies that stand the test of time.',
      },
      {
        name: 'API FIRST',
        body: 'Highly decoupled architectures that allow for seamless integration and future-proofing. We build the backbone of modern digital enterprises.',
      },
    ],
    tags: ['Cloud Infrastructure', 'Node.JS / React', 'Backend Systems', 'CI/CD Pipelines'],
    icon: 'terminal',
  },
  {
    index: '03',
    title: 'Deploy',
    subtitle: 'Hosting / DevOps / Launch & Scale',
    pillars: [
      {
        name: 'ZERO DOWNTIME',
        body: 'We handle CI/CD pipelines, cloud provisioning, and production rollouts — so your product ships fast and stays live without interruptions.',
      },
      {
        name: 'BUILT TO SCALE',
        body: 'From a single-server MVP to a globally distributed system, our infrastructure grows with you — monitored, secured, and optimised at every stage.',
      },
    ],
    tags: ['CI/CD Pipelines', 'Cloud Hosting', 'Domain & DNS', 'Performance Monitoring'],
    icon: 'rocket_launch',
  },
];

const FAQS = [
  {
    q: 'What types of projects do you take on?',
    a: 'We work on a wide range — from landing pages and marketing sites to full-stack web applications and SaaS platforms. If it lives in a browser, we can build it.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'A standard website takes 3–6 weeks from kickoff to launch. More complex web apps or platforms typically run 8–16 weeks depending on scope, integrations, and feedback cycles.',
  },
  {
    q: 'Do you work with early-stage startups or only established businesses?',
    a: 'Both. We enjoy working with startups who need to move fast and with established businesses looking to modernise their digital presence. Our process scales to fit your stage.',
  },
  {
    q: 'Can you redesign an existing website?',
    a: 'Yes. Redesigns are a large part of what we do. We audit your current site, identify what is holding you back, and rebuild with a clear improvement to performance, design, and conversion.',
  },
  {
    q: 'Do you provide ongoing support after launch?',
    a: 'We offer retainer-based support for clients who need regular updates, performance monitoring, and technical maintenance after the initial launch.',
  },
  {
    q: 'What is your pricing structure?',
    a: 'We quote per project based on scope. After an initial brief we provide a fixed-price proposal so there are no surprises. Retainer and hourly options are available for ongoing work.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. We are happy to sign a mutual NDA before any sensitive details are shared. You can request one directly on the Contact page.',
  },
  {
    q: 'How do we get started?',
    a: 'Send us a brief via the Contact page. Tell us what you are building, your timeline, and your budget. We will come back within 24 hours with next steps.',
  },
];

/* ── FAQ Accordion Item ── */
const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-black/10 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 text-left group hover:bg-[#f4f3f3] transition-colors"
    >
      <span className="font-['Syne'] text-[15px] font-bold text-black uppercase tracking-wide">
        {question}
      </span>
      <span
        className="material-symbols-outlined text-[20px] text-black flex-shrink-0 transition-transform duration-300"
        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
      >
        add
      </span>
    </button>
    <div
      style={{
        maxHeight: isOpen ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}
    >
      <p className="font-['Geist'] text-[14px] leading-[1.8] text-[#5d5f5f] px-6 md:px-8 pb-6 m-0">
        {answer}
      </p>
    </div>
  </div>
);

/* ── FAQ Section ── */
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="mt-5 border-2 border-black bg-white">
      {/* Header bar */}
      <div className="border-b-2 border-black px-6 md:px-8 py-3.5 flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
          Frequently Asked Questions
        </span>
        <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
          {FAQS.length} Questions
        </span>
      </div>

      {/* Two-column split on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-black">
        {[FAQS.slice(0, 4), FAQS.slice(4)].map((group, col) => (
          <div key={col} className={col === 1 ? 'border-t-2 md:border-t-0 border-black' : ''}>
            {group.map((faq, idx) => {
              const globalIdx = col * 4 + idx;
              return (
                <FaqItem
                  key={globalIdx}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === globalIdx}
                  onToggle={() => toggle(globalIdx)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── Page ── */
const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-16 pt-14 md:pt-20 pb-24">

        {/* ── HERO ── */}
        <section className="mb-16">
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 border border-black">
            <span className="w-2 h-2 rounded-full bg-black inline-block" />
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
              Our Capabilities
            </span>
          </div>

          <h1 className="font-['Syne'] text-[clamp(32px,5vw,68px)] leading-[1] tracking-[-0.03em] font-extrabold text-black uppercase m-0 mb-6">
            Websites Built for{' '}
            <span className="italic text-transparent" style={{ WebkitTextStroke: '2px black' }}>
              Growth
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-t-2 border-black pt-6">
            <p className="font-['Geist'] text-[15px] leading-[1.7] text-[#5d5f5f] max-w-md m-0">
              We design and develop custom websites, web apps, and digital platforms that look sharp,
              load fast, and help your business win better customers.
            </p>
            <Link
              to="/contact-us"
              className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-black border-b-2 border-black pb-0.5 hover:opacity-50 transition-opacity whitespace-nowrap self-start md:self-auto"
            >
              Start a Project →
            </Link>
          </div>
        </section>

        {/* ── SERVICE CARDS ── */}
        <div className="flex flex-col gap-5">
          {SERVICES.map((svc) => (
            <section key={svc.index} className="border-2 border-black bg-white">
              <div className="border-b-2 border-black px-6 md:px-8 py-3.5 flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                  {svc.subtitle}
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
                  {svc.index} / {String(SERVICES.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-56 lg:w-64 flex-shrink-0 bg-black text-white p-6 md:p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-black">
                  <div>
                    <span className="font-['Syne'] text-[64px] leading-none opacity-15 font-extrabold block select-none">
                      {svc.index}
                    </span>
                    <h2 className="font-['Syne'] text-[28px] md:text-[34px] leading-[1.1] font-bold uppercase m-0 text-white mt-2">
                      {svc.title}
                    </h2>
                  </div>
                  <span
                    className="material-symbols-outlined text-[28px] opacity-50 mt-6"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {svc.icon}
                  </span>
                </div>

                <div className="flex-1 px-6 md:px-8 py-6 md:py-8 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {svc.pillars.map((p) => (
                      <div key={p.name} className="space-y-2">
                        <h3 className="font-['Syne'] text-[15px] font-bold uppercase text-black m-0 tracking-wide">
                          {p.name}
                        </h3>
                        <p className="text-[#5d5f5f] font-['Geist'] text-[14px] leading-[1.7] m-0">
                          {p.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-black px-3 py-1 font-['JetBrains_Mono'] text-[11px] font-medium bg-[#f4f3f3] text-black uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ── FAQ ── */}
        <FaqSection />

        {/* ── CTA ── */}
        <section className="mt-5 border-2 border-black bg-black text-white px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-white/50 m-0 mb-3">
              Ready to Begin?
            </p>
            <h2 className="font-['Syne'] text-[clamp(24px,3.5vw,44px)] leading-[1.1] font-bold uppercase text-white m-0">
              Let's Build Something Great
            </h2>
            <p className="font-['Geist'] text-[14px] leading-[1.7] text-white/60 mt-4 m-0 max-w-md">
              Share your idea, goals, or current website problem. We'll help turn it into a clear plan and a polished web experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact-us"
              className="bg-white text-black px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 tracking-widest whitespace-nowrap"
            >
              Contact Us
            </Link>
            <Link
              to="/work"
              className="bg-transparent text-white px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase border-2 border-white/30 hover:border-white transition-all duration-300 tracking-widest whitespace-nowrap"
            >
              See Our Work
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Services;
