import React, { useState, useContext } from "react";
import {
  BarChart3,
  FolderPlus,
  MessageSquare,
  FileQuestion,
  MoreHorizontal,
  LogOut,
  ListTodo,
  Terminal,
  Zap,
  Layout,
  Briefcase,
  UserCircle,
  Plus,
  History,
  Users,
  Settings,
  X,
  ChevronRight,
  ChevronLeft,
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

// ── MOBILE PRIMARY NAV (5 tabs) ──────────────────────────
const primaryNav = [
  { id: "stats",     label: "Home",      icon: BarChart3 },
  { id: "projects",  label: "Projects",  icon: FolderPlus },
  { id: "messages",  label: "Messages",  icon: MessageSquare },
  { id: "inquiries", label: "Inquiries", icon: FileQuestion },
  { id: "__more__",  label: "More",      icon: MoreHorizontal },
];

// ── MOBILE SECONDARY NAV (inside "More" drawer) ──────────
const secondaryNav = [
  { id: "tasks",             label: "Tasks",             icon: ListTodo },
  { id: "project-leads",     label: "Project Inquiries", icon: Terminal },
  { id: "plans",             label: "Plan Requests",     icon: Zap },
  { id: "blogs",             label: "Blog Posts",        icon: Layout },
  { id: "careers",           label: "Job Openings",      icon: Briefcase },
  { id: "applications",      label: "Applications",      icon: UserCircle },
  { id: "quotation",         label: "New Quotation",     icon: Plus },
  { id: "quotation-history", label: "Quote History",     icon: History },
  { id: "users",             label: "Team Members",      icon: Users, superOnly: true },
  { id: "profile",           label: "Settings",          icon: Settings },
];

// ── DESKTOP SIDEBAR NAV (grouped) ────────────────────────
const desktopNavGroups = [
  {
    section: null,
    items: [
      { id: "stats",     label: "Home",      icon: BarChart3 },
      { id: "projects",  label: "Projects",  icon: FolderPlus },
      { id: "messages",  label: "Messages",  icon: MessageSquare },
      { id: "inquiries", label: "Inquiries", icon: FileQuestion },
    ],
  },
  {
    section: "Work",
    items: [
      { id: "tasks",         label: "Tasks",             icon: ListTodo },
      { id: "project-leads", label: "Project Inquiries", icon: Terminal },
      { id: "plans",         label: "Plan Requests",     icon: Zap },
    ],
  },
  {
    section: "Content",
    items: [
      { id: "blogs",        label: "Blog Posts",   icon: Layout },
      { id: "careers",      label: "Job Openings", icon: Briefcase },
      { id: "applications", label: "Applications", icon: UserCircle },
    ],
  },
  {
    section: "Finance",
    items: [
      { id: "quotation",         label: "New Quotation", icon: Plus },
      { id: "quotation-history", label: "Quote History", icon: History },
    ],
  },
  {
    section: "Admin",
    items: [
      { id: "users",   label: "Team Members", icon: Users, superOnly: true },
      { id: "profile", label: "Settings",     icon: Settings },
    ],
  },
];

const AdminDashboard = () => {
  const { user: currentUser, setIsAuthenticated, serverUrl } = useContext(userDataContext);
  const [activeTab, setActiveTab] = useState("stats");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isChatOpenOnMobile, setIsChatOpenOnMobile] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Flat list of all nav items for currentLabel lookup
  const allNavItems = desktopNavGroups.flatMap((g) => g.items);

  const handleTabChange = (tab) => {
    if (tab === "__more__") {
      setIsMoreOpen(true);
      return;
    }
    setActiveTab(tab);
    setIsMoreOpen(false);
    if (tab !== "tasks") setSelectedProjectForTask("");
  };

  const handleAddTaskFromProject = (projectName) => {
    setSelectedProjectForTask(projectName);
    setActiveTab("tasks");
    setIsMoreOpen(false);
  };

  const currentLabel = allNavItems.find((i) => i.id === activeTab)?.label ?? "Dashboard";

  const renderContent = () => {
    switch (activeTab) {
      case "stats":             return <Statistic />;
      case "projects":          return <ProjectPostView onAddTask={handleAddTaskFromProject} />;
      case "messages":          return <MessageView showChatOnMobile={isChatOpenOnMobile} setShowChatOnMobile={setIsChatOpenOnMobile} />;
      case "quotation":         return <Quotation />;
      case "quotation-history": return <QuotationHistory onDownload={() => setActiveTab("quotation")} />;
      case "users":             return <UserView />;
      case "inquiries":         return <InquiryView />;
      case "project-leads":     return <ProjectInquiryView />;
      case "plans":             return <PlanInquiryView />;
      case "blogs":             return <BlogManager />;
      case "careers":           return <CareerManager />;
      case "applications":      return <ApplicationManager />;
      case "tasks":             return <TodoManager prefilledProject={selectedProjectForTask} />;
      case "profile":           return <AdminProfile />;
      default:                  return <Statistic />;
    }
  };

  const isSecondaryActive = secondaryNav.some((i) => i.id === activeTab);

  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">

      {/* ══ DESKTOP SIDEBAR ════════════════════════════════ */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 68 : 240 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col bg-white border-r border-slate-100 h-screen shrink-0 overflow-hidden z-10"
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center gap-2 px-3 border-b border-slate-100 shrink-0"
          style={{ height: 64 }}
        >
          <AnimatedLogo size="sm" />
          <div
            className={`flex-1 min-w-0 overflow-hidden transition-all duration-200 ${
              isSidebarCollapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono leading-tight whitespace-nowrap">
              Admin
            </p>
            <p className="text-sm font-black text-black font-display uppercase leading-tight whitespace-nowrap">
              VTRC
            </p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-1.5">
          {desktopNavGroups.map((group, gi) => {
            const visibleItems = group.items.filter(
              (item) => !item.superOnly || currentUser?.role === "superadmin"
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={gi} className={gi > 0 ? "mt-1" : ""}>
                {/* Section divider / label */}
                {group.section && (
                  isSidebarCollapsed ? (
                    <div className="border-t border-slate-100 my-2 mx-1" />
                  ) : (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono px-2.5 pt-3 pb-1">
                      {group.section}
                    </p>
                  )
                )}
                {/* Buttons */}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${
                          isSidebarCollapsed
                            ? "justify-center px-0 py-2.5"
                            : "px-2.5 py-2.5"
                        } ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                        style={
                          isActive
                            ? {
                                background:
                                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                                boxShadow:
                                  "0 4px 12px -3px rgba(15, 52, 96, 0.35)",
                              }
                            : {}
                        }
                      >
                        <Icon
                          size={17}
                          strokeWidth={isActive ? 2.5 : 1.8}
                          className="shrink-0"
                        />
                        {!isSidebarCollapsed && (
                          <span className="text-[13px] font-semibold truncate leading-tight">
                            {item.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-1.5 shrink-0 space-y-1">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-50">
              <div className="w-7 h-7 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black uppercase shrink-0">
                {currentUser?.name?.charAt(0) || "V"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentUser?.name || "Admin"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono capitalize">
                  {currentUser?.role || "admin"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
            className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={15} strokeWidth={1.8} className="shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-[13px] font-semibold">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ══ MAIN AREA ══════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── MOBILE TOP BAR (hidden on desktop) ── */}
        <header className="mobile-top-bar lg:hidden">
          <AnimatedLogo size="sm" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider">
              Admin Panel
            </span>
            <span className="text-sm font-bold text-black font-display leading-tight">
              {currentLabel}
            </span>
          </div>
          <button
            onClick={() => handleTabChange("profile")}
            className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black uppercase shrink-0"
          >
            {currentUser?.name?.charAt(0) || "V"}
          </button>
        </header>

        {/* ── DESKTOP HEADER BAR (hidden on mobile) ── */}
        <div
          className="hidden lg:flex items-center justify-between shrink-0 bg-white border-b border-slate-100"
          style={{ height: 64 }}
        >
          {/* Left: collapse toggle + page title */}
          <div className="flex items-center gap-4 pl-4">
            <button
              onClick={() => setIsSidebarCollapsed((s) => !s)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all shrink-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {currentLabel}
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                VTRC Admin Panel
              </p>
            </div>
          </div>

          {/* Right: user info + avatar */}
          <div className="flex items-center gap-3 pr-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {currentUser?.name || "Admin"}
              </p>
              <p className="text-[11px] text-slate-400 capitalize font-mono">
                {currentUser?.role || "admin"}
              </p>
            </div>
            <button
              onClick={() => handleTabChange("profile")}
              className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl flex items-center justify-center text-sm font-black uppercase"
            >
              {currentUser?.name?.charAt(0) || "V"}
            </button>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <main
          className={`mobile-content ${
            activeTab === "messages"
              ? "!p-0 !overflow-hidden"
              : "p-4 lg:p-8"
          }`}
        >
          <div
            className={
              activeTab === "messages"
                ? "h-full"
                : "max-w-2xl lg:max-w-5xl mx-auto w-full"
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={activeTab === "messages" ? "h-full" : ""}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV (hidden on desktop) ── */}
        <nav className="mobile-bottom-nav lg:hidden">
          <div className="bottom-nav-inner">
            {primaryNav.map(({ id, label, icon: Icon }) => {
              const isActive =
                id === "__more__"
                  ? isSecondaryActive || isMoreOpen
                  : activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`bottom-nav-tab ${isActive ? "active" : ""}`}
                >
                  {/* Active background pill */}
                  {isActive && id !== "__more__" && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-[22px]"
                      style={{
                        background:
                          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                        boxShadow: "0 4px 15px -3px rgba(15, 52, 96, 0.45)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {/* More-tab active ring */}
                  {isActive && id === "__more__" && (
                    <motion.div
                      className="absolute inset-0 rounded-[22px] border-2 border-slate-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.18 }}
                    />
                  )}
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive && id !== "__more__" ? "text-white" : ""
                    } ${isActive && id === "__more__" ? "text-slate-800" : ""} ${
                      !isActive ? "text-slate-400" : ""
                    }`}
                  />
                  <span
                    className={`relative z-10 font-bold uppercase font-mono transition-colors duration-200 ${
                      isActive && id !== "__more__" ? "text-white/90" : ""
                    } ${isActive && id === "__more__" ? "text-slate-800" : ""} ${
                      !isActive ? "text-slate-400" : ""
                    }`}
                    style={{ fontSize: "8px", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ══ "MORE" SLIDE-UP DRAWER (mobile only) ═══════════ */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Drawer Sheet */}
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl overflow-hidden"
              style={{ maxHeight: "82vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
                    Navigation
                  </p>
                  <h3 className="text-base font-bold text-black font-display">
                    All Sections
                  </h3>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav Grid */}
              <div
                className="overflow-y-auto px-4 py-3"
                style={{ maxHeight: "calc(82vh - 120px)" }}
              >
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {secondaryNav.map((item) => {
                    if (item.superOnly && currentUser?.role !== "superadmin")
                      return null;
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left ${
                          isActive
                            ? "bg-black text-white"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isActive
                              ? "bg-white/10"
                              : "bg-white border border-slate-200"
                          }`}
                        >
                          <Icon
                            size={15}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={isActive ? "text-white" : "text-slate-600"}
                          />
                        </div>
                        <span className="text-[11px] font-semibold leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Logout */}
                <div className="pt-2 pb-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 transition-all active:scale-95"
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
