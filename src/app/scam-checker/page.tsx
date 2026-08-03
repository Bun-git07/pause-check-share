'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, MessageSquare } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { AnalyzingOverlay } from '@/components/ui/LoadingSpinner';
import GuideModal from '@/components/ui/GuideModal';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';
import { ContentType } from '@/types';

const SEVERITY_COLOR: Record<string, string> = { low: '#43A047', medium: '#F9A825', high: '#E53935' };

export default function ScamCheckerPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const lang = settings.language;
  const khmer = lang === 'km';

  const [mode, setMode] = useState<'upload' | 'text'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideDefaultTab, setGuideDefaultTab] = useState<'link' | 'screenshot'>('screenshot');
  const fileRef = useRef<HTMLInputElement>(null);

  const SCAM_EXAMPLES = [
    { label: lang === 'km' ? 'ឆ្នោត' : 'Lottery', text: 'Congratulations! You have won $5,000 USD. Pay $50 processing fee to receive your prize now!' },
    { label: lang === 'km' ? 'ធនាគារ' : 'Bank', text: 'URGENT: Your NBC Bank account will be suspended. Click here to verify your OTP immediately or lose access.' },
    { label: lang === 'km' ? 'ទំនាក់ទំនង' : 'Romance', text: 'Hi beautiful, I am an American doctor working in Cambodia. I have fallen in love with you. Can you help me with an urgent money transfer?' },
  ];

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const analyze = async () => {
    const input = mode === 'text' ? text : (file?.name ?? '');
    if (!input.trim() && !file) return;
    
    setAnalyzing(true);
    setAiResponse(null);
    try {
      const formData = new FormData();
      if (mode === 'upload' && file) {
        formData.append('file', file);
      } else if (mode === 'text' && text.trim()) {
        formData.append('text', text);
      }
      formData.append('language', lang);

      const res = await fetch('/api/check', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setAiResponse(data.result || data.error || 'No result returned');
    } catch (err) {
      console.error(err);
      setAiResponse('Error connecting to the analysis server.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('scam.title', lang)} titleKm="ពិនិត្យការបោក" />

      <div className="page-content space-y-5">
        {/* Intro */}
        <div className="card p-4 flex items-center justify-between gap-3" style={{ background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', borderWidth: 1.5 }}>
          <div className="flex gap-3 items-start flex-1">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="font-bold text-sm mb-1" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('scam.title', lang)}
              </p>
              <p className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('scam.subtitle', lang)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGuideDefaultTab(mode === 'upload' ? 'screenshot' : 'link');
              setGuideOpen(true);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 shrink-0 shadow-xs"
            style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
          >
            💡 {lang === 'km' ? 'របៀបប្រើ?' : 'How to?'}
          </button>
        </div>

        {/* Mode switcher */}
        <div className="flex gap-2 p-1 bg-[var(--color-border)] rounded-2xl">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${mode === 'text' ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' : 'text-muted'}`}
            style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
          >
            <MessageSquare size={14} className="inline mr-1" /> {t('scam.type_btn', lang)}
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${mode === 'upload' ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' : 'text-muted'}`}
            style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
          >
            <Upload size={14} className="inline mr-1" /> {t('scam.upload_btn', lang)}
          </button>
        </div>

        {mode === 'text' ? (
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={lang === 'km' ? 'វាយ ឬ បិទភ្ជាប់សារគួរអោយសង្ស័យ...' : 'Type or paste the suspicious message here...'}
              rows={5}
              className="input-field resize-none"
              style={{ minHeight: 120, fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.6 }}
            />
            {/* Quick Examples */}
            <p className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {lang === 'km' ? '💡 ឧទាហរណ៍:' : '💡 Try an example:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {SCAM_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setText(ex.text)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] transition-all"
                  style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[var(--color-primary)] rounded-2xl p-8 flex flex-col items-center gap-3 hover:bg-[var(--color-primary-light)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
                <Upload size={28} color="var(--color-primary)" />
              </div>
              <p className="text-sm font-bold text-[var(--color-primary)] text-center" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {file ? file.name : t('scam.upload_btn', lang)}
              </p>
            </button>
          </div>
        )}

        <button
          onClick={analyze}
          disabled={analyzing || (mode === 'text' ? text.trim().length < 5 : !file)}
          className="btn-primary"
        >
          {analyzing ? '⏳' : '🚨'} {t('scam.analyze_btn', lang)}
        </button>

        {/* Analyzing overlay inline */}
        {analyzing && (
          <AnalyzingOverlay message="Checking for scam signs..." messageKm="កំពុងពិនិត្យការបោក..." lang={lang} />
        )}

        {/* Result */}
        {aiResponse && !analyzing && (
          <div className="card p-5 markdown-body">
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}
      </div>

      <GuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        defaultTab={guideDefaultTab}
      />

      <BottomNav />
    </div>
  );
}
