import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AnalysisHistoryItem,
  EmailAnalysisRequest,
  EmailAnalysisResponse,
  SessionStatistics,
} from '../types/analysis';
import { checkBackendHealth, deriveSeverity } from '../services/api';

interface AnalysisSessionContextValue {
  history: AnalysisHistoryItem[];
  currentAnalysis: AnalysisHistoryItem | null;
  setCurrentAnalysis: (item: AnalysisHistoryItem | null) => void;
  recordAnalysis: (
    request: EmailAnalysisRequest,
    response: EmailAnalysisResponse
  ) => AnalysisHistoryItem;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
  stats: SessionStatistics;
  backendStatus: {
    online: boolean | null;
    latencyMs?: number;
    lastChecked: string | null;
  };
  refreshBackendHealth: () => Promise<void>;
}

const AnalysisSessionContext = createContext<
  AnalysisSessionContextValue | undefined
>(undefined);

export const AnalysisSessionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Explicitly in-memory session state (no fake persistence across refreshes)
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<AnalysisHistoryItem | null>(null);

  const [backendStatus, setBackendStatus] = useState<{
    online: boolean | null;
    latencyMs?: number;
    lastChecked: string | null;
  }>({
    online: null,
    lastChecked: null,
  });

  const refreshBackendHealth = useCallback(async () => {
    const result = await checkBackendHealth();
    setBackendStatus({
      online: result.online,
      latencyMs: result.latencyMs,
      lastChecked: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    refreshBackendHealth();
    const interval = window.setInterval(refreshBackendHealth, 30000);
    return () => window.clearInterval(interval);
  }, [refreshBackendHealth]);

  const recordAnalysis = useCallback(
    (
      request: EmailAnalysisRequest,
      response: EmailAnalysisResponse
    ): AnalysisHistoryItem => {
      const item: AnalysisHistoryItem = {
        id: `anl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        request,
        response,
        severity: deriveSeverity(response),
      };

      setHistory((prev) => [item, ...prev]);
      setCurrentAnalysis(item);
      return item;
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setCurrentAnalysis((curr) => (curr?.id === id ? null : curr));
  }, []);

  const stats = useMemo<SessionStatistics>(() => {
    let spamPhishingCount = 0;
    let personalSafetyThreatsCount = 0;
    let maliciousOrSuspiciousUrlsCount = 0;
    let safeEmailsCount = 0;
    let unverifiedUrlsCount = 0;

    const threatCategoryBreakdown = {
      physical_violence: 0,
      death_threat: 0,
      blackmail_extortion: 0,
      stalking: 0,
    };

    for (const item of history) {
      const { response, severity } = item;

      if (
        response.spam_prediction === 1 ||
        response.spam_category === 'Spam/Phishing'
      ) {
        spamPhishingCount += 1;
      }

      if (response.detected_personal_safety_threats.length > 0) {
        personalSafetyThreatsCount += 1;
      }

      if (response.personal_safety_threats.physical_violence === 1) {
        threatCategoryBreakdown.physical_violence += 1;
      }
      if (response.personal_safety_threats.death_threat === 1) {
        threatCategoryBreakdown.death_threat += 1;
      }
      if (response.personal_safety_threats.blackmail_extortion === 1) {
        threatCategoryBreakdown.blackmail_extortion += 1;
      }
      if (response.personal_safety_threats.stalking === 1) {
        threatCategoryBreakdown.stalking += 1;
      }

      for (const report of response.url_reports) {
        if (report.status === 'malicious' || report.status === 'suspicious') {
          maliciousOrSuspiciousUrlsCount += 1;
        } else if (report.status !== 'no_malicious_detections') {
          unverifiedUrlsCount += 1;
        }
      }

      if (severity === 'safe') {
        safeEmailsCount += 1;
      }
    }

    return {
      totalAnalyzed: history.length,
      spamPhishingCount,
      personalSafetyThreatsCount,
      maliciousOrSuspiciousUrlsCount,
      safeEmailsCount,
      unverifiedUrlsCount,
      threatCategoryBreakdown,
    };
  }, [history]);

  return (
    <AnalysisSessionContext.Provider
      value={{
        history,
        currentAnalysis,
        setCurrentAnalysis,
        recordAnalysis,
        clearHistory,
        removeHistoryItem,
        stats,
        backendStatus,
        refreshBackendHealth,
      }}
    >
      {children}
    </AnalysisSessionContext.Provider>
  );
};

export function useAnalysisSession(): AnalysisSessionContextValue {
  const ctx = useContext(AnalysisSessionContext);
  if (!ctx) {
    throw new Error(
      'useAnalysisSession must be used within an AnalysisSessionProvider'
    );
  }
  return ctx;
}
