import React, { useState, useEffect } from 'react';
import AnimatedLogo from '../ui/AnimatedLogo';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logoAnimate, setLogoAnimate] = useState(false);

  useEffect(() => {
    // Loop the logo animation
    setLogoAnimate(true);
    const logoInterval = setInterval(() => {
      setLogoAnimate(prev => !prev);
    }, 1500);

    // We want to reach 100% in about 3.0 seconds
    const totalDuration = 3000;
    const intervalTime = 30; // update every 30ms
    const totalSteps = totalDuration / intervalTime; // 100 steps
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setIsFadingOut(true);
        // Wait for CSS transition to finish before completing
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      clearInterval(logoInterval);
    };
  }, [onComplete]);

  return (
    <main 
      className={`fixed inset-0 w-full flex flex-col items-center justify-center bg-[#faf9f9] text-[#1a1c1c] z-[9999] overflow-hidden transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center z-10 gap-12">
        
        {/* Animated Logo Container */}
        <div className="scale-[1.8] sm:scale-[2.2] translate-y-4">
          <AnimatedLogo size="md" forceHover={logoAnimate} />
        </div>

        {/* Progress Counter & Bar */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="font-['Syne'] text-[64px] sm:text-[80px] leading-none font-bold text-black select-none tabular-nums tracking-tighter flex items-baseline">
            {progress}
            <span className="text-[#a0a0a0] text-[32px] sm:text-[40px] ml-2">%</span>
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-[180px] sm:w-[240px] h-[3px] bg-[#e3e2e2] overflow-hidden rounded-full">
            <div 
              className="h-full bg-black transition-all duration-[30ms] ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
      </div>
    </main>
  );
};

export default LoadingScreen;
