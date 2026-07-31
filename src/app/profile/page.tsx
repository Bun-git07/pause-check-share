'use client';
import { useState } from 'react';
import { Globe, Type, Volume2, Moon, Info, HelpCircle, ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useSettings } from '@/contexts/SettingsContext';
import { useVoice } from '@/hooks/useVoice';
import { t } from '@/lib/i18n';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  description?: string;
}

function Toggle({ label, value, onChange, icon, description }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-4 p-4 text-left"
      aria-pressed={value}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: value ? 'var(--color-primary-light)' : 'var(--color-bg)' }}>
        <span style={{ color: value ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      {/* Toggle pill */}
      <div
        className="w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0"
        style={{ background: value ? 'var(--color-primary)' : 'var(--color-border)' }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: `translateX(${value ? '24px' : '2px'})` }}
        />
      </div>
    </button>
  );
}

export default function ProfilePage() {
  const { settings, updateSetting } = useSettings();
  const { speak, stop } = useVoice();
  const lang = settings.language;
  const khmer = lang === 'km';

  return (
    <div className="min-h-screen bg-app">
      <TopBar title={t('profile.title', lang)} titleKm="ការកំណត់" />

      <div className="page-content space-y-4">
        {/* User Card */}
        <div className="card p-5 text-center gradient-primary text-white rounded-2xl">
          <div className="text-5xl mb-3">👤</div>
          <p className="font-extrabold text-lg">
            {lang === 'km' ? 'អ្នកប្រើ' : 'User'}
          </p>
          <p className="text-sm opacity-80">Pause, Check, Share</p>
        </div>

        {/* Language */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{t('profile.language', lang)}</p>
          </div>
          <div className="flex">
            <button
              onClick={() => updateSetting('language', 'km')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all ${settings.language === 'km' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-muted'}`}
            >
              🇰🇭 ខ្មែរ
            </button>
            <div className="w-px bg-[var(--color-border)]" />
            <button
              onClick={() => updateSetting('language', 'en')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all ${settings.language === 'en' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-muted'}`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Accessibility */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-xs font-bold uppercase tracking-wide text-muted"
              style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {lang === 'km' ? 'ភាពងាយស្រួល' : 'Accessibility'}
            </p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            <Toggle
              label={t('profile.large_text', lang)}
              value={settings.largeText}
              onChange={v => updateSetting('largeText', v)}
              icon={<Type size={18} />}
              description={lang === 'km' ? 'អក្សរ 20px+ ធំងាយមើល' : 'Larger 20px fonts for senior readability'}
            />
            <Toggle
              label={t('profile.voice', lang)}
              value={settings.voiceEnabled}
              onChange={v => {
                updateSetting('voiceEnabled', v);
                if (v) {
                  speak(lang === 'km' ? 'បានបើកការអានជាសំឡេង' : 'Voice reading is now enabled', lang);
                } else {
                  stop();
                }
              }}
              icon={<Volume2 size={18} />}
              description={lang === 'km' ? 'អានអក្សរលើអេក្រង់ជាសំឡេង' : 'Read text aloud on screen'}
            />
            <Toggle
              label={t('profile.dark_mode', lang)}
              value={settings.darkMode}
              onChange={v => updateSetting('darkMode', v)}
              icon={<Moon size={18} />}
              description={lang === 'km' ? 'ពណ៌ងងឹតសម្រាប់ភ្នែក' : 'Easier on eyes in low light'}
            />
          </div>
        </div>

        {/* App Info */}
        <div className="card overflow-hidden">
          <div className="divide-y divide-[var(--color-border)]">
            <button className="w-full flex items-center gap-4 p-4 text-left card-hover">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] flex items-center justify-center">
                <Info size={18} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {t('profile.about', lang)}
                </p>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 text-left card-hover">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] flex items-center justify-center">
                <HelpCircle size={18} color="var(--color-secondary)" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
                  {t('profile.help', lang)}
                </p>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted pb-2">
          🛡️ Pause, Check, Share — {t('profile.version', lang)}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
