import React, { useState } from 'react';
import { AlertTriangle, Terminal } from 'lucide-react';
import type { EmailAnalysisRequest } from '../types/analysis';
import { analyzeEmail, ApiServiceError } from '../services/api';
import { useAnalysisSession } from '../hooks/useAnalysisSession';
import { useToast } from '../hooks/useToast';
import { EmailForm } from '../components/analyzer/EmailForm';
import { AnalysisLoader } from '../components/analyzer/AnalysisLoader';
import { AnalysisResults } from '../components/analyzer/AnalysisResults';

export const Analyzer: React.FC = () => {
  const { currentAnalysis, recordAnalysis, refreshBackendHealth } =
    useAnalysisSession();
  const { notify } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<{
    message: string;
    details?: string;
    isNetworkError?: boolean;
  } | null>(null);

  const handleAnalyzeSubmit = async (payload: EmailAnalysisRequest) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const response = await analyzeEmail(payload);
      const item = recordAnalysis(payload, response);
      refreshBackendHealth();

      notify({
        title: 'Email Checked!',
        description: item.response.final_assessment,
        variant:
          item.severity === 'safe'
            ? 'success'
            : item.severity === 'suspicious'
            ? 'warning'
            : 'error',
      });
    } catch (err: unknown) {
      if (err instanceof ApiServiceError) {
        setErrorState({
          message: err.message,
          details: err.details,
          isNetworkError: err.isNetworkError,
        });
        notify({
          title: 'Could not check email',
          description: err.message,
          variant: 'error',
        });
      } else {
        const fallback =
          err instanceof Error
            ? err.message
            : 'Unexpected error communicating with backend.';
        setErrorState({ message: fallback });
        notify({
          title: 'Error',
          description: fallback,
          variant: 'error',
        });
      }
      refreshBackendHealth();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Simple Centered Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bmac-text">
          Email Threat Checker
        </h1>
        <p className="mt-2 text-sm sm:text-base bmac-subtext">
          Paste an email below or pick a quick sample to test spam, safety threats, links, and AI explanation.
        </p>
      </div>

      {/* Main Analyzer Form */}
      <EmailForm
        onSubmit={handleAnalyzeSubmit}
        isLoading={isLoading}
        initialValues={currentAnalysis?.request}
      />

      {/* Friendly Error Banner */}
      {errorState && (
        <div
          role="alert"
          className="max-w-3xl mx-auto rounded-3xl border border-red-500/30 bg-red-500/10 p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-red-700 dark:text-red-300">
                Could not complete analysis
              </h3>
              <p className="text-xs sm:text-sm bmac-text leading-relaxed">
                {errorState.message}
              </p>
              {errorState.isNetworkError && (
                <div className="mt-3 flex items-center gap-2 rounded-2xl bmac-card px-4 py-2.5 font-mono text-xs bmac-text">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <span>./venv/bin/uvicorn app:app --reload</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <AnalysisLoader />}

      {/* Results */}
      {!isLoading && currentAnalysis && (
        <AnalysisResults analysis={currentAnalysis} />
      )}
    </div>
  );
};
