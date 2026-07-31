// ============================================================
// Global TypeScript Types for Pause, Check, Share
// ============================================================

export type Language = 'en' | 'km';

export type ClassificationLevel = 'reliable' | 'needs_verification' | 'potentially_misleading';

export type ContentType =
  | 'image'
  | 'video'
  | 'screenshot'
  | 'facebook_link'
  | 'tiktok_link'
  | 'youtube_link'
  | 'messenger_message'
  | 'sms'
  | 'email'
  | 'social_post'
  | 'text';

export type WarningSeverity = 'low' | 'medium' | 'high';

export interface WarningSign {
  id: string;
  icon: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  severity: WarningSeverity;
}

export type FactCheckVerdict = 'VERIFIED' | 'UNVERIFIED' | 'MISLEADING' | 'FALSE';

export interface AnalysisResult {
  id: string;
  contentType: ContentType;
  classification: ClassificationLevel;
  confidence: number; // 0-100
  warningSigns: WarningSign[];
  explanation: string;
  explanationKm: string;
  recommendations: Recommendation[];
  timestamp: Date;
  inputPreview?: string; // URL or text snippet
  detectedFileName?: string; // Executable or target file name
  isAiGenerated?: boolean;
  aiDetectionType?: 'image' | 'video' | 'deepfake' | 'audio';
  factCheckVerdict?: FactCheckVerdict;
  factCheckSummary?: string;
}

export interface Recommendation {
  id: string;
  icon: string;
  text: string;
  textKm: string;
}

export interface ScamAlert {
  id: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  category: 'financial' | 'health' | 'government' | 'romance' | 'lottery' | 'other';
  date: string;
  severity: 'high' | 'medium';
}

export interface SafetyTip {
  id: string;
  icon: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  icon: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate';
  slides: LessonSlide[];
  quiz: QuizQuestion[];
  completed?: boolean;
}

export interface LessonSlide {
  id: string;
  type: 'intro' | 'info' | 'example' | 'warning' | 'tip';
  title: string;
  titleKm: string;
  content: string;
  contentKm: string;
  imageUrl?: string;
  badExample?: string;
  badExampleKm?: string;
  goodExample?: string;
  goodExampleKm?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionKm: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  explanationKm: string;
}

export interface QuizOption {
  id: string;
  text: string;
  textKm: string;
}

export interface HistoryItem {
  id: string;
  contentType: ContentType;
  classification: ClassificationLevel;
  inputPreview: string;
  timestamp: Date;
  result: AnalysisResult;
}

export interface UserProfile {
  id: string;
  language: Language;
  largeText: boolean;
  voiceEnabled: boolean;
  darkMode: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
}

export interface AppSettings {
  language: Language;
  largeText: boolean;
  voiceEnabled: boolean;
  darkMode: boolean;
}
