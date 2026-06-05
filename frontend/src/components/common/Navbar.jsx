import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from '../ui/AnimatedLogo';

const navLinks = [
  { label: 'Work', path: '/work' },
  { label: 'Services', path: '/services' },
  { label: 'Careers', path: '/careers' },
  { label: 'Journal', path: '/journal' },
  { label: 'Contact', path: '/contact-us' },
];

/* ── Navbar ────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── MAIN NAVBAR ───────────────────────────────────── */}
      <nav className="w-full sticky top-0 bg-[#faf9f9] border-b-2 border-black z-50">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-5 md:px-16 py-3 box-border">

          {/* LOGO */}
          <Link to="/" className="flex items-center no-underline">
            <AnimatedLogo size="md" />
          </Link>

          {/* DESKTOP NAV LINKS — hidden on mobile */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`font-['JetBrains_Mono'] text-[12px] no-underline pb-[3px] transition-colors duration-200 border-b-2 ${isActive ? 'font-bold text-black border-black' : 'font-medium text-[#5d5f5f] border-transparent hover:text-black'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* Start a Project — hidden on mobile, shown on desktop */}
            <div className="hidden lg:block ml-4">
              <Link
                to="/start-project"
                className="bg-black text-white px-8 py-3 font-['JetBrains_Mono'] text-[14px] font-bold uppercase tracking-widest border-2 border-black hover:bg-[#faf9f9] hover:text-black transition-colors duration-300 no-underline inline-block text-center"
              >
                Start a Project
              </Link>
            </div>

            {/* MOBILE BURGER — ONLY visible on mobile (md:hidden) */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-[5px] bg-transparent border-2 border-black cursor-pointer px-2 py-1.5 z-[210] relative"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-[20px] h-[2px] bg-black transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`} />
              <span className={`block w-[20px] h-[2px] bg-black transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-[20px] h-[2px] bg-black transition-all duration-300 ${mobileOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#faf9f9] z-[200] flex flex-col justify-center items-center gap-8 overflow-y-auto"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeMobile}
              className="absolute top-3 right-8 bg-transparent border-none text-[32px] cursor-pointer text-black font-['Syne'] leading-none"
              aria-label="Close menu"
            >
              ×
            </button>

            {/* LOGO IN MOBILE MENU */}
            <div className="absolute top-4 left-5 flex items-center gap-2">
              <AnimatedLogo size="sm" />
              <span className="font-['Syne'] text-[18px] font-bold text-black">
                VTRC
              </span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={closeMobile}
                className="text-[36px] font-bold font-['Syne'] text-[#1a1c1c] no-underline tracking-[-0.02em] transition-colors duration-200 hover:text-[#5d5f5f]"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Initiate Project Button */}
            <div className="absolute bottom-8 w-full px-5 text-center">
              <Link
                to="/start-project"
                onClick={closeMobile}
                className="block w-full bg-black text-white py-4 font-['JetBrains_Mono'] text-[16px] font-bold uppercase tracking-widest border-2 border-black hover:bg-[#faf9f9] hover:text-black transition-colors duration-300 no-underline"
              >
                Initiate Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;