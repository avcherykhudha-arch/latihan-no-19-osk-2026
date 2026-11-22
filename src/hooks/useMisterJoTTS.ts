import { useCallback, useEffect, useRef, useState } from 'react';
import { sanitizeForSpeech } from '../utils/speechText';

export type SpeechStatus = 'idle' | 'speaking' | 'paused';

export interface MisterJoVoiceState {
  status: SpeechStatus;
  activeTitle: string;
  spokenText: string;
  rate: number;
  voiceAvailable: boolean;
  progressPercent: number;
  speak: (title: string, rawText: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
}

function selectIndonesianMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const idVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('id'));
  const maleKeywords = ['male', 'pria', 'laki', 'ardika', 'ardi', 'damayanti' /* fallback check */, 'google bahasa indonesia'];
  for (const v of idVoices) {
    const lower = v.name.toLowerCase();
    if (maleKeywords.some((kw) => lower.includes(kw) && !lower.includes('female'))) {
      return v;
    }
  }
  if (idVoices.length > 0) return idVoices[0];
  const enMale = voices.find((v) => /male|david|daniel|alex|google us/i.test(v.name));
  return enMale || voices[0];
}

export function useMisterJoTTS(): MisterJoVoiceState {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [spokenText, setSpokenText] = useState<string>('');
  const [rate, setRateState] = useState<number>(1.0);
  const [voiceAvailable, setVoiceAvailable] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fallbackTimerRef = useRef<number | null>(null);
  const currentTitleRef = useRef<string>('');
  const currentTextRef = useRef<string>('');
  const progressRef = useRef<number>(0);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceAvailable(false);
      return;
    }
    const updateVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoiceAvailable(list.length > 0);
    };
    updateVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices);
      clearFallbackTimer();
      window.speechSynthesis.cancel();
    };
  }, [clearFallbackTimer]);

  const startFallbackTeleprompter = useCallback(
    (cleanText: string, speechRate: number) => {
      clearFallbackTimer();
      const wordsCount = Math.max(1, cleanText.split(/\s+/).length);
      const durationMs = Math.max(2500, (wordsCount / (2.3 * speechRate)) * 1000);
      const stepMs = 100;
      const stepPct = (stepMs / durationMs) * 100;
      progressRef.current = 0;
      setProgressPercent(0);
      fallbackTimerRef.current = window.setInterval(() => {
        progressRef.current = Math.min(100, progressRef.current + stepPct);
        setProgressPercent(Math.round(progressRef.current));
        if (progressRef.current >= 100) {
          clearFallbackTimer();
          setStatus('idle');
        }
      }, stepMs);
    },
    [clearFallbackTimer]
  );

  const speak = useCallback(
    (title: string, rawText: string) => {
      const clean = sanitizeForSpeech(rawText);
      if (!clean) return;

      clearFallbackTimer();
      currentTitleRef.current = title;
      currentTextRef.current = clean;
      setActiveTitle(title);
      setSpokenText(clean);
      setStatus('speaking');
      setProgressPercent(0);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const utterance = new SpeechSynthesisUtterance(clean);
            const chosenVoice = selectIndonesianMaleVoice(voices);
            if (chosenVoice) utterance.voice = chosenVoice;
            utterance.lang = 'id-ID';
            utterance.rate = rate;
            utterance.pitch = 0.88; // Authoritative adult male tone

            utterance.onboundary = (ev) => {
              if (clean.length > 0 && typeof ev.charIndex === 'number') {
                setProgressPercent(Math.min(100, Math.round((ev.charIndex / clean.length) * 100)));
              }
            };
            utterance.onend = () => {
              clearFallbackTimer();
              setProgressPercent(100);
              setStatus('idle');
            };
            utterance.onerror = () => {
              // Fallback silently to teleprompter mode if synthesis fails
              startFallbackTeleprompter(clean, rate);
            };
            window.speechSynthesis.speak(utterance);
            return;
          }
        } catch {
          // Fall back to teleprompter reader
        }
      }

      startFallbackTeleprompter(clean, rate);
    },
    [clearFallbackTimer, rate, startFallbackTeleprompter]
  );

  const pause = useCallback(() => {
    if (status !== 'speaking') return;
    setStatus('paused');
    clearFallbackTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Ignore if unsupported
      }
    }
  }, [clearFallbackTimer, status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    setStatus('speaking');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
        return;
      } catch {
        // Fallback below
      }
    }
    if (currentTextRef.current) {
      const remainingFraction = Math.max(0.1, (100 - progressRef.current) / 100);
      const wordsCount = Math.max(1, currentTextRef.current.split(/\s+/).length);
      const durationMs = Math.max(1500, ((wordsCount * remainingFraction) / (2.3 * rate)) * 1000);
      const stepMs = 100;
      const stepPct = (stepMs / durationMs) * (100 - progressRef.current);
      fallbackTimerRef.current = window.setInterval(() => {
        progressRef.current = Math.min(100, progressRef.current + stepPct);
        setProgressPercent(Math.round(progressRef.current));
        if (progressRef.current >= 100) {
          clearFallbackTimer();
          setStatus('idle');
        }
      }, stepMs);
    }
  }, [clearFallbackTimer, rate, status]);

  const stop = useCallback(() => {
    clearFallbackTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    setStatus('idle');
    setProgressPercent(0);
    setActiveTitle('');
    setSpokenText('');
  }, [clearFallbackTimer]);

  const setRate = useCallback(
    (newRate: number) => {
      setRateState(newRate);
      if (status === 'speaking' && currentTextRef.current) {
        // Restart current clip smoothly at new speed
        speak(currentTitleRef.current, currentTextRef.current);
      }
    },
    [speak, status]
  );

  return {
    status,
    activeTitle,
    spokenText,
    rate,
    voiceAvailable,
    progressPercent,
    speak,
    pause,
    resume,
    stop,
    setRate,
  };
}
