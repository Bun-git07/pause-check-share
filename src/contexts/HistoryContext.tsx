'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { HistoryItem, AnalysisResult, ContentType } from '@/types';

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'h1',
    contentType: 'facebook_link',
    classification: 'potentially_misleading',
    inputPreview: 'https://facebook.com/share/viral-news-cambodia',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    result: {
      id: 'r1', contentType: 'facebook_link', classification: 'potentially_misleading', confidence: 82,
      warningSigns: [
        { id: 'no_source', icon: '🔍', title: 'No Credible Source', titleKm: 'គ្មានប្រភព', description: '', descriptionKm: '', severity: 'high' },
        { id: 'clickbait', icon: '📢', title: 'Clickbait Headline', titleKm: 'ចំណងជើង Clickbait', description: '', descriptionKm: '', severity: 'medium' },
      ],
      explanation: 'This Facebook link shows multiple warning signs including no credible source and clickbait language.',
      explanationKm: 'តំណ Facebook នេះបង្ហាញសញ្ញាព្រមានច្រើន។',
      recommendations: [
        { id: 'dont_share', icon: '🚫', text: 'Do NOT share this content', textKm: 'កុំចែករំលែក' },
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      inputPreview: 'https://facebook.com/share/viral-news-cambodia',
    },
  },
  {
    id: 'h2',
    contentType: 'messenger_message',
    classification: 'needs_verification',
    inputPreview: 'You have won a prize! Click here to claim your reward immediately...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    result: {
      id: 'r2', contentType: 'messenger_message', classification: 'needs_verification', confidence: 67,
      warningSigns: [
        { id: 'urgency', icon: '⚡', title: 'Creates False Urgency', titleKm: 'ភាពបន្ទាន់ក្លែងក្លាយ', description: '', descriptionKm: '', severity: 'medium' },
        { id: 'too_good', icon: '🎁', title: 'Too Good to Be True', titleKm: 'ល្អហួសប្រមាណ', description: '', descriptionKm: '', severity: 'high' },
      ],
      explanation: 'This Messenger message uses urgent language and promises of prizes — common scam tactics.',
      explanationKm: 'សារ Messenger នេះប្រើភាសាបន្ទាន់ និង សន្យាអំណោយ។',
      recommendations: [
        { id: 'dont_click', icon: '⚠️', text: 'Do NOT click any links', textKm: 'កុំចុចតំណ' },
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      inputPreview: 'You have won a prize! Click here to claim your reward immediately...',
    },
  },
];

const HistoryContext = createContext<{
  history: HistoryItem[];
  addToHistory: (result: AnalysisResult, type: ContentType, preview: string) => void;
  clearHistory: () => void;
}>({ history: [], addToHistory: () => {}, clearHistory: () => {} });

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);

  const addToHistory = (result: AnalysisResult, type: ContentType, preview: string) => {
    const item: HistoryItem = { id: `h_${Date.now()}`, contentType: type, classification: result.classification, inputPreview: preview, timestamp: new Date(), result };
    setHistory(prev => [item, ...prev]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
