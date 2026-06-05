import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Journal = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/blogs`);
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch journal entries", err);
    } finally {
      setLoading(false);
    }
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const secondaryBlogs = blogs.slice(1);

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-12 md:pt-32 pb-24">

        {/* ── HERO SECTION ── */}
        <header className="mb-16 md:mb-24">
          <h1 className="font-['Syne'] text-[clamp(40px,12vw,120px)] font-extrabold uppercase leading-[0.9] mb-4 m-0 break-words text-black">
            THE JOURNAL
          </h1>
          <div className="h-1 bg-black w-full mb-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-['JetBrains_Mono'] text-[12px] md:text-[14px] font-medium uppercase tracking-[0.2em] text-[#5d5f5f] m-0">
              Technical Dispatches from the Vanguard of Infrastructure
            </p>
            <div className="flex gap-4">
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-black bg-[#eeeeee] px-3 py-1 border border-black uppercase">
                {blogs.length} NODES
              </span>
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-black bg-[#eeeeee] px-3 py-1 border border-black uppercase">
                VOL. {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="py-32 text-center">
            <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest">Synchronizing Journal Nodes...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-black rounded-none">
             <p className="font-['JetBrains_Mono'] text-[14px] font-bold uppercase tracking-widest text-[#5d5f5f]">No entries indexed in the current cycle.</p>
          </div>
        ) : (
          <>
            {/* ── FEATURED ARTICLE ── */}
            {featuredBlog && (
              <Link 
                to={`/journal/${featuredBlog.slug}`} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24 items-stretch group cursor-pointer no-underline block"
              >
                <div className="lg:col-span-7 border-2 border-black overflow-hidden bg-[#eeeeee] relative aspect-video lg:aspect-auto lg:h-[600px]">
                  {featuredBlog.coverImage ? (
                    <img
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-700"
                      alt={featuredBlog.title}
                      src={featuredBlog.coverImage}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                       <span className="font-['JetBrains_Mono'] text-[10px] font-bold opacity-30">NO_VISUAL_DATA</span>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 flex flex-col justify-between py-4">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-black border-2 border-black px-3 py-1 uppercase tracking-widest">
                        {featuredBlog.category}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[12px] font-medium text-[#5d5f5f] uppercase tracking-widest">
                        {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-['Syne'] text-[32px] md:text-[48px] font-bold leading-[1.1] mb-8 text-black cursor-pointer hover:underline decoration-4 underline-offset-8 m-0 uppercase">
                      {featuredBlog.title}
                    </h2>
                    <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] mb-8 max-w-lg m-0">
                      {featuredBlog.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-2 border-black w-fit px-6 py-3 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <span className="font-['JetBrains_Mono'] text-[12px] uppercase font-bold tracking-widest text-black group-hover:text-white transition-colors">Read Investigation</span>
                    <span className="material-symbols-outlined text-[20px] text-black group-hover:text-white transition-colors group-hover:translate-x-2">arrow_forward</span>
                  </div>
                </div>
              </Link>
            )}

            {/* ── SECONDARY GRID ── */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {secondaryBlogs.map((blog) => (
                <Link 
                  key={blog._id}
                  to={`/journal/${blog.slug}`} 
                  className="flex flex-col border-t-2 border-black pt-8 group cursor-pointer block no-underline"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-['JetBrains_Mono'] text-[12px] font-bold bg-black text-white px-3 py-1 uppercase tracking-widest">
                      {blog.category}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[12px] font-medium text-[#5d5f5f] uppercase tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-['Syne'] text-[24px] md:text-[32px] font-bold mb-4 text-black group-hover:underline decoration-2 underline-offset-4 m-0 leading-tight uppercase">
                    {blog.title}
                  </h3>
                  <p className="font-['Geist'] text-[16px] leading-[1.6] text-[#5d5f5f] mb-8 flex-grow m-0 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-b-2 border-black pb-4 group-hover:bg-[#eeeeee] px-2 transition-colors">
                    <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-black uppercase tracking-widest">READ FULL PAPER</span>
                    <span className="material-symbols-outlined text-[20px] text-black">open_in_new</span>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}

        {/* ── NEWSLETTER SUBSCRIPTION ── */}
        <section className="mt-32 border-2 border-black p-8 md:p-12 bg-[#f4f3f3] flex flex-col md:flex-row items-start md:items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="font-['Syne'] text-[32px] md:text-[40px] font-bold leading-tight mb-4 text-black m-0">
              ENGINEERED UPDATES.
            </h2>
            <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] m-0">
              Subscribe to receive monthly technical bulletins. No marketing, only documentation.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="TERMINAL@ORGANIZATION.COM"
                className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-black py-4 font-['JetBrains_Mono'] text-[12px] md:text-[14px] text-black placeholder-black/30 focus:outline-none focus:border-b-4 focus:ring-0 transition-all rounded-none"
              />
              <button
                type="submit"
                className="bg-black text-white py-5 px-6 font-['JetBrains_Mono'] text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] border-2 border-black hover:bg-transparent hover:text-black transition-colors duration-300 cursor-pointer w-full text-center"
              >
                ESTABLISH CONNECTION
              </button>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Journal;
