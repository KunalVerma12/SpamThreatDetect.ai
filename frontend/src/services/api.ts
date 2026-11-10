import axios, { AxiosError } from 'axios';
import type {
  EmailAnalysisRequest,
  EmailAnalysisResponse,
  PersonalSafetyThreatsMap,
  SafetyThreatKey,
  SeverityLevel,
  URLReputationReport,
} from '../types/analysis';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds for ML inference + VirusTotal + Groq explanation
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export class ApiServiceError extends Error {
  public readonly statusCode?: number;
  public readonly details?: string;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      details?: string;
      isNetworkError?: boolean;
      isTimeout?: boolean;
    }
  ) {
    super(message);
    this.name = 'ApiServiceError';
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.isNetworkError = options?.isNetworkError ?? false;
    this.isTimeout = options?.isTimeout ?? false;
  }
}

const SAFETY_KEYS: SafetyThreatKey[] = [
  'physical_violence',
  'death_threat',
  'blackmail_extortion',
  'stalking',
];

function validatePredictionResponse(data: unknown): EmailAnalysisResponse {
  if (!data || typeof data !== 'object') {
    throw new ApiServiceError('The backend returned an invalid JSON structure.');
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.spam_prediction !== 'number' ||
    typeof record.spam_category !== 'string' ||
    typeof record.final_assessment !== 'string' ||
    typeof record.explanation !== 'string'
  ) {
    throw new ApiServiceError(
      'Backend response is missing required classification fields.'
    );
  }

  const rawThreats =
    record.personal_safety_threats &&
    typeof record.personal_safety_threats === 'object'
      ? (record.personal_safety_threats as Record<string, unknown>)
      : {};

  const personal_safety_threats: PersonalSafetyThreatsMap = {
    physical_violence: Number(rawThreats.physical_violence ?? 0),
    death_threat: Number(rawThreats.death_threat ?? 0),
    blackmail_extortion: Number(rawThreats.blackmail_extortion ?? 0),
    stalking: Number(rawThreats.stalking ?? 0),
  };

  const detected_personal_safety_threats: SafetyThreatKey[] = Array.isArray(
    record.detected_personal_safety_threats
  )
    ? record.detected_personal_safety_threats.filter((item): item is SafetyThreatKey =>
        typeof item === 'string' && SAFETY_KEYS.includes(item as SafetyThreatKey)
      )
    : SAFETY_KEYS.filter((k) => personal_safety_threats[k] === 1);

  const urls_found: string[] = Array.isArray(record.urls_found)
    ? record.urls_found.filter((u): u is string => typeof u === 'string')
    : [];

  const url_reports: URLReputationReport[] = Array.isArray(record.url_reports)
    ? record.url_reports
        .filter((r): r is Record<string, unknown> => Boolean(r && typeof r === 'object'))
        .map((r) => ({
          url: typeof r.url === 'string' ? r.url : 'URL unavailable',
          status:
            typeof r.status === 'string'
              ? (r.status as URLReputationReport['status'])
              : 'lookup_error',
          ...(typeof r.malicious === 'number' ? { malicious: r.malicious } : {}),
          ...(typeof r.suspicious === 'number' ? { suspicious: r.suspicious } : {}),
          ...(typeof r.harmless === 'number' ? { harmless: r.harmless } : {}),
          ...(typeof r.undetected === 'number' ? { undetected: r.undetected } : {}),
        }))
    : [];

  const spam_confidence =
    typeof record.spam_confidence === 'number' ? record.spam_confidence : null;

  return {
    spam_prediction: record.spam_prediction,
    spam_category: record.spam_category,
    spam_confidence,
    personal_safety_threats,
    detected_personal_safety_threats,
    urls_found,
    url_reports,
    final_assessment: record.final_assessment,
    explanation: record.explanation,
  };
}

export async function analyzeEmail(
  payload: EmailAnalysisRequest
): Promise<EmailAnalysisResponse> {
  // Enforce exact backend contract (ConfigDict(extra="forbid"))
  const sanitizedPayload: EmailAnalysisRequest = {
    text: payload.text,
    subject: payload.subject ?? '',
    sender: payload.sender.trim() || 'unknown',
    receiver: payload.receiver.trim() || 'unknown',
  };

  try {
    const response = await apiClient.post<unknown>('/predict', sanitizedPayload);
    return validatePredictionResponse(response.data);
  } catch (err: unknown) {
    if (err instanceof ApiServiceError) {
      throw err;
    }

    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ detail?: unknown }>;

      if (axiosErr.code === 'ECONNABORTED') {
        throw new ApiServiceError(
          'Analysis timed out. The ML pipeline or external intelligence lookup took too long.',
          { isTimeout: true }
        );
      }

      if (!axiosErr.response) {
        throw new ApiServiceError(
          `Unable to reach the FastAPI backend at ${API_BASE_URL}. Ensure the server is running with "uvicorn app:app --reload".`,
          { isNetworkError: true }
        );
      }

      const status = axiosErr.response.status;
      const detail = axiosErr.response.data?.detail;
      let detailMessage = '';

      if (typeof detail === 'string') {
        detailMessage = detail;
      } else if (Array.isArray(detail)) {
        detailMessage = detail
          .map((d) => {
            if (d && typeof d === 'object' && 'msg' in d) {
              const loc =
                'loc' in d && Array.isArray(d.loc) ? d.loc.join('.') : 'field';
              return `${loc}: ${String(d.msg)}`;
            }
            return JSON.stringify(d);
          })
          .join('; ');
      }

      throw new ApiServiceError(
        status === 422
          ? `Input validation failed (${detailMessage || 'Invalid email fields'}).`
          : `Backend returned HTTP ${status}${detailMessage ? `: ${detailMessage}` : '.'}`,
        {
          statusCode: status,
          details: detailMessage || JSON.stringify(axiosErr.response.data),
        }
      );
    }

    throw new ApiServiceError(
      err instanceof Error ? err.message : 'An unexpected error occurred during analysis.'
    );
  }
}

export async function checkBackendHealth(): Promise<{
  online: boolean;
  latencyMs?: number;
}> {
  const start = performance.now();
  try {
    await apiClient.get('/openapi.json', { timeout: 4000 });
    return {
      online: true,
      latencyMs: Math.round(performance.now() - start),
    };
  } catch {
    return { online: false };
  }
}

export function deriveSeverity(response: EmailAnalysisResponse): SeverityLevel {
  const hasSafetyThreat =
    response.detected_personal_safety_threats.length > 0 ||
    response.final_assessment === 'Potential personal safety threat';

  if (hasSafetyThreat) {
    return 'critical';
  }

  const hasMaliciousUrl = response.url_reports.some(
    (r) => r.status === 'malicious'
  );

  if (hasMaliciousUrl && response.spam_prediction === 1) {
    return 'critical';
  }

  if (
    hasMaliciousUrl ||
    response.spam_prediction === 1 ||
    response.spam_category === 'Spam/Phishing' ||
    response.final_assessment === 'Potential spam/phishing threat' ||
    response.final_assessment === 'Potential malicious URL threat'
  ) {
    return 'high';
  }

  const hasSuspiciousOrUnverifiedUrl =
    response.url_reports.some((r) => r.status !== 'no_malicious_detections') ||
    response.final_assessment === 'No threat detected by model; URL unverified';

  if (hasSuspiciousOrUnverifiedUrl) {
    return 'suspicious';
  }

  return 'safe';
}
