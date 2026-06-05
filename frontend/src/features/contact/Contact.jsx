import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const mapConfig = {
    lat: 16.8103151,
    lng: 73.3370135,
    name: 'RATNAGIRI, MAHARASHTRA'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      setOtpError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/send-email-otp`, { email: formData.email });
      if (res.data.success) {
        setOtpSent(true);
        setCooldown(30);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }
    setVerifyLoading(true);
    setOtpError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify-email-otp`, { email: formData.email, otp });
      if (res.data.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setOtp('');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailVerified) {
      setError('Please verify your email address before submitting.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, formData);
      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setEmailVerified(false);
        setOtpSent(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-16 pt-14 md:pt-20 pb-24">

        {/* ── HERO SECTION ── */}
        <section className="mb-16">
          {/* Label */}
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 border border-black">
            <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
              Available — Taking New Projects
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-['Syne'] text-[clamp(32px,5vw,68px)] leading-[1] tracking-[-0.03em] font-extrabold text-black uppercase m-0 mb-6">
            Let's Build<br />Something Great
          </h1>

          {/* Divider row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-t-2 border-black pt-6">
            <p className="font-['Geist'] text-[15px] leading-[1.7] text-[#5d5f5f] max-w-md m-0">
              We help businesses plan, design, and build websites that feel right
              for their brand — and work for their customers.
            </p>
            <a
              href="mailto:hello@vtrc.tech"
              className="font-['JetBrains_Mono'] text-[12px] font-medium uppercase tracking-widest text-black border-b-2 border-black pb-0.5 hover:opacity-50 transition-opacity whitespace-nowrap self-start md:self-auto"
            >
              hello@vtrc.tech
            </a>
          </div>
        </section>

        {/* ── MAIN BENTO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ── CONTACT FORM ── */}
          <section className="lg:col-span-8 border-2 border-black bg-white">
            {/* Form header bar */}
            <div className="border-b-2 border-black px-6 md:px-8 py-4 flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                Project Inquiry
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
                01 / Form
              </span>
            </div>

            <div className="px-6 md:px-8 py-8">
              {success ? (
                <div className="py-16 text-center flex flex-col items-center gap-6">
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">check</span>
                  </div>
                  <div>
                    <h2 className="font-['Syne'] text-[24px] font-bold uppercase mb-2">Message Received</h2>
                    <p className="font-['Geist'] text-[15px] text-[#5d5f5f]">
                      Our team will review your message and respond within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-black text-white px-8 py-3 font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest border-2 border-black hover:bg-transparent hover:text-black transition-all"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>

                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] transition-all rounded-none"
                      />
                    </div>

                    {/* Email + OTP */}
                    <div className="flex flex-col gap-2">
                      <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                        Email Address
                      </label>
                      <div className="flex items-center border-b-2 border-black focus-within:border-b-[3px] transition-all">
                        <input
                          type="email"
                          required
                          disabled={emailVerified}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            setEmailVerified(false);
                            setOtpSent(false);
                          }}
                          placeholder="alex@gmail.com"
                          className="w-full min-w-0 bg-transparent border-none py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none focus:ring-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        {emailVerified ? (
                          <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-green-600 uppercase whitespace-nowrap px-3 flex-shrink-0 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading || cooldown > 0 || !formData.email}
                            className="font-['JetBrains_Mono'] text-[11px] font-bold text-white bg-black px-3 py-1.5 uppercase disabled:opacity-40 whitespace-nowrap flex-shrink-0 transition-opacity hover:opacity-70"
                          >
                            {otpLoading ? 'Sending…' : cooldown > 0 ? `${cooldown}s` : 'Send OTP'}
                          </button>
                        )}
                      </div>
                      {otpError && (
                        <p className="font-['JetBrains_Mono'] text-[11px] text-red-600 font-bold tracking-widest uppercase mt-1">
                          {otpError}
                        </p>
                      )}
                      {otpSent && !emailVerified && (
                        <div className="flex items-center gap-2 mt-3 border border-black/10 bg-[#f4f3f3] px-3 py-2">
                          <input
                            type="text"
                            maxLength="6"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full min-w-0 bg-transparent border-none py-1 font-['JetBrains_Mono'] text-[14px] font-bold text-black placeholder-black/30 focus:outline-none tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={verifyLoading || otp.length !== 6}
                            className="font-['JetBrains_Mono'] text-[11px] font-bold text-white bg-black px-3 py-1.5 uppercase disabled:opacity-40 whitespace-nowrap flex-shrink-0"
                          >
                            {verifyLoading ? '…' : 'Verify'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone */}
                  <div className="flex flex-col gap-2 max-w-xs">
                    <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                      }}
                      placeholder="10-digit number"
                      className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] transition-all rounded-none"
                    />
                  </div>

                  {/* Row 3: Message */}
                  <div className="flex flex-col gap-2">
                    <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                      Project Details
                    </label>
                    <textarea
                      rows="5"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the website or web app you want to build…"
                      className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] resize-none break-words transition-all rounded-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="font-['JetBrains_Mono'] text-[11px] text-red-600 font-bold uppercase tracking-widest">
                      {error}
                    </p>
                  )}

                  {/* Footer row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pt-4 border-t border-black/10">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="nda"
                        className="w-5 h-5 border-2 border-black rounded-none checked:bg-black focus:ring-0 cursor-pointer appearance-none"
                        style={{ accentColor: '#000' }}
                      />
                      <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity">
                        Request NDA
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-black text-white font-['Syne'] text-[15px] font-bold px-10 py-4 border-2 border-black transition-all duration-200 hover:bg-transparent hover:text-black flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                      {loading ? 'Sending…' : 'Send Brief'}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 flex flex-col gap-5">

            {/* Location Card */}
            <div className="border-2 border-black bg-[#f4f3f3]">
              <div className="border-b-2 border-black px-6 py-3 flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  Headquarters
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] tracking-widest text-[#5d5f5f] uppercase">IN</span>
              </div>
              <div className="px-6 py-6">
                <address className="not-italic font-['Syne'] text-[20px] font-bold leading-snug text-black m-0">
                  Ratnagiri<br />
                  Maharashtra<br />
                  <span className="text-[14px] font-normal text-[#5d5f5f] font-['JetBrains_Mono'] tracking-widest">415612</span>
                </address>
              </div>
              <div className="border-t border-black/10">
                <img
                  alt="Ratnagiri, Maharashtra"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsZA6Yb7hO6LwJtKuuXH7L982AXEBD2EJQg-AQJ120KmC3R3oDnM7lOY2EoGKG3fx9oOv4MUc6TgNY8l3p4-SvTzUUQUiWcHDrUY0ewVcV1wk2z5yb7Lrm8RyVffBda8PpRMq86clqBIyepm_Hn_08KGNFoUs0OAf-T-PnxDLvceVBCVU6EXJssPm_qRGN5j86z7ogMmZnvEh7tFg9FgME3zL56pV6EfPzPluZx6mgskjeaR7hAqyWioq8gmkcN_Ua3NO3JhYsTg"
                  className="w-full grayscale h-40 object-cover"
                />
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="border-2 border-black bg-white">
              <div className="border-b-2 border-black px-6 py-3">
                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                  Direct Inquiry
                </span>
              </div>
              <div className="px-6 py-5">
                <a
                  href="mailto:hello@vtrc.tech"
                  className="font-['Syne'] text-[17px] font-bold text-black no-underline hover:opacity-50 transition-opacity break-all select-all"
                >
                  hello@vtrc.tech
                </a>
              </div>
            </div>

            {/* Connect / Socials Card */}
            <div className="border-2 border-black bg-black text-white">
              <div className="border-b-2 border-white/10 px-6 py-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>
                  alternate_email
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest opacity-60">
                  Connect
                </span>
              </div>
              <ul className="px-6 py-5 flex flex-col gap-3 list-none m-0">
                {[
                  { label: 'LinkedIn', href: '#' },
                  { label: 'GitHub', href: '#' },
                  { label: 'Twitter / X', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-['Syne'] text-[15px] font-bold text-white no-underline flex items-center justify-between group hover:opacity-60 transition-opacity"
                    >
                      {label}
                      <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                        north_east
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>

        {/* ── MAP SECTION ── */}
        <section className="mt-16 border-2 border-black overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <div className="w-full h-[340px] bg-[#e3e2e2] relative">
            <iframe
              src={`https://maps.google.com/maps?q=${mapConfig.lat},${mapConfig.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 grayscale opacity-80"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ratnagiri Maharashtra Map"
            />
            <div className="absolute z-20 top-5 left-5 bg-black text-white px-4 py-2.5 border border-white/20">
              <p className="font-['JetBrains_Mono'] text-[11px] font-medium whitespace-nowrap m-0 uppercase tracking-widest">
                {mapConfig.name} &nbsp;·&nbsp; {Math.abs(mapConfig.lat)}° {mapConfig.lat >= 0 ? 'N' : 'S'}, {Math.abs(mapConfig.lng)}° {mapConfig.lng >= 0 ? 'E' : 'W'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Contact;
