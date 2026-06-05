import { motion } from "framer-motion";

const services = [
  {
    title: "Custom Websites",
    icon: "language",
    code: "WEB",
  },
  {
    title: "Brand Systems",
    icon: "draw",
    code: "BRD",
  },
  {
    title: "Landing Pages",
    icon: "rocket_launch",
    code: "LP",
  },
  {
    title: "Web Apps",
    icon: "code_blocks",
    code: "APP",
  },
  {
    title: "SEO Foundations",
    icon: "query_stats",
    code: "SEO",
  },
  {
    title: "Launch Support",
    icon: "verified",
    code: "OPS",
  },
  {
    title: "UX Direction",
    icon: "conversion_path",
    code: "UX",
  },
  {
    title: "Fast Frontends",
    icon: "speed",
    code: "PERF",
  },
];

const HomeMarquee = () => {
  const repeated = [...services, ...services];
  const reversed = [...services].reverse();
  const repeatedReverse = [...reversed, ...reversed];

  return (
    <section className="relative overflow-hidden border-y-2 border-black bg-[#faf9f9]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(90deg,_black_1px,_transparent_1px),linear-gradient(180deg,_black_1px,_transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 md:px-16 py-8 md:py-10">
        <div className="mb-6 grid grid-cols-1 gap-4 border-b-2 border-black pb-6 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-8">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.22em] text-[#5d5f5f]">
              Capabilities
            </span>
            <h2 className="mt-3 font-['Syne'] text-[clamp(28px,4vw,56px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-black">
              Built to move
            </h2>
          </div>

          <p className="max-w-[500px] font-['Geist'] text-[15px] leading-[1.6] text-[#5d5f5f] md:pb-1">
            Strategy, interface, engineering, and launch systems moving together
            with one accountable studio.
          </p>

          <div className="hidden h-14 w-14 items-center justify-center border-2 border-black bg-black text-white md:flex">
            <span className="material-symbols-outlined text-[28px]">
              auto_awesome
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#faf9f9] to-transparent md:w-28" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#faf9f9] to-transparent md:w-28" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex w-max items-stretch"
          >
            {repeated.map((service, index) => (
              <div
                key={`${service.title}-primary-${index}`}
                className="group flex min-w-[280px] items-center gap-5 border-r-2 border-black px-5 py-5 transition-colors duration-300 hover:bg-black md:min-w-[360px] md:px-8"
              >
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.18em] text-[#5d5f5f] transition-colors duration-300 group-hover:text-white/60">
                  {String((index % services.length) + 1).padStart(2, "0")}
                </span>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-white text-black transition-colors duration-300 group-hover:border-white group-hover:bg-black group-hover:text-white">
                  <span className="material-symbols-outlined text-[23px]">
                    {service.icon}
                  </span>
                </span>

                <div className="min-w-0">
                  <span className="block font-['Syne'] text-[24px] font-extrabold uppercase leading-none tracking-[-0.03em] text-black transition-colors duration-300 group-hover:text-white md:text-[34px]">
                    {service.title}
                  </span>
                  <span className="mt-2 block font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#5d5f5f] transition-colors duration-300 group-hover:text-white/60">
                    {service.code}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="flex w-max items-center border-t-2 border-black"
          >
            {repeatedReverse.map((service, index) => (
              <div
                key={`${service.title}-secondary-${index}`}
                className="flex items-center gap-4 border-r-2 border-black px-6 py-3"
              >
                <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.22em] text-[#5d5f5f]">
                  {service.code}
                </span>
                <span className="h-2 w-2 bg-black" />
                <span className="font-['Syne'] text-[16px] font-bold uppercase tracking-[-0.01em] text-black md:text-[20px]">
                  {service.title}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeMarquee;
