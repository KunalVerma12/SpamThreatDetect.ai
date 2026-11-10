export type SafetyThreatKey =
  | 'physical_violence'
  | 'death_threat'
  | 'blackmail_extortion'
  | 'stalking';

export type PersonalSafetyThreatsMap = Record<SafetyThreatKey, number>;

export type URLReputationStatus =
  | 'malicious'
  | 'suspicious'
  | 'no_malicious_detections'
  | 'no_report'
  | 'api_key_missing'
  | 'lookup_error';

export interface URLReputationReport {
  url: string;
  status: URLReputationStatus;
  malicious?: number;
  suspicious?: number;
  harmless?: number;
  undetected?: number;
}

export type SpamCategory = 'Spam/Phishing' | 'Legitimate';

export type FinalAssessment =
  | 'Potential personal safety threat'
  | 'Potential spam/phishing threat'
  | 'Potential malicious URL threat'
  | 'No threat detected'
  | 'No threat detected by model; URL unverified';

export interface EmailAnalysisRequest {
  text: string;
  subject: string;
  sender: string;
  receiver: string;
}

export interface EmailAnalysisResponse {
  spam_prediction: number;
  spam_category: SpamCategory | string;
  spam_confidence: number | null;
  personal_safety_threats: PersonalSafetyThreatsMap;
  detected_personal_safety_threats: SafetyThreatKey[];
  urls_found: string[];
  url_reports: URLReputationReport[];
  final_assessment: FinalAssessment | string;
  explanation: string;
}

export type SeverityLevel = 'safe' | 'suspicious' | 'high' | 'critical';

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  request: EmailAnalysisRequest;
  response: EmailAnalysisResponse;
  severity: SeverityLevel;
}

export interface SessionStatistics {
  totalAnalyzed: number;
  spamPhishingCount: number;
  personalSafetyThreatsCount: number;
  maliciousOrSuspiciousUrlsCount: number;
  safeEmailsCount: number;
  unverifiedUrlsCount: number;
  threatCategoryBreakdown: {
    physical_violence: number;
    death_threat: number;
    blackmail_extortion: number;
    stalking: number;
  };
}
