'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Shield, Eye, BookOpen } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';

const slides = [
  {
    emoji: '⏸️',
    titleKey: 'onboarding.slide1_title',
    bodyKey: 'onboarding.slide1_body',
    gradient: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
    icon: Shield,
  },
  {
    emoji: '🔍',
    titleKey: 'onboarding.slide2_title',
    bodyKey: 'onboarding.slide2_body',
    gradient: 'linear-gradient(135deg, #43A047 0%, #1B5E20 100%)',
    icon: Eye,
  },
  {
    emoji: '📚',
    titleKey: 'onboarding.slide3_title',
    bodyKey: 'onboarding.slide3_body',
    gradient: 'linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)',
    icon: BookOpen,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { settings, updateSetting } = useSettings();
  const lang = settings.language;
  const [step, setStep] = useState(0);
  const [langSelected, setLangSelected] = useState(false);

  useEffect(() => {
    // If onboarding already done, go to home
    const done = localStorage.getItem('onboarding_done');
    if (done) router.replace('/home');
  }, [router]);

  const finish = () => {
    localStorage.setItem('onboarding_done', '1');
    router.push('/home');
  };

  // Step 0: Language selection
  if (!langSelected) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center px-6 text-white">
        <div className="text-center mb-12">
          <div className="text-7xl mb-6">🛡️</div>
          <h1 className="text-3xl font-extrabold mb-2">Pause, Check, Share</h1>
          <p className="text-xl opacity-80">ឈប់ ពិនិត្យ ចែករំលែក</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <p className="text-center text-lg font-medium opacity-90 mb-6">Choose your language / ជ្រើសរើសភាសា</p>
          <button
            onClick={() => { updateSetting('language', 'km'); setLangSelected(true); }}
            className="w-full bg-white text-[var(--color-primary)] rounded-2xl py-5 text-xl font-bold transition-all hover:scale-105 active:scale-100 shadow-lg"
          >
            🇰🇭 ភាសាខ្មែរ
          </button>
          <button
            onClick={() => { updateSetting('language', 'en'); setLangSelected(true); }}
            className="w-full bg-white/20 border-2 border-white text-white rounded-2xl py-5 text-xl font-bold transition-all hover:bg-white/30 active:scale-100"
          >
            🇺🇸 English
          </button>
        </div>
      </div>
    );
  }

  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: slide.gradient }}>
      {/* Skip button */}
      <div className="flex justify-end p-4 pt-safe">
        <button onClick={finish} className="text-white/70 text-sm font-medium px-4 py-2 rounded-xl hover:text-white transition-colors">
          {t('onboarding.skip', lang)}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-white text-center">
        <div className="text-8xl mb-8 animate-bounce">{slide.emoji}</div>
        <h2
          className="text-2xl font-extrabold mb-4 leading-tight"
          style={{ fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'inherit' }}
        >
          {t(slide.titleKey, lang)}
        </h2>
        <p
          className="text-base opacity-85 leading-relaxed max-w-xs"
          style={{ fontFamily: lang === 'km' ? 'var(--font-khmer)' : 'inherit', lineHeight: lang === 'km' ? '2' : '1.6' }}
        >
          {t(slide.bodyKey, lang)}
        </p>
      </div>

      {/* Dots + Button */}
      <div className="p-8 pb-12 space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === step ? 'w-8 h-3 bg-white' : 'w-3 h-3 bg-white/40'}`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={finish}
            className="w-full bg-white text-[var(--color-primary)] rounded-2xl py-5 text-lg font-extrabold shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
          >
            {t('onboarding.get_started', lang)}
            <span className="text-xl">🚀</span>
          </button>
        ) : (
          <button
            onClick={() => setStep(s => s + 1)}
            className="w-full bg-white/20 border-2 border-white text-white rounded-2xl py-5 text-lg font-bold transition-all hover:bg-white/30 flex items-center justify-center gap-2"
          >
            {t('onboarding.next', lang)}
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
