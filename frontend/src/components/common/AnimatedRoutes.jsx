import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from "../../features/home/Home";
import About from "../../features/about/About";
import Work from "../../features/works/Work";
import ProjectDetailed from "../../features/works/ProjectDetailed";
import Services from "../../features/services/Services";
import Careers from "../../features/careers/Careers";
import JobDetailed from "../../features/careers/JobDetailed";
import Journal from "../../features/journal/Journal";
import JournalDetailed from "../../features/journal/JournalDetailed";
import Contact from "../../features/contact/Contact";
import StartProject from "../../features/startProject/StartProject";
import Application from "../../features/application/Application";
import Privacy from "../../features/privacy/Privacy";
import Terms from "../../features/terms/Terms";
import PageTransition from "./PageTransition";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about-us" element={<PageTransition><About /></PageTransition>} />
        <Route path="/work" element={<PageTransition><Work /></PageTransition>} />
        <Route path="/work/:projectId" element={<PageTransition><ProjectDetailed /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/careers/:role" element={<PageTransition><JobDetailed /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/journal/:articleId" element={<PageTransition><JournalDetailed /></PageTransition>} />
        <Route path="/contact-us" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/start-project" element={<PageTransition><StartProject /></PageTransition>} />
        <Route path="/application" element={<PageTransition><Application /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
