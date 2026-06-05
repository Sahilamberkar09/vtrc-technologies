import { motion } from "framer-motion";

const steps = [
  {
    title: "Discover",
    detail: "Audience, goals, offer, content, and the core action your website needs to drive.",
  },
  {
    title: "Design",
    detail: "Information architecture, visual direction, responsive layouts, and interface states.",
  },
  {
    title: "Develop",
    detail: "Clean components, integrations, performance passes, forms, analytics, and CMS needs.",
  },
  {
    title: "Launch",
    detail: "Testing, deployment, handoff, support, and improvements after real visitors arrive.",
  },
];

const HomeProcess = () => {
  return (
    <section className="bg-black text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] xl:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
          <div>
            <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-[0.22em] text-white/50 mb-5">
              How we move
            </p>
            <h2 className="font-['Syne'] text-[clamp(34px,5vw,72px)] leading-[0.98] tracking-[-0.03em] font-extrabold uppercase text-white m-0">
              From first call to first click.
            </h2>
            <p className="font-['Geist'] text-[17px] leading-[1.65] text-white/60 mt-7 max-w-[520px]">
              The process is structured but not stiff. You get clear decisions,
              visible progress, and a website that arrives with purpose.
            </p>
          </div>

          <div className="relative pt-3">
            <div className="absolute left-[24px] md:left-0 md:right-0 md:top-[48px] h-[calc(100%-24px)] md:h-px w-px md:w-auto bg-white/30" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-3 lg:gap-6">
              {steps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative pl-16 md:pl-0 md:pt-16"
                >
                  <div className="absolute left-0 top-0 md:top-7 xl:top-6 h-10 w-10 xl:h-12 xl:w-12 rounded-full border-2 border-white bg-black flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold">
                    0{index + 1}
                  </div>
                  <h3 className="font-['Syne'] text-[26px] md:text-[18px] lg:text-[22px] xl:text-[28px] font-bold uppercase text-white leading-none m-0 mb-3 md:mb-4 tracking-tight break-words">
                    {step.title}
                  </h3>
                  <p className="font-['Geist'] text-[15px] md:text-[13px] lg:text-[14px] xl:text-[15px] leading-[1.6] text-white/60 m-0">
                    {step.detail}
                  </p>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block mt-14 h-2 origin-left bg-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
