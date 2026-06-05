import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FeaturedWork = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects?featured=true`);
      if (response.data.success) {
        setFeaturedProjects(response.data.data.slice(0, 3)); // Limit to first 3 featured
      }
    } catch (error) {
      console.error("Error fetching featured projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="work" className="bg-[#faf9f9]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24 box-border">

        {/* ── HEADER ── */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <h2 className="font-['Syne'] text-[32px] leading-[40px] font-bold uppercase text-black m-0">
            Featured Work
          </h2>
          <div className="font-['JetBrains_Mono'] text-[12px] font-medium border-2 border-black px-4 py-2 uppercase text-black">
            Selected Output 01–03
          </div>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {loading ? (
             <div className="col-span-12 py-20 flex justify-center">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            featuredProjects.map((project, index) => {
              if (index === 0) {
                // Large Monolith Card (Span 8)
                return (
                  <Link 
                    key={project._id}
                    to={project.link || "#"}
                    className="work-card col-span-1 md:col-span-8 border-2 border-black overflow-hidden cursor-pointer group block no-underline"
                  >
                    <div className="aspect-video overflow-hidden bg-[#eee]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="img-grayscale w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-7 md:p-8 bg-[#faf9f9] border-t-2 border-black flex justify-between items-center gap-4">
                      <div>
                        <h3 className="font-['Syne'] text-[clamp(20px,3vw,32px)] font-bold uppercase text-black m-0">
                          {project.title}
                        </h3>
                        <p className="font-['JetBrains_Mono'] text-[12px] text-[#5d5f5f] mt-2 mb-0">
                          {project.subtitle || project.category}
                        </p>
                      </div>
                      <span className="material-symbols-outlined arrow-icon text-[32px] text-black shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                        arrow_forward
                      </span>
                    </div>
                  </Link>
                );
              } else if (index === 1) {
                // Secondary Card (Span 4)
                return (
                  <Link 
                    key={project._id}
                    to={project.link || "#"}
                    className="work-card col-span-1 md:col-span-4 border-2 border-black flex flex-col group block no-underline"
                  >
                    <div className="p-7 md:p-7 flex-grow bg-black text-white">
                      <div className="mb-8 font-['JetBrains_Mono'] text-[11px] font-medium border border-[#858383] px-3 py-1 inline-block uppercase text-white tracking-[0.05em]">
                        {project.category || "SYSTEM ARCHITECTURE"}
                      </div>
                      <h3 className="font-['Syne'] text-[clamp(22px,2.5vw,32px)] font-bold uppercase text-white mb-4">
                        {project.title}
                      </h3>
                      <p className="font-['Geist'] text-[15px] leading-[1.6] text-[#858383] m-0 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    <div className="aspect-square bg-[#eee] overflow-hidden border-t-2 border-black">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="img-grayscale w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                );
              } else {
                // Large Horizontal Card (Span 12)
                return (
                  <Link 
                    key={project._id}
                    to={project.link || "#"}
                    className="work-card col-span-1 md:col-span-12 border-2 border-black overflow-hidden group block no-underline"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black bg-[#eee] aspect-video md:aspect-auto">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="img-grayscale w-full h-full object-cover block"
                        />
                      </div>
                      <div className="p-7 md:p-12 flex flex-col justify-center bg-[#faf9f9]">
                        <h3 className="font-['Syne'] text-[clamp(32px,4vw,64px)] leading-[1] tracking-[-0.03em] font-bold uppercase text-black mb-6">
                          {project.title}
                        </h3>
                        <p className="font-['Geist'] text-[18px] leading-[1.6] text-[#5d5f5f] mb-8">
                          {project.description}
                        </p>
                        <button className="w-fit border-2 border-black px-9 py-3.5 font-['JetBrains_Mono'] text-[12px] font-medium uppercase bg-transparent text-black cursor-pointer tracking-[0.05em] transition-all duration-300 group-hover:bg-black group-hover:text-white">
                          View Project
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              }
            })
          )}
          
          {!loading && featuredProjects.length === 0 && (
             <div className="col-span-12 py-20 border-2 border-dashed border-black/10 text-center">
                <p className="font-['Syne'] text-xl font-bold uppercase">No featured monuments architected.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
