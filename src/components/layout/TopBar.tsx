'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface TopBarProps {
  title: string;
  titleKm?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function TopBar({ title, titleKm, showBack = false, rightElement }: TopBarProps) {
  const router = useRouter();
  const { settings, updateSetting } = useSettings();
  const lang = settings.language;
  const displayTitle = lang === 'km' && titleKm ? titleKm : title;

  return (
    <div className="top-bar">
      {showBack && (
        <button
          onClick={() => router.back()}
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
          onClick={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
          className="btn-ghost !w-10 !h-10 !min-h-0 !p-0 shrink-0"
          aria-label={settings.voiceEnabled ? 'Disable voice' : 'Enable voice'}
          title={settings.voiceEnabled ? 'Voice ON' : 'Voice OFF'}
        >
          {settings.voiceEnabled
            ? <Volume2 size={20} color="var(--color-primary)" />
            : <VolumeX size={20} color="var(--color-text-muted)" />
          }
        </button>
      )}
    </div>
  );
}
