import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public — single-page home
import { Home } from './components/public/Home';

// Internal platform pages (Client Portal)
import { KanbanPipeline }    from './components/dashboard/KanbanPipeline';
import { PayoutLedger }      from './components/dashboard/PayoutLedger';
import { RosterView }        from './components/dashboard/RosterView';
import { AdminSettings }     from './components/dashboard/AdminSettings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* ── Public single-page site ── */}
              <Route path="/" element={<Home />} />

              {/* ── Internal Client Portal ── */}
              <Route path="/dashboard" element={<KanbanPipeline />} />
              <Route path="/ledger"    element={<PayoutLedger />} />
              <Route path="/roster"    element={<RosterView />} />
              <Route path="/admin"     element={<AdminSettings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};
