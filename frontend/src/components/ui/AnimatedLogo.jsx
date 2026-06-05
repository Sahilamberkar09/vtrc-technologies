import React, { useState } from "react";
import { motion } from "framer-motion";

const VTRC_LETTERS = ["V", "T", "R", "C"];

/**
 * AnimatedLogo
 * On hover: image slides up & fades out, "VTRC" letters rise letter-by-letter from below.
 * On mouse-leave: reverses smoothly.
 *
 * size: 'sm' | 'md' (default 'md')
 * inverted: true → white letters (for dark backgrounds e.g. quotation PDF header)
 */
const AnimatedLogo = ({
  size = "md",
  inverted = false,
  forceHover = false,
}) => {
  const [isHovered, setHovered] = useState(false);
  const hovered = forceHover || isHovered;

  const containerWidth = size === "sm" ? 80 : 100;
  const containerHeight = size === "sm" ? 30 : 36;
  const imgSize =
    size === "sm" ? { width: 50, height: 30 } : { width: 60, height: 36 };
  const fontSize = size === "sm" ? 14 : 22;
  const letterColor = inverted ? "#fff" : "#000";

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        /* Generous horizontal and top insets to prevent any letter clipping
           on any browser/fallback-font, while clipping strictly at the bottom
           to keep letters hidden when not hovered */
        clipPath: size === "sm"
          ? "inset(-5px -15px 0 -15px)"
          : "inset(-10px -40px 0 -40px)",
        cursor: "pointer",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE — slides UP on hover */}
      <motion.img
        src="/VTRCLogo.png"
        alt="VTRC Logo"
        style={{
          position: "absolute",
          top: 0,
          left: (containerWidth - imgSize.width) / 2,
          width: imgSize.width,
          height: imgSize.height,
          objectFit: "contain",
        }}
        animate={hovered ? { y: "-110%", opacity: 0 } : { y: "0%", opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* TEXT letters — rise from BELOW on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: size === "sm" ? 3 : 4,
        }}
      >
        {VTRC_LETTERS.map((letter, i) => (
          <motion.span
            key={letter}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize,
              color: letterColor,
              lineHeight: 1,
              display: "block",
              letterSpacing: "0.05em",
            }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: "160%", opacity: 0 }}
            transition={{
              duration: 0.32,
              ease: [0.4, 0, 0.2, 1],
              delay: hovered ? i * 0.055 : (VTRC_LETTERS.length - 1 - i) * 0.04,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedLogo;
