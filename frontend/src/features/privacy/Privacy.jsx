import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-12 md:pt-24 pb-24">
        
        {/* ── HERO SECTION ── */}
        <section className="mb-24">
          <h1 className="font-['Syne'] text-[clamp(40px,8vw,120px)] leading-[0.9] tracking-[-0.04em] font-extrabold text-black mb-12 break-words m-0 uppercase">
            PRIVACY POLICY
          </h1>
          <div className="grid grid-cols-12 gap-6 border-t-2 border-black pt-8">
            <div className="col-span-12 md:col-span-8">
              <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] max-w-2xl m-0">
                At VTRC TECHNOLOGIES, we prioritize the security and confidentiality of your data. This policy outlines how we collect, use, and protect your information as we engineer the infrastructure of the next century.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex justify-start md:justify-end items-end mt-4 md:mt-0">
              <div className="font-['JetBrains_Mono'] text-[12px] font-medium text-black border border-black px-4 py-2 uppercase tracking-widest">
                Effective: May 2024
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-8 space-y-16">
            
            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">01. Information Collection</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                We collect information that you provide directly to us when you inquire about our services, apply for a position, or communicate with us. This may include your name, email address, company details, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">02. Use of Information</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                The information we collect is used to provide, maintain, and improve our services, to communicate with you about projects, and to process applications. We may also use information to monitor and analyze trends and usage in connection with our website.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">03. Data Security</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                We implement robust technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. Our infrastructure is built with security as a core principle, ensuring your data remains resilient.
              </p>
            </section>

            <section>
              <h2 className="font-['Syne'] text-[32px] font-bold text-black mb-6 uppercase">04. Third-Party Services</h2>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f]">
                We do not sell your personal data. We may share information with trusted third-party service providers who perform services on our behalf, such as cloud hosting or analytics, subject to strict confidentiality agreements.
              </p>
            </section>

          </div>

          <aside className="md:col-span-4">
            <div className="border-2 border-black p-8 bg-black text-white sticky top-24">
              <h3 className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase opacity-60 mb-6 flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Questions?
              </h3>
              <p className="font-['Geist'] text-[16px] leading-[1.6] mb-8 opacity-80">
                If you have any questions regarding our privacy practices or your data, please contact our legal team.
              </p>
              <a 
                href="mailto:legal@vtrc.tech" 
                className="font-['Syne'] text-[20px] font-bold text-white no-underline hover:underline flex items-center gap-2 group"
              >
                LEGAL@VTRC.TECH 
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-[20px]">north_east</span>
              </a>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
};

export default Privacy;
