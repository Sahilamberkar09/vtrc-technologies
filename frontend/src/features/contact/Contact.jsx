import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const Contact = () => {
  // ── Form state ─────────────────────────────────────────
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // ── OTP state ──────────────────────────────────────────
  // step: 'input' | 'verify' | 'verified'
  const [otpStep, setOtpStep] = useState('input');
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const digitRefs = useRef([]);
  const timerRef = useRef(null);

  const mapConfig = { lat: 16.8103151, lng: 73.3370135, name: 'RATNAGIRI, MAHARASHTRA' };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  // ── Send OTP ───────────────────────────────────────────
  const handleSendOtp = async () => {
    setOtpError('');
    setOtpSuccess('');
    const emailVal = formData.email.trim();
    if (!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)) {
      setOtpError('Please enter a valid email address first.');
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/otp/send`, { email: emailVal });
      if (data.success) {
        setOtpStep('verify');
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        setCooldown(RESEND_COOLDOWN);
        setOtpSuccess('OTP sent! Check your inbox (and spam folder).');
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP digit handling ─────────────────────────────────
  const handleDigitChange = (idx, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[idx] = cleaned;
    setOtpDigits(next);
    setOtpError('');
    if (cleaned && idx < OTP_LENGTH - 1) {
      digitRefs.current[idx + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) digitRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) digitRefs.current[idx + 1]?.focus();
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    digitRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Verify OTP ─────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setOtpError('');
    const code = otpDigits.join('');
    if (code.length < OTP_LENGTH) {
      setOtpError('Please enter all 6 digits.');
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/otp/verify`, {
        email: formData.email.trim(),
        code,
      });
      if (data.success) {
        setOtpStep('verified');
        setOtpSuccess('');
        setOtpError('');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Change email (restart OTP) ─────────────────────────
  const handleChangeEmail = () => {
    setOtpStep('input');
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setOtpSuccess('');
    setCooldown(0);
  };

  // ── Submit inquiry ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (otpStep !== 'verified') {
      setError('Please verify your email before submitting.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/inquiries`, formData);
      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setOtpStep('input');
        setOtpDigits(Array(OTP_LENGTH).fill(''));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormLocked = otpStep !== 'verified';

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-16 pt-14 md:pt-20 pb-24">

        {/* ── HERO SECTION ── */}
        <section className="mb-16">
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 border border-black">
            <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black">
              Available — Taking New Projects
            </span>
          </div>
          <h1 className="font-['Syne'] text-[clamp(32px,5vw,68px)] leading-[1] tracking-[-0.03em] font-extrabold text-black uppercase m-0 mb-6">
            Let's Build<br />Something Great
          </h1>
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

                  {/* ── EMAIL + OTP SECTION ── */}
                  <div className="space-y-4">
                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-1">
                      {['input', 'verify', 'verified'].map((s, i) => (
                        <React.Fragment key={s}>
                          <div className={`flex items-center gap-1.5 ${otpStep === s || (i === 0 && otpStep === 'input') || (i < ['input','verify','verified'].indexOf(otpStep)) ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${otpStep === 'verified' && i <= 2 ? 'bg-black border-black text-white' : otpStep === 'verify' && i <= 1 ? 'bg-black border-black text-white' : i === 0 ? 'bg-black border-black text-white' : 'border-black/30 text-black/30'}`}>
                              {otpStep === 'verified' && i < 2 ? '✓' : otpStep === 'verify' && i === 0 ? '✓' : i + 1}
                            </div>
                            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-black/50 hidden sm:block">
                              {i === 0 ? 'Email' : i === 1 ? 'Verify OTP' : 'Confirmed'}
                            </span>
                          </div>
                          {i < 2 && <div className={`flex-1 h-px transition-all ${(otpStep === 'verify' && i === 0) || otpStep === 'verified' ? 'bg-black' : 'bg-black/15'}`} />}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* ── STEP 1: Email input + Send OTP ── */}
                    {(otpStep === 'input' || otpStep === 'verified') && (
                      <div className="flex flex-col gap-2">
                        <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                          Email Address
                          {otpStep === 'verified' && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                              Verified
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2 items-stretch">
                          <input
                            type="email"
                            required
                            disabled={otpStep === 'verified'}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@gmail.com"
                            className={`flex-1 bg-transparent border-b-2 py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none transition-all rounded-none ${otpStep === 'verified' ? 'border-emerald-500 text-emerald-700 cursor-not-allowed' : 'border-black focus:border-b-[3px]'}`}
                          />
                          {otpStep === 'verified' ? (
                            <button
                              type="button"
                              onClick={handleChangeEmail}
                              className="px-4 py-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest border border-black/30 text-black/50 hover:border-black hover:text-black transition-all whitespace-nowrap"
                            >
                              Change
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpLoading || !formData.email}
                              className="px-5 py-2 bg-black text-white font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-widest border-2 border-black hover:bg-transparent hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                            >
                              {otpLoading ? (
                                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <span className="material-symbols-outlined text-[13px]">send</span>
                              )}
                              Send OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: OTP input ── */}
                    {otpStep === 'verify' && (
                      <div className="space-y-4 border-2 border-black/10 p-5 bg-[#f9f9f9]">
                        {/* Email display */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#5d5f5f] mb-0.5">OTP sent to</p>
                            <p className="font-['Geist'] text-[14px] font-semibold text-black">{formData.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleChangeEmail}
                            className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-black/40 hover:text-black border-b border-black/20 hover:border-black transition-all"
                          >
                            Change
                          </button>
                        </div>

                        {/* 6-digit OTP boxes */}
                        <div>
                          <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f] mb-3 block">
                            Enter 6-digit code
                          </label>
                          <div className="flex gap-2 sm:gap-3" onPaste={handleDigitPaste}>
                            {otpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={el => digitRefs.current[idx] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-[20px] sm:text-[24px] font-bold font-['Geist'] border-2 bg-white focus:outline-none transition-all rounded-none ${digit ? 'border-black' : 'border-black/20'} focus:border-black`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Success / Error messages */}
                        {otpSuccess && (
                          <p className="font-['JetBrains_Mono'] text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            {otpSuccess}
                          </p>
                        )}
                        {otpError && (
                          <p className="font-['JetBrains_Mono'] text-[10px] text-red-600 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">error</span>
                            {otpError}
                          </p>
                        )}

                        {/* Verify + Resend row */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || otpDigits.join('').length < OTP_LENGTH}
                            className="w-full sm:w-auto bg-black text-white font-['JetBrains_Mono'] text-[11px] font-bold px-8 py-3 border-2 border-black hover:bg-transparent hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            {otpLoading ? (
                              <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <span className="material-symbols-outlined text-[14px]">lock_open</span>
                            )}
                            Confirm OTP
                          </button>
                          <div className="flex items-center gap-2">
                            {cooldown > 0 ? (
                              <span className="font-['JetBrains_Mono'] text-[10px] text-black/40 uppercase tracking-widest">
                                Resend in {cooldown}s
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpLoading}
                                className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-black/50 hover:text-black border-b border-black/20 hover:border-black transition-all disabled:opacity-40"
                              >
                                Resend OTP
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── REST OF FORM (locked until verified) ── */}
                  <div className={`space-y-8 transition-all duration-300 ${isFormLocked ? 'opacity-40 pointer-events-none select-none' : 'opacity-100'}`}>
                    {isFormLocked && (
                      <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-black/40">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Verify your email to unlock the form
                      </div>
                    )}

                    {/* Row 1: Name */}
                    <div className="flex flex-col gap-2">
                      <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isFormLocked}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] transition-all rounded-none disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Row 2: Phone */}
                    <div className="flex flex-col gap-2 max-w-xs">
                      <label className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-[#5d5f5f]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isFormLocked}
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val });
                        }}
                        placeholder="10-digit number"
                        className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] font-medium text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] transition-all rounded-none disabled:cursor-not-allowed"
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
                        disabled={isFormLocked}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about the website or web app you want to build…"
                        className="w-full bg-transparent border-b-2 border-black py-3 font-['Geist'] text-[15px] text-black placeholder-black/25 focus:outline-none focus:border-b-[3px] resize-none break-words transition-all rounded-none disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="font-['JetBrains_Mono'] text-[11px] text-red-600 font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {error}
                    </p>
                  )}

                  {/* Footer row */}
                  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pt-4 border-t border-black/10 transition-all duration-300 ${isFormLocked ? 'opacity-40 pointer-events-none' : ''}`}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="nda"
                        disabled={isFormLocked}
                        className="w-5 h-5 border-2 border-black rounded-none checked:bg-black focus:ring-0 cursor-pointer appearance-none"
                        style={{ accentColor: '#000' }}
                      />
                      <span className="font-['JetBrains_Mono'] text-[11px] font-medium uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity">
                        Request NDA
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading || isFormLocked}
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
