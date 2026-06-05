import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-12 md:pt-24 pb-24">
        
        {/* ── HERO SECTION ── */}
        <section className="mb-24">
          <h1 className="font-['Syne'] text-[clamp(40px,8vw,120px)] leading-[0.9] tracking-[-0.04em] font-extrabold text-black mb-12 break-words m-0 uppercase">
            TERMS OF SERVICE
          </h1>
          <div className="grid grid-cols-12 gap-6 border-t-2 border-black pt-8">
            <div className="col-span-12 md:col-span-8">
              <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] max-w-2xl m-0">
                Welcome to VTRC TECHNOLOGIES. By accessing our website and engaging with our services, you agree to comply with and be bound by the following terms and conditions.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex justify-start md:justify-end items-end mt-4 md:mt-0">
              <div className="font-['JetBrains_Mono'] text-[12px] font-medium text-black border border-black px-4 py-2 uppercase tracking-widest">
                Updated: May 2024
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-8 space-y-16">
            
            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">01. Acceptance of Terms</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                Your access to and use of the VTRC TECHNOLOGIES website is subject exclusively to these Terms and Conditions. You will not use the website for any purpose that is unlawful or prohibited by these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">02. Intellectual Property</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                All copyright, trademarks, and all other intellectual property rights in the website and its content (including without limitation the website design, text, graphics and all software and source codes connected with the website) are owned by or licensed to VTRC TECHNOLOGIES.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">03. Disclaimers and Limitation of Liability</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                The website is provided on an AS IS and AS AVAILABLE basis without any representation or endorsement made and without warranty of any kind whether express or implied. To the extent permitted by law, VTRC TECHNOLOGIES will not be liable for any indirect or consequential loss or damage whatever arising out of or in connection with the use of the website.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">04. Governing Law</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                These Terms and Conditions shall be governed by and construed in accordance with the law of the United States and you hereby submit to the exclusive jurisdiction of the US courts.
              </p>
            </section>

          </div>

          <aside className="md:col-span-4">
            <div className="border-2 border-black p-8 bg-[#f4f3f3] sticky top-24">
              <h3 className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase text-[#5d5f5f] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                Legal Authority
              </h3>
              <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#1a1c1c] mb-8">
                These terms constitute a legally binding agreement between you and VTRC TECHNOLOGIES regarding your use of this platform.
              </p>
              <div className="pt-8 border-t border-black/10">
                <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-tighter text-[#5d5f5f]">
                  VTRC TECHNOLOGIES // INFRASTRUCTURE REGULATION DEPT.
                </p>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
};

export default Terms;
