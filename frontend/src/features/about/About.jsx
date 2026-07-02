import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import lionImg from "../../assets/Lion.jpg";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pillars = [
    {
      title: "Zero-Latency",
      subtitle: "We optimize for the microsecond. Our codebases aren't just functional; they're surgically efficient."
    },
    {
      title: "Brutalist Design",
      subtitle: "Stripping away the noise. We build digital structures that are bold, functional, and unapologetic."
    },
    {
      title: "Deep Logic",
      subtitle: "Beyond CRUD apps. We engineer proprietary algorithms that solve actual business friction."
    },
    {
      title: "Borderless",
      subtitle: "Infrastructure built for a planetary scale. High availability, anywhere on the grid."
    }
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
              Technical Manifesto // VTRC
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-['Syne'] text-[clamp(32px,5vw,68px)] leading-[1] tracking-[-0.03em] font-extrabold text-black uppercase m-0 mb-6">
            Kill the <br />
            <span className="italic text-transparent" style={{ WebkitTextStroke: '2px black' }}>
              Ordinary.
            </span>
          </h1>

          {/* Divider row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-t-2 border-black pt-6">
            <p className="font-['Geist'] text-[15px] leading-[1.7] text-[#5d5f5f] max-w-md m-0">
              Most firms sell "digital transformation" as a buzzword. We treat it as a high-stakes engineering problem. VTRC was founded because the web got boring—cluttered with templates and slow-moving logic.
            </p>
            <div className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest text-black bg-white px-4 py-2 border-2 border-black self-start md:self-auto">
              Status: Operational
            </div>
          </div>
        </section>

        {/* ── ENGINEERING PILLARS ── */}
        <section className="mb-16 border-2 border-black bg-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px]">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="px-6 md:px-8 py-8 flex flex-col gap-3 bg-white"
            >
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-black uppercase tracking-widest">
                // 0{i + 1}
              </span>
              <h3 className="font-['Syne'] text-[24px] font-bold text-black uppercase m-0 leading-tight">
                {pillar.title}
              </h3>
              <p className="font-['Geist'] text-[14px] leading-[1.6] text-[#5d5f5f] m-0">
                {pillar.subtitle}
              </p>
            </div>
          ))}
        </section>

        {/* ── NARRATIVE SECTION ── */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-black bg-white">
          <div className="p-8 md:p-12 lg:p-16 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-center">
            <h2 className="font-['Syne'] text-[clamp(28px,4vw,48px)] leading-[1.1] font-bold uppercase text-black mb-8">
              The Anti-Agency Philosophy.
            </h2>
            <div className="space-y-6 font-['Geist'] text-[16px] leading-[1.7] text-[#5d5f5f]">
              <p>
                We are a lean collective of elite technical architects. When you work with us, you aren't talking to account managers; you're talking to the people writing the kernels of your next ecosystem.
              </p>
              <p>
                We build digital structures that are bold, functional, and unapologetic. No noise, just pure architectural integrity.
              </p>
            </div>

            <div className="mt-12 inline-flex items-center gap-5 p-4 border-2 border-black bg-[#faf9f9] w-fit">
              <img
                src={lionImg}
                alt="Founder"
                className="w-14 h-14 object-cover border-2 border-black grayscale"
              />
              <div>
                <h4 className="font-['JetBrains_Mono'] text-black font-bold uppercase tracking-widest text-[12px] m-0 mb-1">
                  VTRC Founders
                </h4>
                <p className="font-['Geist'] text-[#5d5f5f] text-[13px] italic m-0">
                  "We build the tools we wish we had."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#eeeeee] relative overflow-hidden flex items-center justify-center min-h-[300px] lg:min-h-full p-8">
            <h1 className="font-['Syne'] text-[clamp(4rem,8vw,8rem)] text-black font-extrabold uppercase leading-[0.8] text-center opacity-10 select-none">
              VTRC<br/>
              ARCH<br/>
              ITECTS
            </h1>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mt-5 border-2 border-black bg-black text-white px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-white/50 m-0 mb-3">
              Build The Void.
            </p>
            <h2 className="font-['Syne'] text-[clamp(24px,3.5vw,44px)] leading-[1.1] font-bold uppercase text-white m-0">
              Secure Your Slot
            </h2>
            <p className="font-['Geist'] text-[14px] leading-[1.7] text-white/60 mt-4 m-0 max-w-md">
              We are currently accepting high-impact partnerships for the next fiscal quarter.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact-us"
              className="bg-white text-black px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 tracking-widest whitespace-nowrap"
            >
              Contact Strategy Team
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
};

export default About;
