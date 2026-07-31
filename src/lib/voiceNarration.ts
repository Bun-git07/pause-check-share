// Web Speech API helper for voice reading / narration

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: 'km' | 'en' = 'km',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean markdown icons/emojis from text for smoother reading
  const cleanText = text
    .replace(/[🚨🟢🟡🔴🚩⚠️💡❌✅🏛️💰😱🤖🎬📢🔎🎁⚡🔒🔍👥🖼️🔐💊⛔📁]/g, '')
    .replace(/http[s]?:\/\/\S+/g, 'link')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.9; // Calm speed for accessibility
  utterance.pitch = 1.0;
  utterance.lang = lang === 'km' ? 'km-KH' : 'en-US';

  // Try finding best matching voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetLang = lang === 'km' ? 'km' : 'en';
    const voiceMatch = voices.find(v => v.lang.toLowerCase().includes(targetLang));
    if (voiceMatch) utterance.voice = voiceMatch;
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
