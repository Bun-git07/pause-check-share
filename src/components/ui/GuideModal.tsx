'use client';

import React, { useState } from 'react';
import { X, Smartphone, Apple, Link2, Camera, MessageSquare, HelpCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/lib/i18n';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'link' | 'screenshot' | 'message';
}

export default function GuideModal({ isOpen, onClose, defaultTab = 'link' }: GuideModalProps) {
  const { settings } = useSettings();
  const lang = settings.language;
  const khmer = lang === 'km';

  const [activeTab, setActiveTab] = useState<'link' | 'screenshot' | 'message'>(defaultTab);
  const [device, setDevice] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  const isIos = device === 'ios';

  let step1 = '';
  let step2 = '';

  if (activeTab === 'link') {
    step1 = isIos ? t('guide.ios_link_s1', lang) : t('guide.android_link_s1', lang);
    step2 = isIos ? t('guide.ios_link_s2', lang) : t('guide.android_link_s2', lang);
  } else if (activeTab === 'screenshot') {
    step1 = isIos ? t('guide.ios_ss_s1', lang) : t('guide.android_ss_s1', lang);
    step2 = isIos ? t('guide.ios_ss_s2', lang) : t('guide.android_ss_s2', lang);
  } else {
    step1 = isIos ? t('guide.ios_msg_s1', lang) : t('guide.android_msg_s1', lang);
    step2 = isIos ? t('guide.ios_msg_s2', lang) : t('guide.android_msg_s2', lang);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--color-border)] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[var(--color-primary)] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <HelpCircle size={20} className="text-white" />
            </div>
            <h3 className="font-extrabold text-lg" style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}>
              {t('guide.title', lang)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Action Type Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[var(--color-primary-light)] rounded-2xl">
            <button
              onClick={() => setActiveTab('link')}
              className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                activeTab === 'link'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-primary)] hover:bg-white/50'
              }`}
              style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
            >
              <Link2 size={14} />
              {t('guide.tab_link', lang)}
            </button>
            <button
              onClick={() => setActiveTab('screenshot')}
              className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                activeTab === 'screenshot'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-primary)] hover:bg-white/50'
              }`}
              style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
            >
              <Camera size={14} />
              {t('guide.tab_screenshot', lang)}
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                activeTab === 'message'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-primary)] hover:bg-white/50'
              }`}
              style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
            >
              <MessageSquare size={14} />
              {t('guide.tab_message', lang)}
            </button>
          </div>

          {/* Device Selector (iOS / Android) */}
          <div className="flex items-center justify-between border border-[var(--color-border)] rounded-xl p-1 bg-[var(--color-background)]">
            <button
              onClick={() => setDevice('ios')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isIos
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Apple size={15} />
              iPhone (iOS)
            </button>
            <button
              onClick={() => setDevice('android')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                !isIos
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Smartphone size={15} />
              Android
            </button>
          </div>

          {/* 2-Step Microcopy Content Cards */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="card p-4 flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] font-extrabold flex items-center justify-center shrink-0">
                1
              </div>
              <p
                className="text-sm font-medium leading-relaxed text-[var(--color-text-main)] pt-1"
                style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.8 : 1.5 }}
              >
                {step1}
              </p>
            </div>

            {/* Step 2 */}
            <div className="card p-4 flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-secondary-light)] text-[var(--color-secondary)] font-extrabold flex items-center justify-center shrink-0">
                2
              </div>
              <p
                className="text-sm font-medium leading-relaxed text-[var(--color-text-main)] pt-1"
                style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit', lineHeight: khmer ? 1.8 : 1.5 }}
              >
                {step2}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-border)] flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary w-full py-3 text-sm"
            style={{ fontFamily: khmer ? 'var(--font-khmer)' : 'inherit' }}
          >
            {t('common.done', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
