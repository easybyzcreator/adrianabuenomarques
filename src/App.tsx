/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import WorkshopsAndCourses from "./components/WorkshopsAndCourses";
import MapaAcolhimento from "./components/MapaAcolhimento";
import MethodologySection from "./components/MethodologySection";
import TestimonialsSection from "./components/TestimonialsSection";
import FooterSection from "./components/FooterSection";
import AdminDashboard from "./components/AdminDashboard";
import { authenticateAnonymously } from "./lib/firebase";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Silently authenticates anonymous user session for lead saving & click tracking
    authenticateAnonymously().catch(console.error);

    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsAdmin(hash === "#/admin" || hash === "#admin");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleBackToSite = () => {
    window.location.hash = "";
    setIsAdmin(false);
  };

  if (isAdmin) {
    return <AdminDashboard onBackToSite={handleBackToSite} />;
  }

  return (
    <div className="bg-brand-bg text-brand-dark min-h-screen font-sans selection:bg-brand-purple/20 selection:text-brand-dark">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Sections Cascade */}
      <main>
        {/* Dynamic Scroll Morph Header */}
        <HeroSection />

        {/* Detailed About & Biography */}
        <AboutSection />

        {/* Clinical Services (Bento interactive Tab layout based on Image 8) */}
        <ServicesSection />

        {/* Dynamic Stepped Timeline Process (Dark immersive background based on Image 5) */}
        <MethodologySection />

        {/* Custom Workshops & Online Courses */}
        <WorkshopsAndCourses />

        {/* Digital Products & Systems */}
        <MapaAcolhimento />

        {/* Testimonials and Evaluations Section */}
        <TestimonialsSection />
      </main>

      {/* Footer & Contact Block */}
      <FooterSection />
    </div>
  );
}

