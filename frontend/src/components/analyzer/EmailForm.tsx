import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import type { EmailAnalysisRequest } from '../../types/analysis';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface EmailFormProps {
  onSubmit: (payload: EmailAnalysisRequest) => Promise<void>;
  isLoading: boolean;
  initialValues?: EmailAnalysisRequest;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FieldErrors {
  subject?: string;
  sender?: string;
  receiver?: string;
  text?: string;
}

interface SamplePreset {
  label: string;
  emoji: string;
  data: EmailAnalysisRequest;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: 'Try Phishing Email',
    emoji: '🎣',
    data: {
      subject: 'URGENT: Account Suspended - Verify Immediately',
      sender: 'security@paypal-verify-login.xyz',
      receiver: 'user@example.com',
      text: 'URGENT! Your account has been suspended due to suspicious activity! Click here immediately to verify your password and bank login details: http://192.168.1.1/paypal-login-verify-secure-update or lose access forever! WIN FREE CASH PRIZE NOW $$$$!',
    },
  },
  {
    label: 'Try Safety Threat',
    emoji: '⚠️',
    data: {
      subject: 'I know where you live and work',
      sender: 'anon.watcher99@protonmail.com',
      receiver: 'target.user@example.com',
      text: 'I have been watching your house every night and following you home. Give me 5000 dollars or I will kill you and beat you up.',
    },
  },
  {
    label: 'Try Safe Email',
    emoji: '✅',
    data: {
      subject: 'Q3 Engineering Architecture Review Notes',
      sender: 'alex.rivera@gmail.com',
      receiver: 'team.platform@gmail.com',
      text: 'Hi team,\n\nThanks everyone for joining the Q3 architecture review session this morning. Attached in our internal workspace are the action items covering service latency improvements and database indexing.\n\nLet us reconvene on Thursday at 10:00 AM to finalize the deployment checklist.\n\nBest regards,\nAlex',
    },
  },
];

export const EmailForm: React.FC<EmailFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [subject, setSubject] = useState(initialValues?.subject ?? '');
  const [sender, setSender] = useState(initialValues?.sender ?? '');
  const [receiver, setReceiver] = useState(initialValues?.receiver ?? '');
  const [text, setText] = useState(initialValues?.text ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateEmailOrUnknown = (
    value: string,
    fieldName: string
  ): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'unknown') {
      return undefined;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return `Please enter a valid ${fieldName} email (e.g. name@domain.com) or leave blank.`;
    }
    return undefined;
  };

  const validateSingleField = (
    field: keyof FieldErrors,
    value: string
  ): string | undefined => {
    if (field === 'subject') {
      if (value.length > 500) return 'Subject cannot exceed 500 characters.';
      return undefined;
    }
    if (field === 'sender') return validateEmailOrUnknown(value, 'sender');
    if (field === 'receiver') return validateEmailOrUnknown(value, 'receiver');
    if (field === 'text') {
      if (!value.trim()) return 'Please paste the email message to check.';
      if (value.length > 50000)
        return 'Email message cannot exceed 50,000 characters.';
      return undefined;
    }
    return undefined;
  };

  const handleBlur = (field: keyof FieldErrors, value: string) => {
    const errorMsg = validateSingleField(field, value);
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const newErrors: FieldErrors = {
      subject: validateSingleField('subject', subject),
      sender: validateSingleField('sender', sender),
      receiver: validateSingleField('receiver', receiver),
      text: validateSingleField('text', text),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      subject: subject.trim(),
      sender: sender.trim() || 'unknown',
      receiver: receiver.trim() || 'unknown',
      text,
    });
  };

  const handleReset = () => {
    setSubject('');
    setSender('');
    setReceiver('');
    setText('');
    setErrors({});
  };

  const applyPreset = (preset: SamplePreset) => {
    setSubject(preset.data.subject);
    setSender(preset.data.sender);
    setReceiver(preset.data.receiver);
    setText(preset.data.text);
    setErrors({});
  };

  return (
    <Card padding="lg" className="max-w-3xl mx-auto">
      {/* Top Bar: Sample Pills + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bmac-muted mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick test:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={isLoading}
              onClick={() => applyPreset(preset)}
              className="inline-flex items-center gap-1.5 rounded-full bmac-soft px-3.5 py-1.5 text-xs font-bold bmac-text hover:bg-[#FFDD00]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{preset.emoji}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {(subject || sender || receiver || text) && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-xs font-semibold bmac-muted hover:bmac-text cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <form
        action="/predict"
        method="POST"
        noValidate
        onSubmit={handleFormSubmit}
        className="space-y-4"
      >
        {/* Subject */}
        <div>
          <label
            htmlFor="email-subject"
            className="block text-sm font-bold bmac-text mb-1.5"
          >
            Subject
          </label>
          <input
            id="email-subject"
            name="subject"
            type="text"
            maxLength={500}
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              clearFieldError('subject');
            }}
            onBlur={(e) => handleBlur('subject', e.target.value)}
            placeholder="What is the email subject?"
            aria-describedby={
              errors.subject ? 'email-subject-error' : undefined
            }
            aria-invalid={Boolean(errors.subject)}
            className="w-full rounded-2xl bmac-soft px-4 py-3 text-sm bmac-text placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#FFDD00]"
          />
          {errors.subject && (
            <p
              id="email-subject-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email-sender"
              className="block text-sm font-bold bmac-text mb-1.5"
            >
              From (Sender email)
            </label>
            <input
              id="email-sender"
              name="sender"
              type="email"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={sender}
              onChange={(e) => {
                setSender(e.target.value);
                clearFieldError('sender');
              }}
              onBlur={(e) => handleBlur('sender', e.target.value)}
              placeholder="sender@example.com"
              aria-describedby={
                errors.sender ? 'email-sender-error' : undefined
              }
              aria-invalid={Boolean(errors.sender)}
              className="w-full rounded-2xl bmac-soft px-4 py-3 text-sm bmac-text placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#FFDD00]"
            />
            {errors.sender && (
              <p
                id="email-sender-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.sender}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email-receiver"
              className="block text-sm font-bold bmac-text mb-1.5"
            >
              To (Receiver email)
            </label>
            <input
              id="email-receiver"
              name="receiver"
              type="email"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={receiver}
              onChange={(e) => {
                setReceiver(e.target.value);
                clearFieldError('receiver');
              }}
              onBlur={(e) => handleBlur('receiver', e.target.value)}
              placeholder="you@example.com"
              aria-describedby={
                errors.receiver ? 'email-receiver-error' : undefined
              }
              aria-invalid={Boolean(errors.receiver)}
              className="w-full rounded-2xl bmac-soft px-4 py-3 text-sm bmac-text placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#FFDD00]"
            />
            {errors.receiver && (
              <p
                id="email-receiver-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.receiver}</span>
              </p>
            )}
          </div>
        </div>

        {/* Email Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="email-body"
              className="block text-sm font-bold bmac-text"
            >
              Email Message
            </label>
            <span className="text-xs bmac-muted">
              {text.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            id="email-body"
            name="text"
            required
            rows={7}
            maxLength={50000}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              clearFieldError('text');
            }}
            onBlur={(e) => handleBlur('text', e.target.value)}
            placeholder="Paste the email content here..."
            aria-describedby={errors.text ? 'email-body-error' : undefined}
            aria-invalid={Boolean(errors.text)}
            className="w-full rounded-2xl bmac-soft p-4 text-sm bmac-text placeholder:text-[var(--text-muted)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FFDD00] resize-y"
          />
          {errors.text && (
            <p
              id="email-body-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.text}</span>
            </p>
          )}
        </div>

        {/* Buy Me a Coffee style Yellow Pill CTA */}
        <div className="pt-3 text-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<ShieldCheck className="w-5 h-5" />}
            className="w-full sm:w-auto min-w-[260px]"
          >
            {isLoading ? 'Checking email...' : 'Check this email'}
          </Button>
          <p className="mt-2.5 text-xs bmac-muted">
            Checks spam/phishing, personal safety threats, URLs & Groq AI explanation in one click.
          </p>
        </div>
      </form>
    </Card>
  );
};
