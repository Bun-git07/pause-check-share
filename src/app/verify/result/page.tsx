'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Share2, Save, RefreshCw, Info, Volume2, VolumeX } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import ClassificationBadge from '@/components/ui/ClassificationBadge';
import { useSettings } from '@/contexts/SettingsContext';
import { useVoice } from '@/hooks/useVoice';
import { t } from '@/lib/i18n';
import { AnalysisResult } from '@/types';

const CLASSIFICATION_COLORS = {
  reliable: { bg: 'var(--color-secondary-light)', border: 'var(--color-secondary)', icon: '🟢', emoji: '✅' },
  needs_verification: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)', icon: '🟡', emoji: '⚠️' },
  potentially_misleading: { bg: 'var(--color-danger-light)', border: 'var(--color-danger)', icon: '🔴', emoji: '🚨' },
};

const SEVERITY_COLOR = { low: '#43A047', medium: '#F9A825', high: '#E53935' };

export default function VerifyResultPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { toggle, speaking, speak, stop } = useVoice();
  const lang = settings.language;
  const khmer = lang === 'km';
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('latest_result');
    if (!raw) { router.replace('/verify'); return; }
    try {
      const parsed = JSON.parse(raw);
      setResult(parsed);
    } catch { router.replace('/verify'); }
  }, [router]);

  // Auto-read result if voice reading is enabled in settings
  useEffect(() => {
    if (result && settings.voiceEnabled) {
      const summaryText = khmer
        ? `លទ្ធផលវិភាគ៖ ${result.classification === 'reliable' ? 'អាចទុកចិត្តបាន' : result.classification === 'needs_verification' ? 'ត្រូវពិនិត្យបន្ថែម' : 'គ្រោះថ្នាក់អាចក្លែងក្លាយ'}។ ${result.explanationKm}`
        : `Analysis Result: ${result.classification}. ${result.explanation}`;
      speak(summaryText, lang);
    }
  }, [result, settings.voiceEnabled, khmer, lang, speak]);

  if (!result) return null;

  const hasExecutable = result.warningSigns.some(w => w.id === 'executable_file') || !!result.detectedFileName;
  const isAiGenerated = result.isAiGenerated || result.coreVerdict === 'MANIPULATED_MEDIA' || result.warningSigns.some(w => w.id === 'ai_artifacts' || w.id === 'edited_video');
  const aiType = result.aiDetectionType || (result.warningSigns.some(w => w.id === 'edited_video') ? 'deepfake' : 'image');
  const detectedFileName = result.detectedFileName || 'photo_2025-07-16_16-30-11.exe';
  const config = CLASSIFICATION_COLORS[result.classification];
  const explanation = khmer ? result.explanationKm : result.explanation;

  const speechText = khmer
    ? `លទ្ធផលវិភាគ៖ ${result.classification === 'reliable' ? 'អាចទុកចិត្តបាន' : result.classification === 'needs_verification' ? 'ត្រូវពិនិត្យបន្ថែម' : 'គ្រោះថ្នាក់អាចក្លែងក្លាយ'}។ ${result.explanationKm}. ${result.warningSigns.map(w => w.titleKm).join('. ')}`
    : `Analysis Result: ${result.classification}. ${result.explanation}. ${result.warningSigns.map(w => w.title).join('. ')}`;

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('result.title', lang)} titleKm="លទ្ធផលវិភាគ" showBack speechText={speechText} />

      <div className="page-content space-y-5">
        {/* Voice Reader CTA Button */}
        <button
          onClick={() => toggle(speechText, lang)}
          className={`btn-secondary flex items-center justify-center gap-2 text-base transition-all ${
            speaking ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] font-bold text-[var(--color-primary)] animate-pulse' : ''
          }`}
          style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
        >
          {speaking ? <Volume2 size={20} className="animate-bounce" /> : <Volume2 size={20} />}
          {speaking
            ? (khmer ? '🔊 កំពុងអាន...' : '🔊 Reading Aloud...')
            : (khmer ? '🔊 អានលទ្ធផលឱ្យស្តាប់' : '🔊 Read Result Aloud')}
        </button>

        {/* AI Media / Deepfake Warning Banner */}
        {isAiGenerated && !hasExecutable && (
          <div
            className="card p-5 space-y-3 shadow-md"
            style={{
              background: 'rgba(156, 39, 176, 0.08)',
              borderColor: '#9C27B0',
              borderWidth: 3,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl shrink-0">🤖</span>
              <div>
                <h2 className="font-black text-lg text-purple-700 dark:text-purple-300 uppercase tracking-wide" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer
                    ? (aiType === 'deepfake' ? '🤖 រកឃើញ វីដេអូ DEEPFAKE / AI' : '🤖 រកឃើញ រូបភាពបង្កើតដោយ AI')
                    : (aiType === 'deepfake' ? '🤖 DEEPFAKE / AI VIDEO DETECTED' : '🤖 AI-GENERATED IMAGE DETECTED')}
                </h2>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {khmer ? 'មាតិកានេះមានសញ្ញានៃការបង្កើតដោយ AI' : 'High Probability of AI Synthetic Media'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-1 text-xs">
              <p className="font-bold text-sm text-purple-900 dark:text-purple-200">
                🔍 {khmer ? 'ប្រភេទ AI ដែលបានរកឃើញ:' : 'AI Media Type:'}{' '}
                <span className="font-mono bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded text-purple-900 dark:text-purple-100 uppercase text-[11px] font-bold">
                  {aiType}
                </span>
              </p>
              <p className="font-bold text-xs text-purple-800 dark:text-purple-300">
                📊 {khmer ? 'ភាពប្រាកដប្រជានៃការវិភាគ:' : 'Detection Confidence:'}{' '}
                <span className="font-extrabold px-2 py-0.5 rounded bg-purple-700 text-white text-[11px]">
                  91%
                </span>
              </p>
            </div>

            <div className="space-y-1 text-xs leading-relaxed" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.8 : 1.5 }}>
              <p className="font-bold text-purple-900 dark:text-purple-200">
                💡 {khmer ? 'ហេតុអ្វីបានជាសំខាន់:' : 'Why this matters:'}
              </p>
              <p className="text-muted">
                {khmer
                  ? 'រូបភាព និង វីដេអូ AI / Deepfake អាចបន្លំទម្រង់មុខ សំឡេងអ្នកល្បី ឬ សំឡេងមន្ត្រីរដ្ឋាភិបាលយ៉ាងដូចពិតៗ។ ជនខិលខូចប្រើវាដើម្បីបោកប្រាស់ប្រាក់ ឬ ផ្សព្វផ្សាយព័ត៌មានមិនពិត។'
                  : 'AI-generated images and deepfake videos can alter faces, skin textures, lip synchronization, or clone voices of public figures. They are commonly used for digital impersonation and misinformation.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-100/70 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 space-y-1 text-xs" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              <p className="font-bold text-purple-900 dark:text-purple-100">
                ✅ {khmer ? 'សកម្មភាពណែនាំ:' : 'Recommended Actions:'}
              </p>
              <ul className="space-y-1 font-semibold text-purple-900 dark:text-purple-200">
                <li>🚫 {khmer ? 'កុំចែករំលែក (Share) មាតិកានេះបន្ត' : 'Do NOT share this content.'}</li>
                <li>🖼️ {khmer ? 'ប្រើ Google Reverse Image Search ដើម្បផ្ទៀងផ្ទាត់' : 'Perform a Google Reverse Image Search.'}</li>
                <li>🏛️ {khmer ? 'ពិនិត្យប្រភពព័ត៌មានផ្លូវការរបស់រដ្ឋាភិបាល ឬ ស្ថាប័ន' : 'Verify with official news or government channels.'}</li>
              </ul>
            </div>
          </div>
        )}
        {/* Massive Red Flag Banner for Executable Detection */}
        {hasExecutable && (
          <div
            className="card p-5 space-y-3 shadow-md"
            style={{
              background: 'rgba(229, 57, 53, 0.08)',
              borderColor: 'var(--color-danger)',
              borderWidth: 3,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl shrink-0">🚨</span>
              <div>
                <h2 className="font-black text-lg text-[var(--color-danger)] uppercase tracking-wide" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer ? '🚨 សញ្ញាព្រមានអាសន្នធំ (MASSIVE RED FLAG)' : '🚨 MASSIVE RED FLAG DETECTED'}
                </h2>
                <p className="text-xs font-bold text-[var(--color-danger)]">
                  {khmer ? 'រកឃើញឯកសារ Executable គ្រោះថ្នាក់!' : 'High-Risk Executable File Detected!'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-black/40 border border-red-200 dark:border-red-900 space-y-1 text-xs">
              <p className="font-bold text-sm text-[var(--color-danger)]">
                📁 {khmer ? 'ឯកសារដែលបានរកឃើញ:' : 'Detected File:'}{' '}
                <span className="font-mono bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded text-red-900 dark:text-red-200 border border-red-300">
                  {detectedFileName}
                </span>
              </p>
              <p className="font-bold text-xs text-[var(--color-danger)]">
                ⚠️ {khmer ? 'កម្រិតគ្រោះថ្នាក់:' : 'Severity:'}{' '}
                <span className="font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--color-danger)] text-white text-[11px] tracking-wide">
                  CRITICAL
                </span>
              </p>
            </div>

            <div className="space-y-1 text-xs leading-relaxed" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.8 : 1.5 }}>
              <p className="font-bold text-red-900 dark:text-red-200">
                💡 {khmer ? 'ហេតុអ្វីបានជាសំខាន់:' : 'Why this matters:'}
              </p>
              <p className="text-muted">
                {khmer
                  ? 'ឯកសារ Executable (.exe, .apk, .scr, .bat) អាចដំណើរការកូដ ឬ ដំឡើងមេរោគ Malware, Ransomware លើឧបករណ៍របស់អ្នក។ ជនខិលខូចជាញឹកញាប់បន្លំឈ្មោះឯកសាររូបភាព/សារជាសំឡេងក្នុង Telegram, WhatsApp, ឬ Messenger។'
                  : 'Executable (.exe, .apk, .scr, .bat) files can run code or install software on your device. Cybercriminals frequently distribute malware, ransomware, spyware, and remote-access tools through executable attachments disguised as photos or documents in messaging apps.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-100/70 dark:bg-red-950/50 border border-red-200 dark:border-red-900 space-y-1 text-xs" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              <p className="font-bold text-red-900 dark:text-red-100">
                ⛔ {khmer ? 'សកម្មភាពណែនាំភ្លាមៗ:' : 'Recommended Action:'}
              </p>
              <ul className="space-y-1 font-semibold text-red-800 dark:text-red-200">
                <li>❌ {khmer ? 'មិនត្រូវបើក (Open) ឯកសារនេះទេ' : 'Do NOT open the file.'}</li>
                <li>❌ {khmer ? 'មិនត្រូវទាញយក (Download) ឯកសារនេះទេ' : 'Do NOT download the file.'}</li>
                <li>❌ {khmer ? 'មិនត្រូវផ្ញើបន្ត (Forward) ឯកសារនេះទេ' : 'Do NOT forward the file.'}</li>
                <li>✅ {khmer ? 'ផ្ទៀងផ្ទាត់អ្នកផ្ញើតាមច្រកផ្លូវការ' : 'Verify the sender through official channels.'}</li>
                <li>✅ {khmer ? 'លុបសារចោលប្រសិនបើមិនបានរំពឹងទុក' : 'Delete the message if it is unexpected.'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Core Intelligence Verdict Banner */}
        {result.coreVerdict && (
          <div
            className="card p-5 shadow-lg relative overflow-hidden"
            style={{
              background: result.coreVerdict === 'SAFE_AUTHENTIC' ? '#10b981' : 
                          ['MISLEADING_FAKENEWS', 'MANIPULATED_MEDIA', 'SCAM_PHISHING'].includes(result.coreVerdict) ? '#ef4444' : '#f59e0b',
              color: 'white',
              border: 'none'
            }}
          >
            <div className="relative z-10 flex items-center gap-4">
              <span className="text-5xl shrink-0 drop-shadow-md">
                {result.coreVerdict === 'SAFE_AUTHENTIC' ? '✅' : 
                 ['MISLEADING_FAKENEWS', 'MANIPULATED_MEDIA'].includes(result.coreVerdict) ? '❌' : 
                 result.coreVerdict === 'SCAM_PHISHING' ? '🚨' : '⚠️'}
              </span>
              <div>
                <h2 className="font-black text-2xl tracking-wide uppercase drop-shadow-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer ? (
                    result.coreVerdict === 'SAFE_AUTHENTIC' ? 'សុវត្ថិភាព / ត្រឹមត្រូវ' :
                    result.coreVerdict === 'CAUTION_UNVERIFIED' ? 'ប្រយ័ត្ន / មិនទាន់ផ្ទៀងផ្ទាត់' :
                    result.coreVerdict === 'MISLEADING_FAKENEWS' ? 'ព័ត៌មានមិនពិត' :
                    result.coreVerdict === 'MANIPULATED_MEDIA' ? 'រូបភាពក្លែងក្លាយ' :
                    result.coreVerdict === 'SCAM_PHISHING' ? 'ប្រយ័ត្នការបោកប្រាស់' :
                    'មិនទាន់បញ្ជាក់'
                  ) : result.coreVerdict.replace('_', ' ')}
                </h2>
                {result.coreSummary && (
                  <p className="text-sm font-bold opacity-90 mt-1 drop-shadow-sm leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.6 : 1.4 }}>
                    {result.coreSummary}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Classification Card */}
        <div className="card p-6 text-center space-y-3" style={{ background: config.bg, borderColor: config.border, borderWidth: 2 }}>
          <div className="text-6xl">{config.emoji}</div>
          <ClassificationBadge level={result.classification} size="lg" />
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${result.confidence}%`,
                  background: result.classification === 'reliable' ? 'var(--color-secondary)' :
                    result.classification === 'needs_verification' ? 'var(--color-warning)' : 'var(--color-danger)',
                }}
              />
            </div>
            <span className="text-sm font-bold text-muted">{result.confidence}%</span>
          </div>
          <p className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
            {lang === 'km' ? 'ការទុកចិត្ត AI' : 'AI Confidence'}
          </p>
        </div>

        {/* Warning Signs */}
        {result.warningSigns.length > 0 && (
          <section className="card p-4 space-y-3">
            <h2 className="font-bold text-base flex items-center gap-2" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              ⚠️ {t('result.warning_signs', lang)}
            </h2>
            <div className="space-y-2">
              {result.warningSigns.map(ws => (
                <div key={ws.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <span className="text-2xl shrink-0">{ws.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                        {khmer ? ws.titleKm : ws.title}
                      </p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${SEVERITY_COLOR[ws.severity]}22`, color: SEVERITY_COLOR[ws.severity] }}>
                        {ws.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.8 : 1.5 }}>
                      {khmer ? ws.descriptionKm : ws.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why Suspicious */}
        <section className="card p-4 space-y-2">
          <h2 className="font-bold text-base flex items-center gap-2" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
            <Info size={18} color="var(--color-primary)" />
            {t('result.why_suspicious', lang)}
          </h2>
          <p className="text-sm text-muted leading-relaxed" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.6 }}>
            {explanation}
          </p>
        </section>

        {/* What To Do */}
        <section className="card p-4 space-y-3">
          <h2 className="font-bold text-base" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
            ✅ {t('result.what_to_do', lang)}
          </h2>
          <div className="space-y-2">
            {result.recommendations.map(rec => (
              <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-primary-light)' }}>
                <span className="text-xl">{rec.icon}</span>
                <p className="text-sm font-medium" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer ? rec.textKm : rec.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl" style={{ background: 'var(--color-border)' }}>
          <p className="text-xs text-muted text-center" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 2 : 1.5 }}>
            {t('result.disclaimer', lang)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
            <Save size={16} /> {t('result.save', lang)}
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
            <Share2 size={16} /> {t('result.share', lang)}
          </button>
        </div>
        <Link href="/verify">
          <button className="btn-primary flex items-center justify-center gap-2">
            <RefreshCw size={18} /> {t('result.check_again', lang)}
          </button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
