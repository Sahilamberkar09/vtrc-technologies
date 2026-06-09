import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StartProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    scope: [],
    timeline: '',
    budget: '< $50,000',
    brief: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScopeChange = (item) => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.includes(item) 
        ? prev.scope.filter(s => s !== item)
        : [...prev.scope, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.scope.length === 0) {
      setError('Please select at least one scope of work.');
      return;
    }
    if (!formData.timeline) {
      setError('Please select a target quarter.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries/project`, formData);
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          organization: '',
          email: '',
          scope: [],
          timeline: '',
          brief: ''
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
      <div className="bg-[#faf9f9] min-h-screen flex items-center justify-center p-5">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[48px]">terminal</span>
          </div>
          <h1 className="font-['Syne'] text-[60px] md:text-[80px] font-extrabold uppercase leading-none text-black">Project Brief Sent</h1>
          <p className="font-['Geist'] text-[20px] text-[#5d5f5f]">Your project brief has been received. Our team will review your goals and contact you within 48 hours.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-12 py-5 font-['JetBrains_Mono'] text-[14px] font-bold uppercase tracking-widest border-2 border-black hover:bg-transparent hover:text-black transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f9] text-[#1a1c1c] font-['Geist'] overflow-x-hidden pt-[80px]">
      <main className="max-w-[1440px] mx-auto px-5 md:px-16 py-16">
        
        {/* Hero Title */}
        <div className="mb-16 border-b-2 border-black pb-8">
          <h1 className="font-['Syne'] text-[clamp(60px,10vw,120px)] uppercase leading-[0.9] font-extrabold mb-4 break-words text-black">
            Initialize Project
          </h1>
          <p className="font-['JetBrains_Mono'] text-[12px] tracking-[0.2em] text-[#5d5f5f] uppercase font-bold">
            Website Project Brief
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar / Tech Details */}
          <aside className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-12">
            
            <div className="border-2 border-black p-6 md:p-8 bg-[#f4f3f3]">
              <h3 className="font-['Syne'] text-[24px] md:text-[32px] font-bold uppercase mb-6 leading-tight text-black">Project Contact</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#5d5f5f] tracking-widest font-bold mb-1">Location</p>
                  <p className="font-['Geist'] text-[18px] font-bold text-black">Ratnagiri, Maharashtra</p>
                </div>
                <div>
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#5d5f5f] tracking-widest font-bold mb-1">Email</p>
                  <p className="font-['Geist'] text-[18px] font-bold text-black">ops@vtrc.tech</p>
                </div>
                <div>
                  <p className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#5d5f5f] tracking-widest font-bold mb-1">Phone</p>
                  <p className="font-['Geist'] text-[18px] font-bold text-black">+1 (800) 555-VTRC</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-6 md:p-8">
              <h3 className="font-['Syne'] text-[24px] md:text-[32px] font-bold uppercase mb-6 leading-tight text-black">Documentation</h3>
              <ul className="space-y-4 font-['JetBrains_Mono'] text-[12px] uppercase underline underline-offset-4 decoration-2 font-bold tracking-widest text-black">
                <li><a className="hover:bg-black hover:text-white p-1 transition-colors cursor-pointer" href="#">Terms of Engagement</a></li>
                <li><a className="hover:bg-black hover:text-white p-1 transition-colors cursor-pointer" href="#">Project Timeline</a></li>
                <li><a className="hover:bg-black hover:text-white p-1 transition-colors cursor-pointer" href="#">Website Standards</a></li>
              </ul>
            </div>

            <div className="relative w-full aspect-square border-2 border-black overflow-hidden bg-[#eeeeee]">
              <img 
                alt="Server Architecture" 
                className="w-full h-full object-cover grayscale" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuEP8fnpn46HTeQIHP1nq9WxVlrGE6f45AF_TJZJ1i28RRZTKyQD1zBvgCXs3f-_sJ4u48DwXCx4payyLe5cD9HCAIdHfomdtZ2YcCCzh0A5e324izaQwS6MgXsTX61XQiYHozl1HfAcuCBmpPmE-Yo9jMRQuaiLZL0kPbSjS4z4tMbkb2grQ3BEjLoDQCtUvX06_jD8jYDS6ZJ7cMXoepxOCyLNomj6cVpcJwsC0xRU9Np2uVTGeR8CAcmJ0tsHVMUXxekGph-A"
              />
            </div>
          </aside>

          {/* Main Form Content */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <form className="space-y-16" onSubmit={handleSubmit}>
              
              {/* Section: Identification */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="font-['JetBrains_Mono'] text-[14px] font-bold bg-black text-white px-3 py-1">01</span>
                  <h2 className="font-['Syne'] text-[32px] font-bold uppercase leading-none text-black">Identification</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest block mb-2 text-[#5d5f5f] group-focus-within:text-black transition-colors">Full Name</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b-2 border-black focus:ring-0 focus:border-b-4 px-0 py-2 font-['Geist'] text-[18px] placeholder:text-[#dadada] text-black outline-none transition-all" 
                      placeholder="Your full name" 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="group">
                    <label className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest block mb-2 text-[#5d5f5f] group-focus-within:text-black transition-colors">Organization</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b-2 border-black focus:ring-0 focus:border-b-4 px-0 py-2 font-['Geist'] text-[18px] placeholder:text-[#dadada] text-black outline-none transition-all" 
                      placeholder="Business or organization" 
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>
                </div>
                <div className="group">
                    <label className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest block mb-2 text-[#5d5f5f] group-focus-within:text-black transition-colors">Email Address</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b-2 border-black focus:ring-0 focus:border-b-4 px-0 py-2 font-['Geist'] text-[18px] placeholder:text-[#dadada] text-black outline-none transition-all" 
                      placeholder="comms@gmail.com" 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
              </section>

              {/* Section: Project Scope */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="font-['JetBrains_Mono'] text-[14px] font-bold bg-black text-white px-3 py-1">02</span>
                  <h2 className="font-['Syne'] text-[32px] font-bold uppercase leading-none text-black">Scope of Work</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Website Design', 'Web Development', 'UI/UX Design'].map((item) => (
                    <label key={item} className={`flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-[#eeeeee] transition-colors ${formData.scope.includes(item) ? 'bg-black text-white' : 'bg-transparent text-black'} group relative`}>
                      <input 
                        className="absolute opacity-0" 
                        type="checkbox"
                        checked={formData.scope.includes(item)}
                        onChange={() => handleScopeChange(item)}
                      />
                      <span className={`font-['JetBrains_Mono'] text-[12px] uppercase font-bold tracking-widest z-10 w-full text-center sm:text-left leading-relaxed`}>{item}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Section: Timeline & Budget */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="font-['JetBrains_Mono'] text-[14px] font-bold bg-black text-white px-3 py-1">03</span>
                  <h2 className="font-['Syne'] text-[32px] font-bold uppercase leading-none text-black">Parameters</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest block text-[#5d5f5f]">Target Quarter</label>
                    <div className="grid grid-cols-4 border-2 border-black">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <label key={q} className={`border-r-2 border-black last:border-0 hover:bg-[#eeeeee] text-center py-4 cursor-pointer font-['JetBrains_Mono'] text-[14px] uppercase font-bold transition-all ${formData.timeline === q ? 'bg-black text-white' : 'text-black'}`}>
                          <input 
                            className="hidden" 
                            name="timeline" 
                            type="radio" 
                            value={q}
                            checked={formData.timeline === q}
                            onChange={() => setFormData({ ...formData, timeline: q })}
                          />
                          {q}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest block text-[#5d5f5f]">Budget Allocation</label>
                    <select 
                      className="w-full bg-transparent border-2 border-black text-black font-['JetBrains_Mono'] text-[14px] font-bold uppercase h-[60px] px-6 appearance-none focus:outline-none focus:border-b-4 focus:border-r-4 transition-all cursor-pointer"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="< $50,000">&lt; $50,000</option>
                      <option value="$50,000 - $150,000">$50,000 - $150,000</option>
                      <option value="$150,000 +">$150,000 +</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section: Brief */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="font-['JetBrains_Mono'] text-[14px] font-bold bg-black text-white px-3 py-1">04</span>
                  <h2 className="font-['Syne'] text-[32px] font-bold uppercase leading-none text-black">Project Goals</h2>
                </div>
                <textarea 
                  className="w-full bg-[#f4f3f3] border-2 border-black font-['JetBrains_Mono'] text-[14px] text-black font-bold focus:outline-none focus:bg-white focus:border-b-4 focus:border-r-4 p-6 tracking-widest resize-none transition-all placeholder:text-[#a0a0a0]" 
                  placeholder="Describe the website you want, your audience, must-have features, and any examples you like." 
                  rows="6"
                  required
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                ></textarea>
              </section>

              {error && (
                <p className="font-['JetBrains_Mono'] text-[12px] text-red-600 font-bold uppercase tracking-widest">{error}</p>
              )}

              {/* Submit Button */}
              <div className="pt-8">
                <button 
                  className="w-full bg-black text-white font-['Syne'] text-[24px] md:text-[32px] font-bold py-6 px-6 uppercase border-2 border-black hover:bg-[#faf9f9] hover:text-black transition-all duration-300 group flex items-center justify-between disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Submitting...' : 'Submit Project Brief'}</span>
                  <span className="material-symbols-outlined text-[32px] md:text-[40px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StartProject;
