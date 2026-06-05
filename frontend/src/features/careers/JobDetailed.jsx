import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const JobDetailed = () => {
  const { role } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJob();
  }, [role]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/careers/${role}`);
      if (response.data.success) {
        setJob(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch job details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#faf9f9] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest">
            LOADING POSITION DETAILS...
          </p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="bg-[#faf9f9] min-h-screen flex items-center justify-center p-5">
        <div className="text-center max-w-md border-2 border-black p-12">
          <h1 className="font-['Syne'] text-[32px] font-black mb-4 uppercase">
            Position Not Found
          </h1>
          <p className="font-['Geist'] text-[16px] text-[#5d5f5f] mb-8 uppercase font-bold">
            The requested position has been filled or is no longer available.
          </p>
          <Link
            to="/careers"
            className="inline-block bg-black text-white px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase no-underline"
          >
            Return to Careers
          </Link>
        </div>
      </main>
    );
  }

  // Format the jobTitle for display split
  const jobTitleWords = job.jobTitle.split(" ");
  const word1 = jobTitleWords[0];
  const word2 = jobTitleWords.slice(1).join(" ");

  return (
    <main className="bg-white text-[#1a1c1c] min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-16 md:pt-24 pb-24">
        {/* ── HERO SECTION ── */}
        <header className="mb-20">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#5d5f5f] hover:text-black mb-8 transition-colors no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to Careers
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-2">
              <div className="mb-8">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wide ${job.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {job.isOpen ? "✓ Open Position" : "Position Closed"}
                </span>
              </div>
              <h1 className="font-['Syne'] text-[56px] md:text-[72px] font-bold leading-[1.1] text-black mb-6">
                {job.jobTitle}
              </h1>
              <p className="font-['Geist'] text-[18px] text-[#5d5f5f] leading-[1.6]">
                {job.description}
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-[#f8f7f7] p-8 rounded-lg">
              <h3 className="font-bold text-[12px] uppercase text-[#5d5f5f] mb-6 tracking-wide">
                Quick Info
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[12px] font-medium text-[#5d5f5f] uppercase tracking-wide mb-2">
                    Department
                  </p>
                  <p className="font-['Syne'] text-[18px] font-bold">
                    {job.department}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#5d5f5f] uppercase tracking-wide mb-2">
                    Employment Type
                  </p>
                  <p className="font-['Syne'] text-[18px] font-bold">
                    {job.jobType}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#5d5f5f] uppercase tracking-wide mb-2">
                    Location
                  </p>
                  <p className="font-['Syne'] text-[18px] font-bold">
                    {job.location}
                  </p>
                </div>
                {job.salaryRange && (
                  <div>
                    <p className="text-[12px] font-medium text-[#5d5f5f] uppercase tracking-wide mb-2">
                      Salary Range
                    </p>
                    <p className="font-['Syne'] text-[18px] font-bold">
                      {job.salaryRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── REQUIREMENTS SECTION ── */}
        <section className="mb-20 pb-20 border-b border-black/10">
          <h2 className="font-['Syne'] text-[40px] font-bold mb-12 uppercase">
            What We're Looking For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {job.requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1">
                  <span className="text-white text-[12px] font-bold">✓</span>
                </div>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f]">
                  {req}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BENEFITS SECTION ── */}
        <section className="mb-20 pb-20 border-b border-black/10">
          <h2 className="font-['Syne'] text-[40px] font-bold mb-12 uppercase">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {job.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#f8f7f7] rounded-lg hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
              >
                <h4 className="font-['Syne'] text-[18px] font-bold uppercase mb-3">
                  {benefit}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* ── APPLICATION SECTION ── */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Process */}
            <div>
              <h2 className="font-['Syne'] text-[40px] font-bold mb-8 uppercase">
                Application Process
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold text-[14px]">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] mb-2 uppercase">
                      Submit Your Application
                    </h4>
                    <p className="text-[14px] text-[#5d5f5f]">
                      Share your portfolio and tell us why you're excited about
                      this role.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold text-[14px]">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] mb-2 uppercase">
                      Review & Interview
                    </h4>
                    <p className="text-[14px] text-[#5d5f5f]">
                      We'll review your work and schedule a technical
                      conversation if it's a fit.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold text-[14px]">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] mb-2 uppercase">
                      Join the Team
                    </h4>
                    <p className="text-[14px] text-[#5d5f5f]">
                      If we're both excited, we'll make you an offer and bring
                      you on board.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col justify-center">
              <div className="bg-black text-white p-12 rounded-lg">
                <h3 className="font-['Syne'] text-[28px] font-bold mb-4 uppercase">
                  Ready to Apply?
                </h3>
                <p className="font-['Geist'] text-[16px] leading-[1.6] text-white/80 mb-8">
                  We'd love to hear from you. Submit your application and let's
                  start building something amazing together.
                </p>
                <Link
                  to={`/application?jobId=${job._id}&role=${encodeURIComponent(job.jobTitle)}`}
                  className={`inline-block w-full text-center px-8 py-4 rounded-lg font-['Syne'] text-[16px] font-bold uppercase transition-all duration-300 no-underline ${
                    job.isOpen
                      ? "bg-white text-black hover:bg-[#f8f7f7]"
                      : "bg-gray-600 text-white cursor-not-allowed"
                  }`}
                >
                  {job.isOpen ? "Start Application" : "Position Closed"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CULTURE SECTION ── */}
        <section className="mb-0">
          <h2 className="font-['Syne'] text-[40px] font-bold mb-12 uppercase">
            About Working with Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f] mb-6">
                VTRC Technologies is more than just a workplace. We're a team of
                passionate professionals dedicated to crafting exceptional
                digital experiences. We believe in collaboration, continuous
                learning, and supporting each other's growth.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                  <span className="text-[16px] text-[#5d5f5f]">
                    Supportive and inclusive culture
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                  <span className="text-[16px] text-[#5d5f5f]">
                    Opportunities for professional growth
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                  <span className="text-[16px] text-[#5d5f5f]">
                    Work-life balance
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                  <span className="text-[16px] text-[#5d5f5f]">
                    Exciting projects with great clients
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-[#f8f7f7] rounded-lg aspect-square overflow-hidden">
              <img
                alt="Team Culture"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Y_h21gegpC9ojcfKniYH-jwqyFAlGbCoCNMM41_RICs7Z8XcydDmZvSZUwamCaej1WjPl2yN5035hWNyh5Ijnm8h_jYuLBm3NYpaqfEAWqOTYRRO5ZmTXBoMgJ1wUwnUSe3Qg8Ka-YSs-aAH70jCpc75LaGIWiiRZjvv6RY-M7IA0EFB-esCd_ptRrABWfnG6ZFVDHPkatPl7HR0r9GZgA4Ss9Qk6Un-lb27Fa2gfnjb8OYnJZsqOpxiL1FMfFJrxTHFSNSr8g"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default JobDetailed;
