import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Improved Hero Animation
 * Fixes:
 * ✅ Perfect center alignment
 * ✅ Smooth enter/exit animation
 * ✅ Better responsive sizing
 * ✅ Stable height (no jumping)
 * ✅ Cleaner stagger effect
 * ✅ Better perspective rotation
 */

const HeroAnimation = () => {
    const [index, setIndex] = useState(0);

    const words = ["Design.", "Develop.", "Dominate."];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    // Parent animation
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.06,
            },
        },
        exit: {
            transition: {
                staggerChildren: 0.04,
                staggerDirection: -1,
            },
        },
    };

    // Letter animation
    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 80,
            rotateX: 90,
            filter: "blur(12px)",
        },

        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },

        exit: {
            opacity: 0,
            y: -60,
            rotateX: -90,
            filter: "blur(10px)",
            transition: {
                duration: 0.45,
                ease: "easeInOut",
            },
        },
    };

    return (
        <>
            <style>
                {`
                .hero-gradient-text {
                    background: linear-gradient(
                        90deg,
                        #ffffff 0%,
                        #d1d5db 50%,
                        #9ca3af 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-perspective {
                    perspective: 1400px;
                }
                `}
            </style>

        <div className="hero-perspective w-full flex items-center justify-center py-8">
            {/* Fixed height prevents layout shift - Adjusted to match large font sizes */}
            <div className="relative h-[80px] sm:h-[120px] md:h-[180px] lg:h-[240px] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={words[index]}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            text-center
                            whitespace-nowrap
                            font-black
                            leading-none
                            tracking-[-0.06em]
                            text-[clamp(4rem,14vw,13rem)]
                            select-none
                        "
                    >
                        {words[index].split("").map((char, i) => (
                            <motion.span
                                key={`${words[index]}-${i}`}
                                variants={letterVariants}
                                className="hero-gradient-text inline-block"
                                style={{
                                    transformOrigin: "bottom center",
                                }}
                            >
                                {char === " "
                                    ? "\u00A0"
                                    : char}
                            </motion.span>
                        ))}
                    </motion.h1>
                </AnimatePresence>
            </div>
        </div>
        </>
    );
};

export default HeroAnimation;