'use client';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Bell, Lightbulb } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';
import { ScamAlert, SafetyTip } from '@/types';

const SCAM_ALERTS: ScamAlert[] = [
  { id: '1', title: 'Fake NBC Bank Alert', titleKm: 'ការព្រមានធនាគារ NBC ក្លែងក្លាយ', description: 'Scammers sending fake NBC bank verification SMS asking for OTP codes.', descriptionKm: 'ជនបោកប្រាស់ផ្ញើ SMS ក្លែងក្លាយ NBC ស្នើ OTP។', category: 'financial', date: 'July 2026', severity: 'high' },
  { id: '2', title: 'Fake Government Health Lottery', titleKm: 'ឆ្នោតសុខភាពរដ្ឋាភិបាលក្លែងក្លាយ', description: 'Viral Facebook posts claiming Ministry of Health is giving away free medicine prizes.', descriptionKm: 'ប្រកាស Facebook ក្លែងក្លាយអំពីក្រសួងសុខាភិបាលផ្ដល់ថ្នាំ។', category: 'health', date: 'July 2026', severity: 'high' },
  { id: '3', title: 'TikTok Investment Scam', titleKm: 'ការបោក TikTok វិនិយោគ', description: 'TikTok videos promising 300% returns on cryptocurrency investment in Cambodia.', descriptionKm: 'វីដេអូ TikTok សន្យាត្រឡប់ 300% លើ crypto នៅកម្ពុជា។', category: 'financial', date: 'June 2026', severity: 'high' },
  { id: '4', title: 'Fake PM Announcement', titleKm: 'ប្រកាសក្លែងក្លាយនាយករដ្ឋមន្ត្រី', description: 'AI-generated video of PM Hun Manet making false policy announcements.', descriptionKm: 'វីដេអូ AI របស់ ហ៊ុន ម៉ាណែត ថ្លែងគោលនយោបាយក្លែងក្លាយ។', category: 'government', date: 'June 2026', severity: 'high' },
];

const SAFETY_TIPS: SafetyTip[] = [
  { id: '1', icon: '⏸️', title: 'Pause & Think', titleKm: 'ឈប់ហើយគិត', description: 'Take 10 seconds before sharing anything.', descriptionKm: 'យក 10 វិនាទីមុននឹងចែករំលែក។' },
  { id: '2', icon: '🔍', title: 'Check the Source', titleKm: 'ពិនិត្យប្រភព', description: 'Always look for who originally posted.', descriptionKm: 'ស្វែងរកអ្នកដែលបានប្រកាសដើម។' },
  { id: '3', icon: '🤖', title: 'AI Images Look Odd', titleKm: 'រូបភាព AI ក្លែងក្លាយ', description: 'Check hands, eyes, and backgrounds carefully.', descriptionKm: 'ពិនិត្យដៃ ភ្នែក និងផ្ទៃខាងក្រោយ។' },
  { id: '4', icon: '💰', title: 'Never Send Money', titleKm: 'មិនត្រូវផ្ញើប្រាក់', description: 'Legitimate organizations never ask via messenger.', descriptionKm: 'ស្ថាប័នស្របច្បាប់មិនដែលស្នើ Messenger។' },
];

export default function HomePage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const khmer = lang === 'km';

  return (
    <div className="min-h-screen bg-app">
      {/* Hero Banner */}
      <div className="gradient-primary text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
          <div>
            <p className="text-sm opacity-75" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {t('home.welcome', lang)}
            </p>
            <p className="font-extrabold text-base" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {t('app.name', lang)}
            </p>
          </div>
        </div>
        <h2
          className="text-2xl font-extrabold mb-2 leading-tight"
          style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
        >
          {t('home.subtitle', lang)}
        </h2>
        <p className="text-sm opacity-80 mb-6" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
          {t('app.tagline', lang)}
        </p>
        <Link href="/verify">
          <button className="w-full bg-white text-[var(--color-primary)] rounded-2xl py-5 text-xl font-extrabold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <span>{t('home.verify_btn', lang)}</span>
          </button>
        </Link>
      </div>

      <div className="page-content pt-5 space-y-6">
        {/* Scam Alerts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={18} color="var(--color-danger)" />
              <h3 className="font-bold text-base" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('home.recent_scams', lang)}
              </h3>
            </div>
            <button className="text-sm text-primary font-medium" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {t('home.see_all', lang)}
            </button>
          </div>
          <div className="space-y-3">
            {SCAM_ALERTS.slice(0, 3).map(alert => (
              <div key={alert.id} className="card p-4 flex gap-3 items-start card-hover cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ background: 'var(--color-danger-light)' }}>
                  <AlertTriangle size={20} color="var(--color-danger)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-0.5 leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {khmer ? alert.titleKm : alert.title}
                  </p>
                  <p className="text-xs text-muted leading-snug line-clamp-2" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {khmer ? alert.descriptionKm : alert.description}
                  </p>
                  <span className="text-xs text-muted mt-1 block">{alert.date}</span>
                </div>
                <ChevronRight size={16} color="var(--color-text-muted)" className="shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} color="var(--color-warning)" />
            <h3 className="font-bold text-base" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {t('home.safety_tips', lang)}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SAFETY_TIPS.map(tip => (
              <div key={tip.id} className="card p-4 card-hover cursor-pointer">
                <div className="text-3xl mb-2">{tip.icon}</div>
                <p className="font-bold text-sm mb-1 leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer ? tip.titleKm : tip.title}
                </p>
                <p className="text-xs text-muted leading-snug" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {khmer ? tip.descriptionKm : tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/learn" className="card p-4 flex flex-col items-center gap-2 text-center card-hover cursor-pointer">
              <span className="text-3xl">📚</span>
              <span className="font-bold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('nav.learn', lang)}
              </span>
              <span className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {lang === 'km' ? 'មេរៀន 7' : '7 Lessons'}
              </span>
            </Link>
            <Link href="/scam-checker" className="card p-4 flex flex-col items-center gap-2 text-center card-hover cursor-pointer">
              <span className="text-3xl">🚨</span>
              <span className="font-bold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('nav.scam', lang)}
              </span>
              <span className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {lang === 'km' ? 'ពិនិត្យការបោក' : 'Check messages'}
              </span>
            </Link>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
