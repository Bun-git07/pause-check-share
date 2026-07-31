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
import { analyzeContent } from '@/lib/mockAI';
import { useHistory } from '@/contexts/HistoryContext';
import { ContentType, AnalysisResult } from '@/types';

const SEVERITY_COLOR: Record<string, string> = { low: '#43A047', medium: '#F9A825', high: '#E53935' };

export default function ScamCheckerPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { addToHistory } = useHistory();
  const lang = settings.language;
  const khmer = lang === 'km';

  const [mode, setMode] = useState<'upload' | 'text'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideDefaultTab, setGuideDefaultTab] = useState<'link' | 'screenshot'>('screenshot');
  const fileRef = useRef<HTMLInputElement>(null);

  const SCAM_EXAMPLES = [
    { label: lang === 'km' ? 'ឆ្នោត' : 'Lottery', text: 'Congratulations! You have won $5,000 USD. Pay $50 processing fee to receive your prize now!' },
    { label: lang === 'km' ? 'ធនាគារ' : 'Bank', text: 'URGENT: Your NBC Bank account will be suspended. Click here to verify your OTP immediately or lose access.' },
    { label: lang === 'km' ? 'ទំនាក់ទំនង' : 'Romance', text: 'Hi beautiful, I am an American doctor working in Cambodia. I have fallen in love with you. Can you help me with an urgent money transfer?' },
  ];

  const analyze = async () => {
    const input = mode === 'text' ? text : (file?.name ?? '');
    const type: ContentType = mode === 'upload' ? 'screenshot' : 'sms';
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const r = await analyzeContent(input, type);
      setResult(r);
      addToHistory(r, type, input.slice(0, 80));
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
        {result && !analyzing && (
          <div className="space-y-4">
            {/* AI Media / Deepfake Warning Banner */}
            {(result.isAiGenerated || result.warningSigns.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video')) && (
              <div className="card p-4 space-y-2 border-2 border-purple-500 bg-purple-500/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="font-bold text-sm text-purple-700 dark:text-purple-300 uppercase" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {khmer ? '🤖 រកឃើញ វីដេអូ DEEPFAKE / AI' : '🤖 AI MEDIA / DEEPFAKE DETECTED'}
                  </p>
                </div>
                <p className="text-xs text-muted leading-relaxed" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer
                    ? 'មាតិកានេះបង្ហាញសញ្ញានៃការបង្កើតដោយ AI ឬ Deepfake (ទម្រង់មុខ/សំឡេងក្លែងក្លាយ)។ សូមកុំផ្ញើប្រាក់ ឬ ជឿជាក់ដោយគ្មានការផ្ទៀងផ្ទាត់!'
                    : 'This message or media contains strong signs of AI generation or Deepfake voice/face manipulation. Never send money or share credentials based on unverified AI media.'}
                </p>
              </div>
            )}

            {/* Classification */}
            <div className="card p-5 text-center space-y-2"
              style={{
                background: result.classification === 'potentially_misleading' ? 'var(--color-danger-light)' : result.classification === 'needs_verification' ? 'var(--color-warning-light)' : 'var(--color-secondary-light)',
                borderColor: result.classification === 'potentially_misleading' ? 'var(--color-danger)' : result.classification === 'needs_verification' ? 'var(--color-warning)' : 'var(--color-secondary)',
                borderWidth: 2,
              }}>
              <div className="text-5xl">{result.classification === 'potentially_misleading' ? '🚨' : result.classification === 'needs_verification' ? '⚠️' : '✅'}</div>
              <p className="font-extrabold text-lg" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {result.classification === 'potentially_misleading'
                  ? (lang === 'km' ? 'ហាក់ដូចជាការបោក!' : 'Likely a Scam!')
                  : result.classification === 'needs_verification'
                  ? (lang === 'km' ? 'ប្រុងប្រយ័ត្ន — ពិនិត្យបន្ថែម' : 'Be Careful — Check More')
                  : (lang === 'km' ? 'ហាក់គ្មានបញ្ហា' : 'Appears OK')}
              </p>
            </div>

            {/* Red Flags */}
            {result.warningSigns.length > 0 && (
              <div className="card p-4 space-y-3">
                <h3 className="font-bold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  🚩 {t('scam.red_flags', lang)}
                </h3>
                {result.warningSigns.map(ws => (
                  <div key={ws.id} className="flex gap-2 items-start">
                    <span className="text-xl">{ws.icon}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                        {khmer ? ws.titleKm : ws.title}
                      </p>
                      {ws.description && (
                        <p className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                          {khmer ? ws.descriptionKm : ws.description}
                        </p>
                      )}
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: `${SEVERITY_COLOR[ws.severity]}22`, color: SEVERITY_COLOR[ws.severity] }}>
                      {ws.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendation */}
            <div className="card p-4 space-y-2">
              <h3 className="font-bold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                ✅ {t('scam.recommendation', lang)}
              </h3>
              {result.recommendations.map(r => (
                <div key={r.id} className="flex gap-2 items-center p-2 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-sm font-medium" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {khmer ? r.textKm : r.text}
                  </span>
                </div>
              ))}
            </div>
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
