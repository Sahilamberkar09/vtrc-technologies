import React from 'react';
import { motion } from 'framer-motion';

/**
 * LogoAnimation — theme-aware black/white SVG line-draw animation.
 * color prop drives all strokes; accent uses a darker monochrome node color.
 */
const LogoAnimation = ({ className = "w-12 h-12", color = "#000000", isBackground = false }) => {
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 1,
        },
        opacity: { duration: 0.5 },
      },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        delay: 1.5 + i * 0.2,
        duration: 0.8,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 2,
      },
    }),
  };

  // In black-on-white theme: primary strokes = color (black), accent = #444
  const accent = color === '#000000' || color === '#1a1c1c' ? '#444444' : '#93C5FD';
  const accentLight = color === '#000000' || color === '#1a1c1c' ? '#888888' : '#93C5FD';

  return (
    <div className={`relative flex items-center justify-center group ${className}`}>
      <motion.svg
        viewBox="0 0 56 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial="hidden"
        animate="visible"
      >
        {/* Main Body — V shape */}
        <motion.polygon
          points="0,4 10,4 18,36 8,36"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
        />

        {/* Top bar */}
        <motion.line
          x1="0" y1="4" x2="18" y2="4"
          stroke={color} strokeWidth="1.5" strokeLinecap="round"
          variants={drawVariants}
        />
        {/* Mid detail lines */}
        <motion.line
          x1="5" y1="12" x2="13" y2="12"
          stroke={color} strokeWidth="0.8" strokeLinecap="round"
          variants={drawVariants}
        />
        <motion.line
          x1="8" y1="22" x2="16" y2="22"
          stroke={color} strokeWidth="0.8" strokeLinecap="round"
          variants={drawVariants}
        />

        {/* Tech shape (Right side) */}
        <motion.path
          d="M18 36 L28 10 L44 2 L40 14 L30 18 L26 30 Z"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
        />

        {/* Network connecting lines */}
        <motion.line
          x1="28" y1="10" x2="44" y2="2"
          stroke={accent} strokeWidth="0.8" strokeDasharray="3,2"
          variants={drawVariants}
        />
        <motion.line
          x1="44" y1="2" x2="40" y2="14"
          stroke={accent} strokeWidth="0.8"
          variants={drawVariants}
        />
        <motion.line
          x1="40" y1="14" x2="30" y2="18"
          stroke={accentLight} strokeWidth="0.8"
          variants={drawVariants}
        />

        {/* Nodes */}
        <motion.circle cx="28" cy="10" r="2.2" fill={accent} variants={nodeVariants} custom={0} />
        <motion.circle cx="44" cy="2"  r="2.2" fill={accentLight} variants={nodeVariants} custom={1} />
        <motion.circle cx="40" cy="14" r="1.8" fill={accent} variants={nodeVariants} custom={2} />
      </motion.svg>
    </div>
  );
};

export default LogoAnimation;
