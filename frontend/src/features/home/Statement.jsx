const Statement = () => {
  return (
    <section className="bg-black text-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-32 box-border">

        <h2 className="font-['Syne'] text-[clamp(28px,5vw,64px)] leading-[1.1] tracking-[-0.02em] font-bold uppercase text-white mb-8 md:mb-8 m-0">
          STRATEGY, DESIGN, AND DEVELOPMENT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-[#858383] pt-8 items-start">

          <p className="font-['Geist'] text-[18px] leading-[1.6] font-normal text-[#858383] m-0">
            We turn rough ideas into clear websites with thoughtful structure,
            polished interfaces, fast performance, and launch-ready development.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'Planning', value: 'CLEAR' },
              { label: 'Interface', value: 'PRECISE' },
              { label: 'Launch', value: 'READY' },
            ].map(({ label, value }) => (
              <div key={label} className="border-t border-[#858383] pt-5">
                <span className="block font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-[0.18em] text-[#858383] mb-3">
                  {label}
                </span>
                <span className="font-['Syne'] text-[30px] font-bold uppercase text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Statement;
