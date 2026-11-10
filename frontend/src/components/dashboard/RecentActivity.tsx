import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, MailCheck } from 'lucide-react';
import type { AnalysisHistoryItem } from '../../types/analysis';
import { Card } from '../common/Card';
import { ThreatBadge } from '../threats/ThreatBadge';
import { Button } from '../common/Button';
import { useAnalysisSession } from '../../hooks/useAnalysisSession';

interface RecentActivityProps {
  history: AnalysisHistoryItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ history }) => {
  const navigate = useNavigate();
  const { setCurrentAnalysis } = useAnalysisSession();

  const recentItems = history.slice(0, 5);

  const handleInspect = (item: AnalysisHistoryItem) => {
    setCurrentAnalysis(item);
    navigate('/analyzer');
  };

  if (recentItems.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDD00]/25 text-[#111111] dark:text-[#FFDD00] mb-3">
          <MailCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold bmac-text">
          No emails checked in this session yet
        </h3>
        <p className="mt-1 text-sm bmac-muted max-w-md mx-auto">
          Paste any suspicious email to see its spam score, safety check, link report, and AI summary.
        </p>
        <div className="mt-5">
          <Link to="/analyzer">
            <Button variant="primary" size="md">
              Check your first email
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold bmac-text">
            Recent Checks
          </h3>
          <p className="text-xs bmac-muted">
            Click any email to view the full breakdown
          </p>
        </div>
        <Link
          to="/history"
          className="inline-flex items-center gap-1 text-xs font-bold bmac-text hover:underline"
        >
          <span>See all ({history.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {recentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleInspect(item)}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bmac-soft p-4 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <ThreatBadge
                  severity={item.severity}
                  label={item.response.final_assessment}
                />
                <span className="text-xs bmac-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="mt-1.5 text-sm font-bold bmac-text truncate">
                {item.request.subject || '(No Subject)'}
              </p>
              <p className="text-xs bmac-muted truncate">
                From: {item.request.sender}
              </p>
            </div>

            <Button variant="outline" size="sm">
              View Result
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
