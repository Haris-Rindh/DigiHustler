import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { CookieConsent } from './components/ui/CookieConsent';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';

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
import { Apply } from './components/public/Apply';
import { PrivacyPolicy } from './components/public/PrivacyPolicy';
import { TermsOfService } from './components/public/TermsOfService';
import { CertificateVerification } from './components/public/CertificateVerification';
import { SaasDevelopmentLanding } from './components/public/LandingPages/SaasDevelopmentLanding';
import { AiAutomationLanding } from './components/public/LandingPages/AiAutomationLanding';
import { DesignSystemLanding } from './components/public/LandingPages/DesignSystemLanding';
import { ClientProjectTracker } from './components/public/ClientProjectTracker';

// Portal & Tiered Management System
import { PortalLogin } from './components/portal/PortalLogin';
import { PortalDashboard } from './components/portal/PortalDashboard';
import { AssignmentWorkspace } from './components/portal/AssignmentWorkspace';
import { PeopleDirectoryView } from './components/portal/PeopleDirectoryView';
import { AnnouncementsFeed } from './components/portal/AnnouncementsFeed';
import { CertificateManager } from './components/portal/CertificateManager';
import { SiteContentManager } from './components/portal/SiteContentManager';
import { ProtectedRoute } from './components/portal/ProtectedRoute';

// Utility & Error pages
import { NotFoundPage } from './components/utility/NotFoundPage';
import { ServerErrorPage } from './components/utility/ServerErrorPage';
import { AccessDeniedPage } from './components/utility/AccessDeniedPage';
import { UnauthorizedPage } from './components/utility/UnauthorizedPage';
import { MaintenancePage } from './components/utility/MaintenancePage';
import { OfflinePage } from './components/utility/OfflinePage';

// Internal platform pages
import { PayoutLedger } from './components/dashboard/PayoutLedger';
import { AdminSettings } from './components/dashboard/AdminSettings';

// Helper to scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Route wrapper to hide public footer on portal and verification pages
const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/portal') || 
    location.pathname.startsWith('/verify') || 
    location.pathname.startsWith('/cert') || 
    ['/dashboard', '/ledger', '/roster', '/admin'].some(p => location.pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] selection:bg-[var(--brand-teal)] selection:text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <ScrollToTop />
            <CustomCursor />
            <ScrollProgress />
            <OfflineBanner />
            <CookieConsent />
            <PWAInstallPrompt />
            <PageContainer>
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
                <Route path="/apply" element={<Apply />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* ── High-Intent International SEO Landing Pages ── */}
                <Route path="/services/saas-mvp-development" element={<SaasDevelopmentLanding />} />
                <Route path="/services/ai-workflow-automation" element={<AiAutomationLanding />} />
                <Route path="/services/brand-identity-design-system" element={<DesignSystemLanding />} />

                {/* ── Private Client Live Project Tracker ── */}
                <Route path="/project/track/:trackingToken" element={<ClientProjectTracker />} />
                <Route path="/project/track" element={<ClientProjectTracker />} />
                <Route path="/project/view" element={<ClientProjectTracker />} />

                {/* ── Public Unauthenticated Certificate Verification ── */}
                <Route path="/verify/:certId" element={<CertificateVerification />} />
                <Route path="/cert/:certId" element={<CertificateVerification />} />
                <Route path="/verify/cert/:certId" element={<CertificateVerification />} />

                {/* ── Staff Portal System (4-Tier Architecture) ── */}
                <Route path="/portal/login" element={<PortalLogin />} />
                <Route path="/portal" element={<ProtectedRoute><PortalDashboard /></ProtectedRoute>} />
                <Route path="/portal/dashboard" element={<ProtectedRoute><PortalDashboard /></ProtectedRoute>} />
                <Route path="/portal/assignments" element={<ProtectedRoute><AssignmentWorkspace /></ProtectedRoute>} />
                <Route path="/portal/roster" element={<ProtectedRoute><PeopleDirectoryView /></ProtectedRoute>} />
                <Route path="/portal/announcements" element={<ProtectedRoute><AnnouncementsFeed /></ProtectedRoute>} />
                <Route path="/portal/certificates" element={<ProtectedRoute><CertificateManager /></ProtectedRoute>} />
                <Route path="/portal/cms" element={<ProtectedRoute><SiteContentManager /></ProtectedRoute>} />
                <Route path="/portal/ledger" element={<ProtectedRoute><PayoutLedger /></ProtectedRoute>} />
                <Route path="/portal/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

                {/* ── Legacy routes redirect to portal login (security hardening) ── */}
                <Route path="/dashboard" element={<Navigate to="/portal/login" replace />} />
                <Route path="/ledger" element={<Navigate to="/portal/login" replace />} />
                <Route path="/roster" element={<Navigate to="/portal/login" replace />} />
                <Route path="/admin" element={<Navigate to="/portal/login" replace />} />
                <Route path="/admin/people" element={<Navigate to="/portal/login" replace />} />
                <Route path="/admin/applicants" element={<Navigate to="/portal/login" replace />} />
                <Route path="/admin/squads" element={<Navigate to="/portal/login" replace />} />

                {/* ── Utility & Error Routes ── */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="/403" element={<AccessDeniedPage />} />
                <Route path="/401" element={<UnauthorizedPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/offline" element={<OfflinePage />} />

                {/* ── Wildcard Fallback Route (404) ── */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageContainer>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AppProvider>
  );
};
