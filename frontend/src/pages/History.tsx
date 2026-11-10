import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Download,
  Eye,
  X,
} from 'lucide-react';
import type { AnalysisHistoryItem } from '../types/analysis';
import { useAnalysisSession } from '../hooks/useAnalysisSession';
import { useToast } from '../hooks/useToast';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ThreatBadge } from '../components/threats/ThreatBadge';
import { AnalysisResults } from '../components/analyzer/AnalysisResults';

export const History: React.FC = () => {
  const { history, clearHistory, setCurrentAnalysis } = useAnalysisSession();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalItem, setSelectedModalItem] =
    useState<AnalysisHistoryItem | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDetailsModal = (item: AnalysisHistoryItem) => {
    setSelectedModalItem(item);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeDetailsModal = () => {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
    setSelectedModalItem(null);
  };

  const handleOpenInAnalyzer = (item: AnalysisHistoryItem) => {
    closeDetailsModal();
    setCurrentAnalysis(item);
    navigate('/analyzer');
  };

  const handleExportJson = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-ai-history.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify({
      title: 'Exported JSON',
      description: `Saved ${history.length} item(s).`,
      variant: 'info',
    });
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.request.subject.toLowerCase().includes(q) ||
      item.request.sender.toLowerCase().includes(q) ||
      item.response.final_assessment.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bmac-text">
            Session History
          </h1>
          <p className="mt-1 text-sm bmac-subtext">
            Emails checked during your current browser session (resets on refresh).
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportJson}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export JSON
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={clearHistory}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="w-6 h-6" />}
          title="No emails checked yet"
          description="Once you analyze an email, it will show up here for easy comparison."
          action={
            <Link to="/analyzer">
              <Button variant="primary" size="md">
                Check an email
              </Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <div className="relative mb-5">
            <Search className="w-4 h-4 bmac-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Search by subject, sender, or verdict..."
              aria-label="Search history"
              className="w-full rounded-full bmac-soft pl-11 pr-5 py-3 text-sm bmac-text placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#FFDD00]"
            />
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="history-table-caption"
            className="table-wrapper"
          >
            <table className="responsive-stack-table text-left text-sm">
              <caption id="history-table-caption" className="sr-only">
                Session email analysis history
              </caption>
              <thead className="bmac-muted text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)]">
                    Time
                  </th>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)]">
                    Sender
                  </th>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)]">
                    Subject
                  </th>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)]">
                    Spam Model
                  </th>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)]">
                    Verdict
                  </th>
                  <th className="py-3 px-4 font-bold border-b border-[var(--border-subtle)] text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td
                      data-label="Time"
                      className="py-4 px-4 text-xs bmac-muted whitespace-nowrap"
                    >
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td
                      data-label="Sender"
                      className="py-4 px-4 text-xs font-mono bmac-subtext max-w-[180px] truncate"
                    >
                      {item.request.sender}
                    </td>
                    <td
                      data-label="Subject"
                      className="py-4 px-4 font-bold bmac-text max-w-[240px] truncate"
                    >
                      {item.request.subject || '(No Subject)'}
                    </td>
                    <td
                      data-label="Spam Model"
                      className="py-4 px-4 text-xs font-bold whitespace-nowrap"
                    >
                      {item.response.spam_category}
                      {typeof item.response.spam_confidence === 'number' && (
                        <span className="ml-1 bmac-muted font-normal">
                          ({item.response.spam_confidence.toFixed(0)}%)
                        </span>
                      )}
                    </td>
                    <td data-label="Verdict" className="py-4 px-4">
                      <ThreatBadge
                        severity={item.severity}
                        label={item.response.final_assessment}
                      />
                    </td>
                    <td
                      data-label="Details"
                      className="py-4 px-4 text-right whitespace-nowrap"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openDetailsModal(item)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Native Modal Dialog per modern-web-guidance `dialog` */}
      <dialog
        ref={dialogRef}
        aria-labelledby="history-modal-title"
        onClose={() => setSelectedModalItem(null)}
        className="m-auto w-full max-w-3xl rounded-3xl bmac-card p-0 bmac-text shadow-2xl"
      >
        {selectedModalItem && (
          <div className="flex max-h-[88vh] flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
              <h2
                id="history-modal-title"
                className="text-base font-extrabold bmac-text truncate pr-4"
              >
                {selectedModalItem.request.subject || '(No Subject)'}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenInAnalyzer(selectedModalItem)}
                >
                  Edit in Checker
                </Button>
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  aria-label="Close dialog"
                  className="rounded-full bmac-soft p-2 bmac-text cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6">
              <AnalysisResults analysis={selectedModalItem} />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};
