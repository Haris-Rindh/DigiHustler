import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { CookieConsent } from './components/ui/CookieConsent';

// Public pages
import { Home } from './components/public/Home';
import { Services } from './components/public/Services';
import { Work } from './components/public/Work';
import { CaseStudyDetail } from './components/public/CaseStudyDetail';
import { HowItWorks } from './components/public/HowItWorks';
import { About } from './components/public/About';
import { Team } from './components/public/Team';
import { Blog } from './components/public/Blog';
import { BlogPost } from './components/public/BlogPost';
import { Contact } from './components/public/Contact';
import { PrivacyPolicy } from './components/public/PrivacyPolicy';
import { TermsOfService } from './components/public/TermsOfService';

// Utility & Error pages
import { NotFoundPage } from './components/utility/NotFoundPage';
import { ServerErrorPage } from './components/utility/ServerErrorPage';
import { AccessDeniedPage } from './components/utility/AccessDeniedPage';
import { UnauthorizedPage } from './components/utility/UnauthorizedPage';
import { MaintenancePage } from './components/utility/MaintenancePage';
import { OfflinePage } from './components/utility/OfflinePage';

// Internal platform pages (Client Portal)
import { KanbanPipeline } from './components/dashboard/KanbanPipeline';
import { PayoutLedger } from './components/dashboard/PayoutLedger';
import { RosterView } from './components/dashboard/RosterView';
import { AdminSettings } from './components/dashboard/AdminSettings';

// Helper to scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <CustomCursor />
        <ScrollProgress />
        <OfflineBanner />
        <CookieConsent />
        <div className="flex flex-col min-h-screen bg-[#071e26] text-slate-100 selection:bg-[#1a7a8c] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* ── Public Core Routes ── */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* ── Utility & Error Routes ── */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/403" element={<AccessDeniedPage />} />
              <Route path="/401" element={<UnauthorizedPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/offline" element={<OfflinePage />} />

              {/* ── Internal Client Portal Routes ── */}
              <Route path="/dashboard" element={<KanbanPipeline />} />
              <Route path="/ledger" element={<PayoutLedger />} />
              <Route path="/roster" element={<RosterView />} />
              <Route path="/admin" element={<AdminSettings />} />

              {/* ── Wildcard Fallback Route (404) ── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};
