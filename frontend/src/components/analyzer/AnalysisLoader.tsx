import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '../common/Card';

export const AnalysisLoader: React.FC = () => {
  return (
    <Card className="max-w-3xl mx-auto text-center py-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFDD00] text-[#111111] mb-4">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <h3 className="text-lg font-extrabold bmac-text">
        Analyzing your email...
      </h3>
      <p className="mt-1.5 text-sm bmac-muted max-w-md mx-auto">
        Running ML spam detection, personal safety checks, VirusTotal link verification, and Groq AI explanation.
      </p>
    </Card>
  );
};
