import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { SessionStatistics } from '../../types/analysis';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';

interface ThreatChartProps {
  stats: SessionStatistics;
}

export const ThreatChart: React.FC<ThreatChartProps> = ({ stats }) => {
  const { resolvedScheme } = useTheme();
  const isLight = resolvedScheme === 'light';

  if (stats.totalAnalyzed === 0) {
    return null;
  }

  const classificationData = [
    {
      name: 'Safe',
      value: stats.safeEmailsCount,
      color: '#10b981',
    },
    {
      name: 'Spam / Phishing',
      value: stats.spamPhishingCount,
      color: '#f59e0b',
    },
    {
      name: 'Safety Threat',
      value: stats.personalSafetyThreatsCount,
      color: '#ef4444',
    },
    {
      name: 'Risky URLs',
      value: stats.maliciousOrSuspiciousUrlsCount,
      color: '#f97316',
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold bmac-text">
            Session Breakdown
          </h3>
          <p className="text-xs bmac-muted">
            Summary of {stats.totalAnalyzed} email(s) checked in this session
          </p>
        </div>
        <BarChart3 className="w-5 h-5 bmac-muted" />
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={classificationData}
            margin={{ top: 8, right: 16, left: -20, bottom: 4 }}
          >
            <XAxis
              dataKey="name"
              stroke={isLight ? '#6b7280' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke={isLight ? '#6b7280' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{
                fill: isLight
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.05)',
              }}
              contentStyle={{
                backgroundColor: isLight ? '#ffffff' : '#181b22',
                borderColor: isLight ? '#e5e7eb' : '#2a2f3a',
                borderRadius: '1rem',
                color: isLight ? '#111111' : '#f8fafc',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 10, 10]} maxBarSize={52}>
              {classificationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
