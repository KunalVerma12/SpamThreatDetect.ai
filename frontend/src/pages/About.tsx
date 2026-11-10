import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: '1. Spam & Phishing ML Model',
      description:
        'Uses a trained Scikit-learn + XGBoost pipeline (email_spam_detection_model.pkl) with NLTK Porter stemming, 100-D Word2Vec embeddings, and 26 custom URL and text features.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: '2. Personal Safety Threat Model',
      description:
        'Uses a multi-label classifier (email_threat_detection_model.pkl) with WordNet lemmatization to independently detect Physical Violence, Death Threats, Blackmail/Extortion, and Stalking.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '3. VirusTotal Link Intelligence',
      description:
        'Automatically extracts HTTP/HTTPS, www, and Markdown links from the email subject and body and checks them against VirusTotal v3.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: '4. Groq AI Explanation',
      description:
        'Summarizes the evidence from both ML models and VirusTotal into a clear, readable 4–6 sentence explanation using Groq (openai/gpt-oss-20b).',
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bmac-text">
          How Sentinel AI Works
        </h1>
        <p className="mt-2 text-sm sm:text-base bmac-subtext">
          Beyond Spam Detection. Toward Intelligent Threat Awareness.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map((item) => (
          <Card key={item.title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFDD00]/30 text-[#111111] dark:text-[#FFDD00] mb-4">
              {item.icon}
            </div>
            <h2 className="text-base font-extrabold bmac-text">{item.title}</h2>
            <p className="mt-2 text-xs sm:text-sm bmac-subtext leading-relaxed">
              {item.description}
            </p>
          </Card>
        ))}
      </div>

      <Card className="text-center">
        <h3 className="text-lg font-extrabold bmac-text">
          Ready to test an email?
        </h3>
        <p className="mt-1 text-sm bmac-muted max-w-md mx-auto">
          Try one of our built-in test emails or paste your own message to see all 4 layers in action.
        </p>
        <div className="mt-5">
          <Link to="/analyzer">
            <Button variant="primary" size="md">
              Go to Email Checker
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
