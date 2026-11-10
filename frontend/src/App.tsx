import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './hooks/useToast';
import { AnalysisSessionProvider } from './hooks/useAnalysisSession';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Analyzer } from './pages/Analyzer';
import { History } from './pages/History';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AnalysisSessionProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/history" element={<History />} />
                <Route path="/intelligence" element={<ThreatIntelligence />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AnalysisSessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
