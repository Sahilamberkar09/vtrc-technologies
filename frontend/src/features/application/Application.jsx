import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Application = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('jobId');
  const roleTitle = searchParams.get('role');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discipline: 'ENGINEERING',
    portfolio: '',
    pitch: '',
    resume: null,
    jobId: jobId || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (!formData.resume) {
      setError('Please upload your resume file (PDF/DOCX).');
      return;
    }
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('discipline', formData.discipline);
    data.append('portfolio', formData.portfolio);
    data.append('pitch', formData.pitch);
    data.append('resume', formData.resume);
    if (formData.jobId) data.append('jobId', formData.jobId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/careers/applications`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          discipline: 'ENGINEERING',
          portfolio: '',
          pitch: '',
          resume: null,
          jobId: formData.jobId || ''
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#faf9f9] p-5">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-[40px]">task_alt</span>
          </div>
          <h1 className="font-['Syne'] text-[48px] md:text-[64px] font-extrabold uppercase leading-none text-black">Dossier Logged</h1>
          <p className="font-['Geist'] text-[18px] text-[#5d5f5f]">Your application has been indexed. Our recruitment algorithms will analyze your profile against current and future tactical needs.</p>
          <button 
            onClick={() => navigate('/careers')}
            className="bg-black text-white px-10 py-4 font-['JetBrains_Mono'] text-[14px] font-bold uppercase tracking-widest border-2 border-black hover:bg-transparent hover:text-black transition-all"
          >
            Back to Careers
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-12 pb-24 px-5 md:px-16 max-w-[1440px] mx-auto w-full min-h-screen bg-[#faf9f9] text-[#1a1c1c]">
      {/* Hero Section */}
      <section className="mb-24">
        <p className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-[0.3em] mb-4 text-[#747878]">
          Application // {jobId ? `Ref: JOB-${jobId.slice(-4).toUpperCase()}` : 'Ref: 2024-SP'}
        </p>
        <h1 className="font-['Syne'] text-[clamp(40px,8vw,120px)] font-extrabold tracking-[-0.04em] leading-[0.9] text-black m-0 uppercase">
          {roleTitle ? <>{roleTitle}<br/>CANDIDACY</> : <>SPECULATIVE<br/>APPLICATION</>}
        </h1>
        <div className="mt-12 h-px w-full bg-black"></div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar: Values */}
        <aside className="lg:col-span-4 order-2 lg:order-1 border-2 border-black p-6 bg-[#f4f3f3]">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-black">terminal</span>
            <h2 className="font-['JetBrains_Mono'] text-[12px] uppercase font-bold tracking-widest text-black m-0">CRITERIA_MANIFESTO</h2>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="font-['Syne'] text-[32px] font-bold mb-2 text-black leading-[40px] m-0">RIGOR.</h3>
              <p className="font-['Geist'] text-[16px] text-[#444748] leading-relaxed m-0">We operate at the intersection of absolute precision and creative intuition. If your work cannot withstand intense scrutiny, it does not belong here.</p>
            </div>
            <div>
              <h3 className="font-['Syne'] text-[32px] font-bold mb-2 text-black leading-[40px] m-0">CLARITY.</h3>
              <p className="font-['Geist'] text-[16px] text-[#444748] leading-relaxed m-0">Complexity is a failure of communication. We seek minds that can distill massive technical challenges into elegant, transparent solutions.</p>
            </div>
            <div>
              <h3 className="font-['Syne'] text-[32px] font-bold mb-2 text-black leading-[40px] m-0">SPEED.</h3>
              <p className="font-['Geist'] text-[16px] text-[#444748] leading-relaxed m-0">The future is moving. We value velocity without sacrificing integrity. Decision-making is decentralized; execution is immediate.</p>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-[#c4c7c7]">
            <img 
              className="w-full grayscale filter contrast-125 border border-black" 
              alt="High-contrast macro photograph" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQWJp8aUoXaV6k1RJR23yl17KcIBgoDNacbW6xDISoJmOmydIUvUs23vfypvl-325qirTd9ntwOCncFiIpgPQfFjgGgkaILy1sB-iITXzXDjaaV5Pz7Tc1HceAIQykmWsjZzHdBjpg4_bFAo0k1puUj33KJBuJNmxA8U0w5asd_8xWEeXRkyxjbEPcsUmUWR_J5YNRGyDzxva0wiQPgnldlJM7Jdhtxt0ETp35W1df0-ZB-HPI-8KGpwoh73VtdUK8MdrIgTYLMA"
            />
          </div>
        </aside>

        {/* Form: Dossier Submission */}
        <form className="lg:col-span-8 order-1 lg:order-2 space-y-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]" htmlFor="name">01_FULL_NAME / ID</label>
              <input 
                className="bg-transparent border-b-2 border-black focus:border-black focus:ring-0 px-0 py-4 font-['Syne'] text-[32px] font-bold placeholder:text-[#e3e2e2] transition-colors outline-none w-full" 
                id="name" 
                placeholder="Surname, First Name" 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]" htmlFor="email">02_EMAIL_ADDRESS</label>
              <input 
                className="bg-transparent border-b-2 border-black focus:border-black focus:ring-0 px-0 py-4 font-['Syne'] text-[32px] font-bold placeholder:text-[#e3e2e2] transition-colors outline-none w-full" 
                id="email" 
                placeholder="user@gmail.com" 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discipline */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]" htmlFor="discipline">03_TECHNICAL_DISCIPLINE</label>
              <select 
                className="bg-transparent border-b-2 border-black focus:border-black focus:ring-0 px-0 py-4 font-['Syne'] text-[32px] font-bold appearance-none cursor-pointer outline-none w-full" 
                id="discipline"
                value={formData.discipline}
                onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
              >
                <option value="ENGINEERING">ENGINEERING</option>
                <option value="DESIGN">DESIGN</option>
                <option value="RESEARCH">RESEARCH</option>
                <option value="OPERATIONS">OPERATIONS</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 bottom-4 pointer-events-none text-black">expand_more</span>
            </div>

            {/* Portfolio */}
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]" htmlFor="portfolio">04_DOSSIER_URL / PORTFOLIO</label>
              <input 
                className="bg-transparent border-b-2 border-black focus:border-black focus:ring-0 px-0 py-4 font-['Syne'] text-[32px] md:text-[32px] text-[24px] font-bold placeholder:text-[#e3e2e2] outline-none w-full" 
                id="portfolio" 
                placeholder="https://domain.com/work" 
                type="url"
                required
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]">05_RESUME_FILE / CV</label>
            <div className="relative group">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden" 
                id="resume-upload" 
              />
              <label 
                htmlFor="resume-upload" 
                className="flex items-center justify-between p-6 border-2 border-black cursor-pointer bg-white hover:bg-black hover:text-white transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined">{formData.resume ? 'task' : 'upload_file'}</span>
                  <span className="font-['Syne'] text-[18px] font-bold uppercase">
                    {formData.resume ? formData.resume.name : 'Choose File (PDF/DOCX)'}
                  </span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-widest opacity-60">Max 10MB</span>
              </label>
            </div>
          </div>

          {/* The Pitch */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end mb-4">
              <label className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-[#747878]" htmlFor="pitch">06_THE_PITCH</label>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#747878]">MIN_100_WORDS_REQUIRED</span>
            </div>
            <textarea 
              className="bg-[#f4f3f3] border-2 border-black focus:border-black focus:ring-0 p-6 font-['Geist'] text-[18px] placeholder:text-[#c4c7c7] resize-none outline-none w-full" 
              id="pitch" 
              placeholder="Describe your contribution to the technological revolution. Why VTRC? Why now?" 
              rows="8"
              required
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
            ></textarea>
          </div>

          {error && (
            <p className="font-['JetBrains_Mono'] text-[12px] text-red-600 font-bold uppercase tracking-widest">{error}</p>
          )}

          {/* Action */}
          <div className="pt-8">
            <button 
              className="group relative w-full bg-black text-white py-8 border-2 border-black overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-black cursor-pointer disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                <span className="font-['Syne'] text-[32px] font-bold tracking-tighter uppercase">
                  {loading ? 'UPLOADING DOSSIER...' : 'SUBMIT CANDIDACY'}
                </span>
                {!loading && <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform duration-300">arrow_forward</span>}
              </div>
            </button>
            {loading && (
               <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest mt-4 text-center text-black font-bold animate-pulse">
                 Please wait. Encrypting and transmitting technical assets to secure nodes...
               </p>
            )}
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest mt-4 text-center text-[#747878] m-0">By submitting, you acknowledge that all data provided is subject to rigorous technical review.</p>
          </div>
        </form>

      </div>
    </main>
  );
};

export default Application;
