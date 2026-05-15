import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';

import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { Dashboard } from './pages/Dashboard';

import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const App = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-white/10 bg-[#050505] text-[#E5E5E5] relative overflow-hidden">
        <div className="noise-overlay" />
        <div className="fixed inset-0 dot-grid opacity-[0.15] pointer-events-none" />
        
        <Navbar user={user || null} loading={loading} />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Persistent Background Elements */}
        <div className="fixed -bottom-48 -left-48 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed top-48 -right-48 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </Router>
  );
};

export default App;
