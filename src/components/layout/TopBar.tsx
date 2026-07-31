'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useVoice } from '@/hooks/useVoice';

interface TopBarProps {
  title: string;
  titleKm?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  speechText?: string;
}

export default function TopBar({ title, titleKm, showBack = false, rightElement, speechText }: TopBarProps) {
  const router = useRouter();
  const { settings, updateSetting } = useSettings();
  const { toggle, speaking, stop } = useVoice();
  const lang = settings.language;
  const displayTitle = lang === 'km' && titleKm ? titleKm : title;

  const handleVoiceClick = () => {
    if (!settings.voiceEnabled) {
      updateSetting('voiceEnabled', true);
      toggle(speechText || displayTitle, lang);
    } else if (speaking) {
      stop();
    } else {
      toggle(speechText || displayTitle, lang);
    }
  };

  return (
    <div className="top-bar">
      {showBack && (
        <button
          onClick={() => { stop(); router.back(); }}
          className="btn-ghost !w-10 !h-10 !min-h-0 !p-0 shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <h1
        className="text-lg font-bold flex-1 truncate"
        style={{
          fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'var(--font-sans)',
          color: 'var(--color-text)',
        }}
      >
        {displayTitle}
      </h1>
      {rightElement ?? (
        <button
          onClick={handleVoiceClick}
          className={`btn-ghost !w-10 !h-10 !min-h-0 !p-0 shrink-0 ${speaking ? 'animate-pulse text-[var(--color-primary)]' : ''}`}
          aria-label={settings.voiceEnabled ? 'Voice reading active' : 'Enable voice reading'}
          title={speaking ? 'Speaking...' : settings.voiceEnabled ? 'Voice ON (Tap to read)' : 'Voice OFF'}
        >
          {settings.voiceEnabled || speaking
            ? <Volume2 size={22} color="var(--color-primary)" className={speaking ? 'scale-110 transition-transform' : ''} />
            : <VolumeX size={22} color="var(--color-text-muted)" />
          }
        </button>
      )}
    </div>
  );
}
