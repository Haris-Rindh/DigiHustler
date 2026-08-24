import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public pages
import { Home } from './components/public/Home';
import { Services } from './components/public/Services';
import { Work } from './components/public/Work';
import { HowItWorks } from './components/public/HowItWorks';
import { About } from './components/public/About';
import { Team } from './components/public/Team';
import { Contact } from './components/public/Contact';
import { DemoOne } from '@/components/ui/demo';

// Internal platform pages (Client Portal)
import { KanbanPipeline } from './components/dashboard/KanbanPipeline';
import { PayoutLedger } from './components/dashboard/PayoutLedger';
import { RosterView } from './components/dashboard/RosterView';
import { AdminSettings } from './components/dashboard/AdminSettings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<DemoOne />} />

              {/* ── Internal Client Portal Routes ── */}
              <Route path="/dashboard" element={<KanbanPipeline />} />
              <Route path="/ledger" element={<PayoutLedger />} />
              <Route path="/roster" element={<RosterView />} />
              <Route path="/admin" element={<AdminSettings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};
