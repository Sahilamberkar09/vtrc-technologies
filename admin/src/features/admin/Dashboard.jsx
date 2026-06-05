import React, { useState, useContext, useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Plus,
  Briefcase,
  History,
  FileQuestion,
  ChevronRight,
  ArrowRight,
  CheckSquare,
  Zap,
  UserCircle,
  BarChart3,
  FolderPlus,
  ListTodo,
  Layout,
  Terminal,
} from "lucide-react";
import { userDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Statistic from "./Statistic";
import MessageView from "../inquiry/MessageView";
import ProjectPostView from "../projects/ProjectPostView";
import Quotation from "../quotation/Quotation";
import QuotationHistory from "../quotation/QuotationHistory";
import UserView from "./UserView";
import InquiryView from "../inquiry/InquiryView";
import PlanInquiryView from "../inquiry/PlanInquiryView";
import ProjectInquiryView from "../inquiry/ProjectInquiryView";
import TodoManager from "./TodoManager";
import AdminProfile from "../auth/AdminProfile";
import BlogManager from "../blog/BlogManager";
import CareerManager from "../career/CareerManager";
import ApplicationManager from "../career/ApplicationManager";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AnimatedLogo from "../../components/ui/AnimatedLogo";

const AdminDashboard = () => {
  const { user: currentUser, setIsAuthenticated, serverUrl } = useContext(userDataContext);
  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpenOnMobile, setIsChatOpenOnMobile] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { id: "stats", label: "Statistics", icon: <BarChart3 /> },
    { id: "projects", label: "Projects", icon: <FolderPlus /> },
    { id: "tasks", label: "Directives", icon: <ListTodo /> },
    { id: "messages", label: "Nodes Chat", icon: <MessageSquare /> },
    { id: "inquiries", label: "Contact Messages", icon: <FileQuestion /> },
    { id: "project-leads", label: "Project Leads", icon: <Terminal /> },
    { id: "plans", label: "Plan Inquiries", icon: <Zap /> },
    { id: "blogs", label: "Blogs", icon: <Layout /> },
    { id: "careers", label: "Roles", icon: <Briefcase /> },
    { id: "applications", label: "Applicants", icon: <UserCircle /> },
    { id: "quotation", label: "Generate Quotation", icon: <Plus /> },
    { id: "quotation-history", label: "Quotation History", icon: <History /> },
    { id: "users", label: "User Access", icon: <Users />, superOnly: true },
    { id: "profile", label: "Config", icon: <Settings /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab !== "tasks") {
      setSelectedProjectForTask("");
    }
  };

  const handleAddTaskFromProject = (projectName) => {
    setSelectedProjectForTask(projectName);
    setActiveTab("tasks");
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "stats": return <Statistic />;
      case "projects": return <ProjectPostView onAddTask={handleAddTaskFromProject} />;
      case "messages": return <MessageView showChatOnMobile={isChatOpenOnMobile} setShowChatOnMobile={setIsChatOpenOnMobile} />;
      case "quotation": return <Quotation />;
      case "quotation-history": return <QuotationHistory onDownload={(q) => {
        // This is a placeholder logic: in a real app we'd pass data to the quotation tab
        setActiveTab("quotation");
        // We'd need a way to set the form data there, but for now we'll just navigate
      }} />;
      case "users": return <UserView />;
      case "inquiries": return <InquiryView />;
      case "project-leads": return <ProjectInquiryView />;
      case "plans": return <PlanInquiryView />;
      case "blogs": return <BlogManager />;
      case "careers": return <CareerManager />;
      case "applications": return <ApplicationManager />;
      case "tasks": return <TodoManager prefilledProject={selectedProjectForTask} />;
      case "profile": return <AdminProfile />;
      default: return <Statistic />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-background font-body selection:bg-black/10 overflow-hidden">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-outline-variant/30 transition-all duration-300 relative z-40 ${isSidebarOpen ? "w-72" : "w-20"
          }`}
      >
        <div className="p-6 flex items-center justify-center border-b border-surface-container h-24">
          <AnimatedLogo size={isSidebarOpen ? 'md' : 'sm'} />
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
          <div className="space-y-1 px-4">
            {navItems.map((item) => {
              if (item.superOnly && currentUser?.role !== "superadmin") return null;
              return (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  collapsed={!isSidebarOpen}
                  onClick={() => handleTabChange(item.id)}
                />
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest font-mono">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE MENU OVERLAY ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white z-[60] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <AnimatedLogo size="md" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border border-slate-200 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navItems.map((item) => {
                  if (item.superOnly && currentUser?.role !== "superadmin") return null;
                  return (
                    <NavItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeTab === item.id}
                      onClick={() => handleTabChange(item.id)}
                    />
                  );
                })}
              </nav>
              <div className="p-8 border-t border-slate-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-red-600 bg-red-50 rounded-xl text-xs font-bold uppercase tracking-widest font-mono">
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Control Axis</span>
              <h2 className="text-sm font-black text-black uppercase font-display tracking-widest">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-black text-black uppercase font-display leading-none">{currentUser?.name || "Operator"}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                {currentUser?.role === 'superadmin' ? "Super Architect" : "Core Operator"}
              </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-black font-black text-sm uppercase">
              {currentUser?.name?.charAt(0) || "V"}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${activeTab === 'messages' ? 'p-0 overflow-hidden' : 'p-6 lg:p-10'}`}>
          <div className={activeTab === 'messages' ? "h-full" : "max-w-7xl mx-auto"}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={activeTab === 'messages' ? "h-full" : ""}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component: Navigation Item
const NavItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3.5 transition-all duration-200 group relative rounded-lg ${active
      ? "bg-black text-white"
      : "text-slate-500 hover:text-black hover:bg-slate-100"
      } ${collapsed ? "justify-center" : ""}`}
  >
    <div className={`shrink-0 ${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-300`}>
      {React.cloneElement(icon, { size: 18, strokeWidth: active ? 2.5 : 2 })}
    </div>
    {!collapsed && (
      <span className={`text-[11px] uppercase font-bold tracking-widest font-mono truncate transition-opacity duration-300`}>
        {label}
      </span>
    )}
    {!collapsed && !active && (
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        <ChevronRight size={14} />
      </div>
    )}
  </button>
);

export default AdminDashboard;

