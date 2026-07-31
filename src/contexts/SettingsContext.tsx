'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppSettings } from '@/types';

const defaultSettings: AppSettings = {
  language: 'km',
  largeText: false,
  voiceEnabled: false,
  darkMode: false,
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}>({
  settings: defaultSettings,
  updateSetting: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chascheck_settings');
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', settings.darkMode);
      document.documentElement.classList.toggle('large-text', settings.largeText);
      document.body.classList.toggle('dark', settings.darkMode);
      document.body.classList.toggle('large-text', settings.largeText);
    }
  }, [settings.darkMode, settings.largeText]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('chascheck_settings', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      <div
        className={`${settings.darkMode ? 'dark' : ''} ${settings.largeText ? 'large-text' : ''}`}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
