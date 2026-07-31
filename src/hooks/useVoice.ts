'use client';
import { useState, useEffect, useCallback } from 'react';
import { speakText, stopSpeech, isSpeaking } from '@/lib/voiceNarration';
import { useSettings } from '@/contexts/SettingsContext';

export function useVoice() {
  const { settings } = useSettings();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const speak = useCallback(
    (text: string, customLang?: 'km' | 'en') => {
      const targetLang = customLang || settings.language;
      speakText(
        text,
        targetLang,
        () => setSpeaking(true),
        () => setSpeaking(false)
      );
    },
    [settings.language]
  );

  const stop = useCallback(() => {
    stopSpeech();
    setSpeaking(false);
  }, []);

  const toggle = useCallback(
    (text: string, customLang?: 'km' | 'en') => {
      if (speaking || isSpeaking()) {
        stop();
      } else {
        speak(text, customLang);
      }
    },
    [speaking, speak, stop]
  );

  return {
    speaking,
    speak,
    stop,
    toggle,
    voiceEnabled: settings.voiceEnabled,
  };
}
