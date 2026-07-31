'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Share2, Save, RefreshCw, Info } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import ClassificationBadge from '@/components/ui/ClassificationBadge';
import { useSettings } from '@/contexts/SettingsContext';
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
  const lang = settings.language;
  const khmer = lang === 'km';
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('latest_result');
    if (!raw) { router.replace('/verify'); return; }
    try { setResult(JSON.parse(raw)); } catch { router.replace('/verify'); }
  }, [router]);

  if (!result) return null;

  const hasExecutable = result.warningSigns.some(w => w.id === 'executable_file') || !!result.detectedFileName;
  const detectedFileName = result.detectedFileName || 'photo_2025-07-16_16-30-11.exe';
  const config = CLASSIFICATION_COLORS[result.classification];
  const explanation = khmer ? result.explanationKm : result.explanation;

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('result.title', lang)} titleKm="លទ្ធផលវិភាគ" showBack />

      <div className="page-content space-y-5">
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
