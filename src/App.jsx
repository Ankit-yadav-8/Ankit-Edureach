import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import { ScrollProgress, BackToTop } from "./components/ScrollUtils.jsx";

import Home from "./pages/Home.jsx";
import JeeMain from "./pages/JeeMain.jsx";
import JeeAdvanced from "./pages/JeeAdvanced.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetail from "./pages/CollegeDetail.jsx";
import Exams from "./pages/Exams.jsx";
import ExamDetail from "./pages/ExamDetail.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import PrivateDetail from "./pages/PrivateDetail.jsx";
import About from "./pages/About.jsx";
import Developer from "./pages/Developer.jsx";
import Compare from "./pages/Compare.jsx";
import Shortlist from "./pages/Shortlist.jsx";
import CompareTray from "./components/CompareTray.jsx";
import Chatbot from "./components/Chatbot.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import NotFound from "./pages/NotFound.jsx";
import ROICalculator from "./components/ROICalculator.jsx";
import ChoiceFilling from "./pages/ChoiceFilling.jsx";
import CollegeMap from "./pages/CollegeMap.jsx";
import CollegesForYou from "./components/CollegesForYou.jsx";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);
  return null;
}

function ROIPage() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 880, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div className="title-bar" style={{ marginBottom: "1.75rem" }}>
          <span className="eyebrow">Financial Planning</span>
          <h1 className="section-title">
            College <span className="accent">ROI Calculator</span>
          </h1>
          <p className="section-sub">
            Estimate your total cost of degree, payback period, and 10-year
            return on investment before you apply.
          </p>
        </div>
        <ROICalculator />
      </div>
    </div>
  );
}

function CollegesForYouPage() {
  return (
    <div className="page" style={{ paddingTop: "2rem" }}>
      <CollegesForYou />
    </div>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div id="progress-bar" />
      <ScrollProgress />
      <ScrollManager />
      <Navbar onSearch={() => setSearchOpen(true)} />

      <main style={{ paddingTop: 68 }}>
        <Routes>
          <Route path="/"                 element={<Home onSearch={() => setSearchOpen(true)} />} />
          <Route path="/jee-main"         element={<JeeMain />} />
          <Route path="/jee-advanced"     element={<JeeAdvanced />} />
          <Route path="/colleges"         element={<Colleges />} />
          <Route path="/colleges/:slug"   element={<CollegeDetail />} />
          <Route path="/exams"            element={<Exams />} />
          <Route path="/exams/:slug"      element={<ExamDetail />} />
          <Route path="/news/:slug"       element={<NewsDetail />} />
          <Route path="/private/:slug"    element={<PrivateDetail />} />
          <Route path="/about"            element={<About />} />
          <Route path="/team/:id"         element={<Developer />} />
          <Route path="/compare"          element={<Compare />} />
          <Route path="/shortlist"        element={<Shortlist />} />
          <Route path="/roi"              element={<ROIPage />} />
          <Route path="/choice-filling"   element={<ChoiceFilling />} />
          <Route path="/college-map"      element={<CollegeMap />} />
          <Route path="/colleges-for-you" element={<CollegesForYouPage />} />
          <Route path="/search"           element={<SearchResults />} />
          <Route path="*"                 element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
      <CompareTray />
      <Chatbot />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}