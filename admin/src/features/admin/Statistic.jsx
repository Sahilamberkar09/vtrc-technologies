import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import { Activity, MessageSquare, FolderGit2, Users, Layout, Zap, Terminal, ArrowUpRight, ChevronRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const Statistic = () => {
  const { serverUrl } = useContext(userDataContext);
  const [dashboardData, setDashboardData] = useState({
    vitalStats: {
      totalUsers: 0,
      activeTasks: 0,
      totalMessages: 0,
      totalProjects: 0,
      totalInquiries: 0,
    },
    taskProjectBreakdown: [],
    projectsByCategory: [],
    recentActivity: {
      tasks: [],
      messages: [],
      projects: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/stats`, {
          withCredentials: true,
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load telemetry data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [serverUrl]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 font-mono">
          Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-black text-white flex items-center gap-4 rounded-xl font-mono text-sm">
        <Terminal className="text-red-500" />
        <span className="font-bold uppercase tracking-widest">{error}</span>
      </div>
    );
  }

  const {
    vitalStats,
    taskProjectBreakdown,
    projectsByCategory,
    recentActivity,
  } = dashboardData;

  const statCards = [
    {
      label: "Total Users",
      value: vitalStats.totalUsers,
      icon: <Users size={20} />,
      id: "US-01"
    },
    {
      label: "Active Tasks",
      value: vitalStats.activeTasks,
      icon: <Zap size={20} />,
      id: "PR-02"
    },
    {
      label: "Projects",
      value: vitalStats.totalProjects,
      icon: <Briefcase size={20} />,
      id: "DM-03"
    },
    {
      label: "Inquiries",
      value: vitalStats.totalInquiries,
      icon: <Activity size={20} />,
      id: "SL-04"
    },
  ];

  return (
    <div className="space-y-12 pb-20 selection:bg-black/10">
      {/* ── VITAL STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-black transition-all duration-300 flex flex-col justify-between min-h-[200px] relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                  {stat.id}
                </p>
                <p className="text-sm font-black text-black font-display uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
              <div className="text-slate-400 group-hover:text-black transition-colors p-2.5 bg-slate-50 rounded-xl">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-3 relative z-10">
              <p className="text-5xl font-black tracking-tighter font-display leading-none">
                {stat.value.toString().padStart(2, '0')}
              </p>
              <div className="w-2 h-2 bg-black rounded-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── RECENT ACTIVITY ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-slate-400" />
              <h2 className="font-extrabold text-xl font-display uppercase tracking-tight">
                Recent Tasks
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recentActivity.tasks.length === 0 ? (
              <div className="py-20 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400">
                  No active tasks found.
                </p>
              </div>
            ) : (
              recentActivity.tasks.slice(0, 5).map((task, idx) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-black transition-all duration-300 group gap-4"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="text-[10px] font-bold font-mono text-slate-300 group-hover:text-slate-900 transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm uppercase font-display leading-tight truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono truncate">
                          {task.project}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest font-mono px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap self-start sm:self-center ${
                    task.status === "completed" 
                      ? "bg-black text-white border-black" 
                      : "bg-slate-50 text-slate-600 border-slate-200 group-hover:border-black group-hover:text-black"
                  }`}>
                    {task.status.replace("-", " ")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SYSTEM BREAKDOWN ── */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
               <Layout size={16} className="text-slate-400" />
               <h3 className="font-black text-[10px] uppercase tracking-widest font-mono">Category Matrix</h3>
            </div>
            
            <div className="space-y-2">
              {projectsByCategory.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest py-2">No data.</p>
              ) : (
                projectsByCategory.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
                    <span className="text-xs font-black uppercase font-display tracking-tight text-slate-600 group-hover:text-black">
                      {cat._id || "Unlabeled"}
                    </span>
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                      {cat.count.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-black text-white rounded-2xl p-8 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity size={80} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                 <Zap size={16} />
                 <h3 className="font-black text-[10px] uppercase tracking-widest font-mono">Distribution</h3>
              </div>
              
              <div className="space-y-4">
                {taskProjectBreakdown.slice(0, 4).map((project, idx) => (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[70%] font-mono text-white/60 group-hover:text-white">
                        {project._id || "General"}
                      </span>
                      <span className="text-[9px] font-bold font-mono text-white/30">
                        {project.count} UNITS
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((project.count / 10) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
