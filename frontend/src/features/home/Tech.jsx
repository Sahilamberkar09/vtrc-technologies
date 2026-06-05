import React from "react";
import {
  SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiTailwindcss, SiDocker, SiKubernetes,
  SiPostgresql, SiTypescript, SiNextdotjs, SiGraphql,
} from "react-icons/si";
import { BsAmazon } from "react-icons/bs";
import { motion } from "framer-motion";

const techs = [
  { name: "React",      icon: <SiReact />,      color: "group-hover:text-white" },
  { name: "Next.js",    icon: <SiNextdotjs />,  color: "group-hover:text-white" },
  { name: "TypeScript", icon: <SiTypescript />, color: "group-hover:text-white" },
  { name: "Node.js",    icon: <SiNodedotjs />,  color: "group-hover:text-white" },
  { name: "MongoDB",    icon: <SiMongodb />,    color: "group-hover:text-white" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "group-hover:text-white" },
  { name: "Docker",     icon: <SiDocker />,     color: "group-hover:text-white" },
  { name: "Kubernetes", icon: <SiKubernetes />, color: "group-hover:text-white" },
  { name: "AWS",        icon: <BsAmazon />,     color: "group-hover:text-white" },
  { name: "GraphQL",    icon: <SiGraphql />,    color: "group-hover:text-white" },
  { name: "Tailwind",   icon: <SiTailwindcss />,color: "group-hover:text-white" },
  { name: "Express",    icon: <SiExpress />,    color: "group-hover:text-white" },
];

const scrollItems = [...techs, ...techs];

const Tech = () => {
  return (
    <section
      id="solutions"
      className="t-section-alt py-24 overflow-hidden border-y border-[#3B82F6]/08"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-[1px] bg-white rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white">
                02 — Technology Stack
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-light t-text-muted"
            >
              Powered by enterprise-grade tools.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Scrolling strip */}
        <div className="flex whitespace-nowrap animate-scroll py-4">
          {scrollItems.map((tech, index) => (
            <div
              key={index}
              className={`group flex items-center gap-4 px-10 py-5 mx-3 border rounded-xl
                transition-all duration-300 cursor-default t-card
                hover:border-[#3B82F6]/30`}
              style={{
                background: 'var(--tech-item-bg)',
                borderColor: 'var(--tech-item-border)',
              }}
            >
              <span className={`text-3xl transition-colors duration-300 t-text-subtle ${tech.color}`}>
                {tech.icon}
              </span>
              <span className="text-base font-medium tracking-tight t-text-muted group-hover:t-text transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Edge fades — match section bg */}
        <div className="absolute inset-y-0 left-0 w-32 t-fade-left z-10" />
        <div className="absolute inset-y-0 right-0 w-32 t-fade-right z-10" />
      </div>
    </section>
  );
};

export default Tech;
