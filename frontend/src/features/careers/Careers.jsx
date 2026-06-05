import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/careers`);
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch job openings", err);
    } finally {
      setLoading(false);
    }
  };

  const departments = ["All", ...new Set(jobs.map((job) => job.department))];
  const filteredJobs =
    selectedDept === "All"
      ? jobs
      : jobs.filter((job) => job.department === selectedDept);

  return (
    <main className="bg-white text-[#1a1c1c] min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="w-full px-5 md:px-16 pt-16 md:pt-32 pb-12 md:pb-16 border-b border-black/10">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="max-w-3xl">
            <span className="text-[12px] font-medium text-[#5d5f5f] uppercase tracking-widest">
              Join Our Team
            </span>
            <h1 className="font-['Syne'] text-[64px] md:text-[88px] font-bold leading-[0.95] mt-4 mb-6 text-black">
              Let's Build Something Great
            </h1>
            <p className="font-['Geist'] text-[18px] md:text-[20px] leading-[1.6] text-[#5d5f5f]">
              We're looking for creative minds and skilled developers ready to
              craft digital experiences that matter. Join a team that values
              quality, innovation, and collaboration.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24">
        {/* ── VALUES SECTION ── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#f8f7f7] rounded-lg">
              <div className="text-[32px] font-bold text-black mb-4">01</div>
              <h3 className="font-['Syne'] text-[24px] font-bold text-black mb-3 uppercase">
                Craft
              </h3>
              <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f]">
                We prioritize quality and attention to detail in everything we
                build. Excellence is non-negotiable.
              </p>
            </div>
            <div className="p-8 bg-[#f8f7f7] rounded-lg">
              <div className="text-[32px] font-bold text-black mb-4">02</div>
              <h3 className="font-['Syne'] text-[24px] font-bold text-black mb-3 uppercase">
                Creativity
              </h3>
              <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f]">
                Bold ideas meet technical expertise. We encourage innovation and
                experimentation in everything.
              </p>
            </div>
            <div className="p-8 bg-[#f8f7f7] rounded-lg">
              <div className="text-[32px] font-bold text-black mb-4">03</div>
              <h3 className="font-['Syne'] text-[24px] font-bold text-black mb-3 uppercase">
                Collaboration
              </h3>
              <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f]">
                Great work happens when talented people work together. We're a
                team of supportive, curious minds.
              </p>
            </div>
          </div>
        </section>

        {/* ── PERKS SECTION ── */}
        <section className="mb-24 bg-black text-white p-12 md:p-16 rounded-lg">
          <h2 className="font-['Syne'] text-[40px] md:text-[48px] font-bold mb-12 uppercase">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-[32px] font-bold flex-shrink-0 w-12">✓</div>
              <div>
                <h4 className="font-bold text-[18px] mb-2 uppercase">
                  Competitive Compensation
                </h4>
                <p className="text-white/70 text-[16px]">
                  Salary and benefits that reflect your skills and experience.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-[32px] font-bold flex-shrink-0 w-12">✓</div>
              <div>
                <h4 className="font-bold text-[18px] mb-2 uppercase">
                  Growth Opportunities
                </h4>
                <p className="text-white/70 text-[16px]">
                  Continuous learning and professional development programs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-[32px] font-bold flex-shrink-0 w-12">✓</div>
              <div>
                <h4 className="font-bold text-[18px] mb-2 uppercase">
                  Flexible Work
                </h4>
                <p className="text-white/70 text-[16px]">
                  Remote-friendly options and flexible working arrangements.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-[32px] font-bold flex-shrink-0 w-12">✓</div>
              <div>
                <h4 className="font-bold text-[18px] mb-2 uppercase">
                  Great Team
                </h4>
                <p className="text-white/70 text-[16px]">
                  Work alongside passionate, talented, and friendly
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER & JOB LISTINGS ── */}
        <section className="mb-24">
          <div className="mb-12">
            <h2 className="font-['Syne'] text-[48px] md:text-[56px] font-bold mb-8 text-black uppercase">
              Open Positions
            </h2>

            {/* Department Filter */}
            {!loading && departments.length > 1 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-6 py-3 rounded-full font-['Geist'] text-[14px] font-medium uppercase transition-all ${
                      selectedDept === dept
                        ? "bg-black text-white"
                        : "bg-[#f8f7f7] text-black hover:bg-[#efefef]"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Cards */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-['Geist'] text-[18px] text-[#5d5f5f]">
                No positions available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/careers/${job.slug}`}
                  className="group p-8 bg-[#f8f7f7] rounded-lg border border-black/10 hover:border-black hover:shadow-lg transition-all duration-300 no-underline"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="font-['Syne'] text-[24px] md:text-[28px] font-bold text-black mb-2 group-hover:text-black transition-colors uppercase">
                        {job.jobTitle}
                      </h3>
                      <p className="font-['Geist'] text-[14px] text-[#5d5f5f] uppercase tracking-wide">
                        {job.department}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[24px] text-black group-hover:translate-x-1 transition-transform flex-shrink-0">
                      arrow_forward
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white border border-black/20 rounded-full font-['Geist'] text-[12px] font-medium text-[#5d5f5f] uppercase">
                      {job.jobType}
                    </span>
                    <span className="px-4 py-2 bg-white border border-black/20 rounded-full font-['Geist'] text-[12px] font-medium text-[#5d5f5f] uppercase">
                      {job.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── TEAM CULTURE SECTION ── */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-['Syne'] text-[48px] font-bold mb-6 text-black uppercase">
              Our Culture
            </h2>
            <p className="font-['Geist'] text-[18px] leading-[1.8] text-[#5d5f5f] mb-6">
              We believe in building a workplace where creativity thrives,
              collaboration flourishes, and every team member feels valued. We
              celebrate diverse perspectives and foster an environment of
              continuous learning.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                <span className="font-['Geist'] text-[16px] text-[#5d5f5f]">
                  Transparent communication and mutual respect
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                <span className="font-['Geist'] text-[16px] text-[#5d5f5f]">
                  Work-life balance that actually matters
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                <span className="font-['Geist'] text-[16px] text-[#5d5f5f]">
                  Regular team events and community building
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-black rounded-full"></span>
                <span className="font-['Geist'] text-[16px] text-[#5d5f5f]">
                  Support for personal and professional growth
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-[#f8f7f7] rounded-lg aspect-square overflow-hidden">
            <img
              alt="Team Culture"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmH8-ugyYH5J56Bz9lQGkA4McbjO0cZE3tNS3mxFg8ZjA88T-mgTJ0k_uqtgKxf2sYApvFdePbGipJ5woQA7pvvVwCh2qr5HPBuMXnJrbL3PcGQWwmN0UGHuesTrVSMx6MzUh8kUhpWL9mJlHuKwaWQz5hVNQGXQZgAXTbj_KAUZICHrRDMkbZhZpi5cvj2gkrhyBYXvl9u_QGrFWpH0xiT7p6x8sujK03VtCphGHB42d-EKrpBxdz7cIXxeaWTNISqdiiwb_xyA"
            />
          </div>
        </section>

        {/* ── FINAL CTA SECTION ── */}
        <section className="bg-black text-white p-12 md:p-20 rounded-lg text-center">
          <h2 className="font-['Syne'] text-[48px] md:text-[56px] font-bold mb-6 uppercase">
            Ready to Join Us?
          </h2>
          <p className="font-['Geist'] text-[18px] leading-[1.6] text-white/80 max-w-2xl mx-auto mb-10">
            Found the perfect opportunity? Apply now and let's start building
            something amazing together.
          </p>
          <Link
            to="/application"
            className="inline-block bg-white text-black font-['Syne'] text-[16px] font-bold px-12 py-4 rounded-full hover:bg-[#f8f7f7] transition-colors duration-300 uppercase tracking-wide no-underline"
          >
            View Open Positions
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Careers;
