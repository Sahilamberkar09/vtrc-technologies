import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCode,
  FiLayout,
  FiSearch,
  FiSettings,
} from "react-icons/fi";

const services = [
  {
    icon: FiLayout,
    title: "Website Design",
    code: "DESIGN",
    text: "Clear page structure, polished UI direction, brand consistency, and responsive layouts.",
    scope: ["Wireframes", "Visual systems", "Responsive UI"],
    outcome: "Interfaces that feel intentional from the first fold to the final form.",
  },
  {
    icon: FiCode,
    title: "Development",
    code: "BUILD",
    text: "Frontend builds, backend integrations, dashboards, CMS publishing, analytics, and deployment.",
    scope: ["React", "CMS", "Deployment"],
    outcome: "Fast, maintainable builds that are ready for real users and real teams.",
  },
  {
    icon: FiSearch,
    title: "Visibility",
    code: "GROWTH",
    text: "SEO foundations, fast loading, metadata, semantic markup, and share-ready pages.",
    scope: ["Technical SEO", "Performance", "Analytics"],
    outcome: "A technical base that helps people find, understand, and trust the site.",
  },
  {
    icon: FiSettings,
    title: "Care",
    code: "SUPPORT",
    text: "Post-launch updates, improvements, technical support, and long-term site growth.",
    scope: ["Updates", "Monitoring", "Iteration"],
    outcome: "A site that keeps improving after launch instead of quietly collecting dust.",
  },
];

const HomeServices = () => {
  return (
    <section className="relative overflow-hidden border-y-2 border-black bg-[#faf9f9]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[linear-gradient(90deg,_black_1px,_transparent_1px),linear-gradient(180deg,_black_1px,_transparent_1px)] bg-[size:88px_88px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 border-b-2 border-black pb-10 lg:grid-cols-[1fr_420px] lg:items-end lg:gap-16 lg:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-[0.22em] text-[#5d5f5f] mb-5">
              What we build
            </p>
            <h2 className="font-['Syne'] text-[clamp(34px,5vw,72px)] leading-[0.98] tracking-[-0.03em] font-extrabold uppercase text-black m-0">
              A complete web presence, not a pile of screens.
            </h2>
            <p className="mt-7 max-w-[600px] font-['Geist'] text-[17px] leading-[1.7] text-[#5d5f5f]">
              We shape the whole system: the first impression, the build behind
              it, the way people find it, and the care that keeps it useful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="border-2 border-black bg-white"
          >
            <div className="border-b-2 border-black p-5">
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.22em] text-[#5d5f5f]">
                Service model
              </span>
              <p className="mt-5 font-['Syne'] text-[30px] font-extrabold uppercase leading-none tracking-[-0.03em] text-black">
                Plan. Build. Launch. Improve.
              </p>
            </div>
            <div className="grid grid-cols-3">
              {["Strategy", "Interface", "Code"].map((item) => (
                <span
                  key={item}
                  className="border-r-2 border-black px-4 py-4 text-center font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.16em] text-black last:border-r-0"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 border-b-2 border-black lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            const number = String(index + 1).padStart(2, "0");
            const isDark = index === 0 || index === 3;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className={`group relative min-h-[460px] overflow-hidden border-t-2 border-black p-6 md:p-8 lg:p-10 ${
                  index % 2 === 0 ? "lg:border-r-2" : ""
                } ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
              >
                <span
                  className={`pointer-events-none absolute -right-3 -top-5 font-['Syne'] text-[118px] font-extrabold leading-none tracking-[-0.08em] ${
                    isDark ? "text-white/10" : "text-black/[0.06]"
                  } md:text-[160px]`}
                >
                  {number}
                </span>

                <div className="relative flex h-full flex-col">
                  <div className="mb-12 flex items-start justify-between gap-5">
                    <div
                      className={`flex h-14 w-14 items-center justify-center border-2 ${
                        isDark
                          ? "border-white bg-white text-black"
                          : "border-black bg-black text-white"
                      }`}
                    >
                    <Icon size={20} />
                    </div>
                    <div className="text-right">
                      <span
                        className={`block font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.22em] ${
                          isDark ? "text-white/60" : "text-[#5d5f5f]"
                        }`}
                      >
                        {number} / {service.code}
                      </span>
                      <FiArrowUpRight
                        className="ml-auto mt-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        size={20}
                      />
                    </div>
                  </div>

                  <h3 className="max-w-[680px] font-['Syne'] text-[clamp(38px,5vw,76px)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
                    {service.title}
                  </h3>

                  <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.95fr]">
                    <p
                      className={`font-['Geist'] text-[16px] leading-[1.75] ${
                        isDark ? "text-white/68" : "text-[#5d5f5f]"
                      }`}
                    >
                      {service.text}
                    </p>
                    <p
                      className={`border-t-2 pt-5 font-['Geist'] text-[15px] leading-[1.7] ${
                        isDark
                          ? "border-white/35 text-white/76"
                          : "border-black text-[#1a1c1c]"
                      }`}
                    >
                      {service.outcome}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-10">
                    {service.scope.map((item) => (
                      <span
                        key={item}
                        className={`border-2 px-3 py-2 font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isDark
                            ? "border-white text-white"
                            : "border-black bg-[#faf9f9] text-black"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
