import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Globe, AlertTriangle } from 'lucide-react';
import type { URLReputationReport } from '../types/analysis';
import { useAnalysisSession } from '../hooks/useAnalysisSession';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { URLReportCard } from '../components/threats/URLReport';

export const ThreatIntelligence: React.FC = () => {
  const { history } = useAnalysisSession();

  const urlRecords = useMemo(() => {
    const list: Array<{
      report: URLReputationReport;
      subject: string;
      id: string;
    }> = [];
    for (const item of history) {
      for (const rep of item.response.url_reports) {
        list.push({
          report: rep,
          subject: item.request.subject || '(No Subject)',
          id: item.id,
        });
      }
    }
    return list;
  }, [history]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight bmac-text">
          URL Reputation Check
        </h1>
        <p className="mt-2 text-sm sm:text-base bmac-subtext">
          Every link found in your checked emails is scanned against VirusTotal.
        </p>
      </div>

      <div className="rounded-3xl bg-amber-500/15 border border-amber-500/30 p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm bmac-text leading-relaxed">
          <strong>Safety Note:</strong> Unverified links (where VirusTotal has no report yet or an API key is missing) are never marked as safe. Always verify unfamiliar links before clicking.
        </p>
      </div>

      {urlRecords.length === 0 ? (
        <EmptyState
          icon={<Globe className="w-6 h-6" />}
          title="No links scanned in this session yet"
          description="Check an email that contains links (like the Phishing sample) to see VirusTotal vendor results here."
          action={
            <Link to="/analyzer">
              <Button variant="primary" size="md">
                Try the Phishing Sample
              </Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <h2 className="text-base font-extrabold bmac-text mb-4">
            Scanned Links ({urlRecords.length})
          </h2>
          <div className="space-y-4">
            {urlRecords.map((rec, idx) => (
              <div key={`${rec.id}-${idx}`} className="space-y-1">
                <span className="text-xs font-semibold bmac-muted px-1">
                  From email: {rec.subject}
                </span>
                <URLReportCard report={rec.report} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
