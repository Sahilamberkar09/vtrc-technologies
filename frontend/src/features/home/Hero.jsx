import React from "react";

const Hero = () => {
  return (
    <section className="bg-[#faf9f9] flex flex-col justify-center md:min-h-[calc(100vh-72px)]">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-12 md:py-20 flex flex-col items-start justify-center">

        {/* ESTABLISHED BADGE */}
        <div className="mb-6 px-4 py-1 bg-black text-white inline-block font-['JetBrains_Mono'] text-[11px] font-medium tracking-[0.05em] uppercase">
          ESTABLISHED 2026
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="font-['Syne'] text-[clamp(36px,11vw,120px)] leading-[0.9] tracking-[-0.04em] font-extrabold uppercase text-black mb-12 max-w-full break-words">
          WE BUILD FOR PERMANENCE
        </h1>

        {/* DIVIDER + SUB-ROW */}
        <div className="w-full border-t-2 border-black pt-8 flex items-start justify-between gap-8 flex-wrap">

          <p className="font-['Geist'] text-[18px] leading-[1.6] font-normal text-[#5d5f5f] max-w-[560px] m-0">
            Engineering digital infrastructure that defies obsolescence. We don't
            chase trends; we establish standards. Our architectural rigor ensures
            your systems remain operational while others crumble.
          </p>

          {/* SCROLL CUE */}
          <div className="flex items-center gap-[10px] shrink-0 self-end">
            <span className="material-symbols-outlined text-[32px] text-black">
              arrow_downward
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.25em] text-[#1a1c1c] whitespace-nowrap">
              Scroll to explore
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;