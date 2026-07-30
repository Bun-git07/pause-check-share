'use client';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import ClassificationBadge from '@/components/ui/ClassificationBadge';
import { useSettings } from '@/contexts/SettingsContext';
import { useHistory } from '@/contexts/HistoryContext';
import { t } from '@/lib/i18n';
import { HistoryItem } from '@/types';

const TYPE_ICONS: Record<string, string> = {
  facebook_link: '📘', tiktok_link: '🎵', youtube_link: '▶️',
  messenger_message: '💬', image: '🖼️', video: '🎬', screenshot: '📸',
  sms: '📱', email: '📧', social_post: '📲', text: '📝',
};

function timeAgo(date: Date, lang: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (lang === 'km') {
    if (mins < 1) return 'ឥឡូវ';
    if (mins < 60) return `${mins} នាទីមុន`;
    if (hours < 24) return `${hours} ម៉ោងមុន`;
    return `${days} ថ្ងៃមុន`;
  }
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function HistoryPage() {
  const { settings } = useSettings();
  const { history, clearHistory } = useHistory();
  const router = useRouter();
  const lang = settings.language;
  const khmer = lang === 'km';

  const viewResult = (item: HistoryItem) => {
    sessionStorage.setItem('latest_result', JSON.stringify(item.result));
    router.push('/verify/result');
  };

  return (
    <div className="min-h-screen bg-app">
      <TopBar
        title={t('history.title', lang)}
        titleKm="ប្រវត្តិ"
        rightElement={
          history.length > 0 ? (
            <button onClick={clearHistory} className="btn-ghost !w-10 !h-10 !min-h-0 !p-0" aria-label="Clear history">
              <Trash2 size={18} color="var(--color-danger)" />
            </button>
          ) : undefined
        }
      />

      <div className="page-content">
        {history.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
            <div className="text-7xl">📋</div>
            <div>
              <p className="text-lg font-bold mb-1" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('history.empty', lang)}
              </p>
              <p className="text-sm text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                {t('history.empty_sub', lang)}
              </p>
            </div>
            <button onClick={() => router.push('/verify')} className="btn-primary mt-4" style={{ maxWidth: 240 }}>
              {t('home.verify_btn', lang)}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {history.length} {lang === 'km' ? 'ការពិនិត្យ' : 'checks'}
            </p>
            {history.map(item => (
              <button
                key={item.id}
                onClick={() => viewResult(item)}
                className="w-full card p-4 flex items-center gap-3 card-hover text-left"
              >
                {/* Type icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'var(--color-bg)' }}>
                  {TYPE_ICONS[item.contentType] || '📄'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <ClassificationBadge level={item.classification} size="sm" />
                  </div>
                  <p className="text-sm text-muted truncate" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                    {item.inputPreview}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                    <Clock size={11} />
                    <span>{timeAgo(item.timestamp, lang)}</span>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--color-text-muted)" className="shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
