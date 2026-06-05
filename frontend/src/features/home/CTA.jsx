import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-[#f4f3f3] border-y-2 border-black">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-20 md:py-32 text-center flex flex-col items-center box-border">

        {/* EYEBROW */}
        <div className="font-['JetBrains_Mono'] text-[11px] font-medium mb-7 tracking-[0.4em] uppercase text-[#5d5f5f]">
          Ready to build your website?
        </div>

        {/* HEADLINE */}
        <h2 className="font-['Syne'] text-[clamp(28px,5vw,64px)] leading-[1.1] tracking-[-0.02em] font-bold uppercase text-black max-w-[820px] mb-12">
          TELL US WHAT YOU WANT TO BUILD.
        </h2>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto justify-center">
          <Link to="/start-project" className="w-full md:w-auto bg-black text-white px-12 py-5 border-2 border-black font-['JetBrains_Mono'] text-[12px] font-medium uppercase cursor-pointer tracking-[0.08em] transition-colors duration-200 hover:bg-[#f4f3f3] hover:text-black">
            Start Your Project
          </Link>
          <Link to="/contact-us" className="w-full md:w-auto bg-transparent text-black px-12 py-5 border-2 border-black font-['JetBrains_Mono'] text-[12px] font-medium uppercase cursor-pointer tracking-[0.08em] transition-colors duration-200 hover:bg-black hover:text-white">
            Talk to Us
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CTA;
