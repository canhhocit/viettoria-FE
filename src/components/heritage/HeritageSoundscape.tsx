import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const STORAGE_KEY = 'viettoria_soundscape_disabled';
const DEFAULT_VOLUME = 0.22;
const BELL_INTERVAL_MS = 13000;

export const HeritageSoundscape: React.FC = () => {
  const { t } = useLanguage();

  // By default, audio is ON unless explicitly turned off by the user in this session
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem(STORAGE_KEY) !== 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize or get Web Audio Context
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioContextRef.current) {
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(DEFAULT_VOLUME, ctx.currentTime);
      gain.connect(ctx.destination);
      audioContextRef.current = ctx;
      masterGainRef.current = gain;
    }

    return audioContextRef.current;
  }, []);

  // Procedural Vietnamese Bronze Temple Bell Chime (Chuông Cổ Tự)
  const playBellChime = useCallback((ctx: AudioContext, dest: GainNode) => {
    const now = ctx.currentTime;
    const fundamental = 216; // A3 harmonic
    const partials = [1, 2.02, 3.01, 4.25, 5.43, 7.85];
    const amplitudes = [0.65, 0.45, 0.28, 0.18, 0.1, 0.05];
    const decays = [7.5, 5.2, 3.8, 2.6, 1.8, 1.0];

    partials.forEach((mult, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, now);

      const amp = amplitudes[index] ?? 0.2;
      const decay = decays[index] ?? 3.0;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + decay);
    });
  }, []);

  // Stop loop
  const stopLoop = useCallback(() => {
    if (loopTimerRef.current) {
      window.clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
  }, []);

  // Start the bell chime loop
  const startBellAudio = useCallback(() => {
    const ctx = getAudioContext();
    const dest = masterGainRef.current;
    if (!ctx || !dest) return;

    stopLoop();

    const strikeAndSchedule = () => {
      playBellChime(ctx, dest);
      loopTimerRef.current = window.setInterval(() => {
        if (isPlayingRef.current && ctx.state === 'running') {
          playBellChime(ctx, dest);
        }
      }, BELL_INTERVAL_MS);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        strikeAndSchedule();
      }).catch(() => {
        // Will be resumed on first user interaction
      });
    } else {
      strikeAndSchedule();
    }
  }, [getAudioContext, playBellChime, stopLoop]);

  // Autoplay on mount + handle modern browser autoplay policies via first interaction fallback.
  // The viettoria:start-bell event (from language picker) handles first-visit reliable start.
  useEffect(() => {
    if (!isPlaying) return;

    // Always create AudioContext early and attempt autoplay.
    // For browsers with high media engagement (returning users), this may succeed immediately.
    // For first-visit, the viettoria:start-bell event fires inside the modal click gesture
    // and reliably resumes the context — so a failed attempt here is harmless.
    getAudioContext();
    startBellAudio();

    // Fallback: on the very first user gesture (any click/tap/key), resume if still suspended.
    // This covers returning visitors where autoplay was blocked by the browser.
    const handleFirstUserGesture = () => {
      if (isPlayingRef.current && audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          startBellAudio();
        }).catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleFirstUserGesture, { once: true });
    window.addEventListener('keydown', handleFirstUserGesture, { once: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };
  }, [getAudioContext, isPlaying, startBellAudio]);

  // Listen for the language-picker trigger so the bell starts exactly on that user gesture
  useEffect(() => {
    const handleBellTrigger = () => {
      // Force playing to true on language pick
      setIsPlaying(true);
      isPlayingRef.current = true;
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      const ctx = getAudioContext();
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return;

      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(DEFAULT_VOLUME, now + 0.4);

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          startBellAudio();
        }).catch(() => {});
      } else {
        startBellAudio();
      }
    };

    window.addEventListener('viettoria:start-bell', handleBellTrigger);
    return () => window.removeEventListener('viettoria:start-bell', handleBellTrigger);
  }, [getAudioContext, startBellAudio]);

  // Toggle audio ON / OFF
  const togglePlay = () => {
    const ctx = getAudioContext();
    const masterGain = masterGainRef.current;

    if (isPlaying) {
      // Turn off
      if (ctx && masterGain) {
        const now = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      }
      stopLoop();
      setIsPlaying(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    } else {
      // Turn on
      setIsPlaying(true);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      if (ctx && masterGain) {
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            const now = ctx.currentTime;
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(0.0001, now);
            masterGain.gain.linearRampToValueAtTime(DEFAULT_VOLUME, now + 0.8);
            startBellAudio();
          }).catch(() => {});
        } else {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0.0001, now);
          masterGain.gain.linearRampToValueAtTime(DEFAULT_VOLUME, now + 0.8);
          startBellAudio();
        }
      }
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={
        isPlaying
          ? t('soundscape.mute', 'Tắt âm thanh chuông cổ tự')
          : t('soundscape.play', 'Bật âm thanh chuông cổ tự')
      }
      title={
        isPlaying
          ? t('soundscape.mute', 'Tắt âm thanh chuông cổ tự')
          : t('soundscape.play', 'Bật âm thanh chuông cổ tự')
      }
      className={`relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[2px] border transition-all duration-200 focus:outline-none shrink-0 ${
        isPlaying
          ? 'border-brass/60 bg-forest text-brass shadow-xs hover:border-brass hover:bg-forest-dark'
          : 'border-brass/35 bg-paper-warm/80 text-ink/40 hover:border-brass hover:bg-paper hover:text-forest'
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 size={15} className="text-brass" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
          </span>
        </>
      ) : (
        <VolumeX size={15} />
      )}
    </button>
  );
};
