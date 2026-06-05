import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JournalDetailed = () => {
  const { articleId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog();
  }, [articleId]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/blogs/${articleId}`);
      if (response.data.success) {
        setBlog(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch journal entry", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#faf9f9] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest">DECRYPTING NODE...</p>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="bg-[#faf9f9] min-h-screen flex items-center justify-center p-5">
        <div className="text-center max-w-md border-2 border-black p-12">
          <h1 className="font-['Syne'] text-[32px] font-black mb-4 uppercase">NODE NOT FOUND</h1>
          <p className="font-['Geist'] text-[16px] text-[#5d5f5f] mb-8 uppercase font-bold">The requested resource has been moved or purged from the index.</p>
          <Link to="/journal" className="inline-block bg-black text-white px-8 py-4 font-['JetBrains_Mono'] text-[12px] font-bold uppercase no-underline">Return to Journal</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#faf9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      
      <article className="w-full max-w-[1440px] mx-auto px-5 md:px-16 pt-12 md:pt-24 pb-24">
        <header className="max-w-4xl mx-auto md:mx-0">
          <div className="mb-8">
            <span className="bg-black text-white font-['JetBrains_Mono'] text-[12px] font-bold px-3 py-1 uppercase inline-block tracking-widest">
              {blog.category}
            </span>
          </div>
          <h1 className="font-['Syne'] text-[clamp(40px,8vw,120px)] leading-[0.9] font-extrabold text-black mb-12 break-words uppercase">
            {blog.title}
          </h1>

          {/* Metadata Bar */}
          <div className="border border-black py-6 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="flex flex-col">
              <span className="font-['JetBrains_Mono'] text-[12px] uppercase text-[#5d5f5f] mb-1 font-medium tracking-widest">Author</span>
              <span className="font-['Geist'] text-[18px] font-bold text-black uppercase">{blog.author?.name || "VTRC CORE"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['JetBrains_Mono'] text-[12px] uppercase text-[#5d5f5f] mb-1 font-medium tracking-widest">Date Published</span>
              <span className="font-['Geist'] text-[18px] font-bold text-black uppercase">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-['JetBrains_Mono'] text-[12px] uppercase text-[#5d5f5f] mb-1 font-medium tracking-widest">Node ID</span>
              <span className="font-['Geist'] text-[18px] font-bold text-black uppercase">#{blog._id.slice(-6)}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {blog.coverImage && (
          <section className="mb-24">
            <div className="w-full aspect-[21/9] border-2 border-black overflow-hidden grayscale">
              <img 
                className="w-full h-full object-cover" 
                alt={blog.title} 
                src={blog.coverImage}
              />
            </div>
            <p className="font-['JetBrains_Mono'] text-[12px] text-[#5d5f5f] mt-4 text-right uppercase tracking-widest font-medium">
              FIG 01. VISUAL CORRELATION FOR RESOURCE: {blog.slug.toUpperCase()}.
            </p>
          </section>
        )}

        {/* Content Body */}
        <section className="max-w-3xl mx-auto">
          <div 
            className="prose prose-xl prose-slate max-w-none font-['Geist'] text-[18px] md:text-[20px] text-black leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Article Footer / Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-24 pt-12 border-t-2 border-black flex flex-wrap gap-4">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="font-['JetBrains_Mono'] text-[12px] font-bold px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
      </article>

      {/* Back to Journal Section */}
      <section className="bg-[#eeeeee] py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="max-w-2xl">
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase text-[#5d5f5f] mb-4 block tracking-widest">
                Return Path
              </span>
              <h2 className="font-['Syne'] text-[clamp(32px,5vw,64px)] text-black font-extrabold leading-tight m-0 uppercase">
                Explore More Investigations
              </h2>
            </div>
            <Link to="/journal" className="group flex items-center gap-4 bg-black text-white px-8 py-6 border-2 border-black transition-all hover:bg-transparent hover:text-black shrink-0 no-underline cursor-pointer">
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold uppercase tracking-widest">View Repository</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
            </Link>
          </div>
          <div className="w-full h-1 bg-black"></div>
        </div>
      </section>

    </main>
  );
};

export default JournalDetailed;
