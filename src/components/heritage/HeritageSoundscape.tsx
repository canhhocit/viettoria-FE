import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Bell, Wind, CloudRain, ChevronUp, Sliders } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export type SoundscapeMood = 'bell' | 'wind' | 'rain';

interface MoodConfig {
  id: SoundscapeMood;
  labelKey: string;
  defaultLabel: string;
  descKey: string;
  defaultDesc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const MOODS: MoodConfig[] = [
  {
    id: 'bell',
    labelKey: 'soundscape.bellTitle',
    defaultLabel: 'Chuông Cổ Tự',
    descKey: 'soundscape.bellDesc',
    defaultDesc: 'Tiếng chuông đồng ngân vang thanh tịnh trong sương sớm',
    icon: Bell,
  },
  {
    id: 'wind',
    labelKey: 'soundscape.windTitle',
    defaultLabel: 'Gió Rừng Trúc',
    descKey: 'soundscape.windDesc',
    defaultDesc: 'Gió lùa xào xạc qua rặng tre xanh sân chùa',
    icon: Wind,
  },
  {
    id: 'rain',
    labelKey: 'soundscape.rainTitle',
    defaultLabel: 'Mưa Mái Ngói',
    descKey: 'soundscape.rainDesc',
    defaultDesc: 'Mưa rào êm ả rơi trên lớp ngói vảy rêu phong',
    icon: CloudRain,
  },
];

export const HeritageSoundscape: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.28);
  const [activeMood, setActiveMood] = useState<SoundscapeMood>('bell');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<{ stop: () => void }[]>([]);
  const loopTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize Web Audio Context safely
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioContextRef.current) {
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.connect(ctx.destination);
      audioContextRef.current = ctx;
      masterGainRef.current = gain;
    }

    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  // Procedural Temple Bell Chime
  const playBellChime = useCallback((ctx: AudioContext, dest: GainNode) => {
    const now = ctx.currentTime;
    // Harmonic frequencies simulating an ancient Vietnamese bronze bell
    const fundamental = 216; // A3 harmonic
    const partials = [1, 2.02, 3.01, 4.25, 5.43, 7.85];
    const amplitudes = [0.65, 0.45, 0.28, 0.18, 0.1, 0.05];
    const decays = [7.5, 5.2, 3.8, 2.6, 1.8, 1.0];

    partials.forEach((mult, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, now);

      // Strike envelope: instant attack, long rich exponential decay
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

  // Procedural Bamboo Grove Wind
  const startWindSynth = useCallback((ctx: AudioContext, dest: GainNode): { stop: () => void } => {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation for organic wind murmur
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Resonant bandpass filter that slowly sweeps like gusting wind
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);
    filter.Q.setValueAtTime(3.2, ctx.currentTime);

    // Low frequency oscillator for wind breathing effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.55, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(dest);

    whiteNoise.start();
    lfo.start();

    return {
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
          whiteNoise.disconnect();
          filter.disconnect();
          windGain.disconnect();
        } catch {
          // ignore already stopped errors
        }
      },
    };
  }, []);

  // Procedural Rain on Clay Tiles
  const startRainSynth = useCallback((ctx: AudioContext, dest: GainNode): { stop: () => void } => {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.22;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Highpass filter for pattering rainwater
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(800, ctx.currentTime);

    // Subtle bandpass for ceramic resonance of tiles
    const tileResonance = ctx.createBiquadFilter();
    tileResonance.type = 'peaking';
    tileResonance.frequency.setValueAtTime(1800, ctx.currentTime);
    tileResonance.gain.setValueAtTime(4, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, ctx.currentTime);

    rainSource.connect(highpass);
    highpass.connect(tileResonance);
    tileResonance.connect(rainGain);
    rainGain.connect(dest);

    rainSource.start();

    return {
      stop: () => {
        try {
          rainSource.stop();
          rainSource.disconnect();
          highpass.disconnect();
          tileResonance.disconnect();
          rainGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }, []);

  // Clean up all active generators
  const stopAllAudio = useCallback(() => {
    if (loopTimerRef.current) {
      window.clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    activeSourcesRef.current.forEach((src) => src.stop());
    activeSourcesRef.current = [];
  }, []);

  // Switch or restart audio generator based on active mood
  const startMoodAudio = useCallback((mood: SoundscapeMood) => {
    const ctx = getAudioContext();
    const dest = masterGainRef.current;
    if (!ctx || !dest) return;

    stopAllAudio();

    if (mood === 'bell') {
      // Strike first chime immediately, then repeat every 11 seconds
      playBellChime(ctx, dest);
      loopTimerRef.current = window.setInterval(() => {
        if (ctx.state === 'running') {
          playBellChime(ctx, dest);
        }
      }, 11000);
    } else if (mood === 'wind') {
      const windHandle = startWindSynth(ctx, dest);
      activeSourcesRef.current.push(windHandle);
    } else if (mood === 'rain') {
      const rainHandle = startRainSynth(ctx, dest);
      activeSourcesRef.current.push(rainHandle);
    }
  }, [getAudioContext, playBellChime, startWindSynth, startRainSynth, stopAllAudio]);

  // Handle Play / Pause Toggle with smooth volume ramp
  const togglePlay = useCallback(() => {
    const ctx = getAudioContext();
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (isPlaying) {
      // Smooth fade-out 1.2s then stop
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        stopAllAudio();
        setIsPlaying(false);
      }, 1250);
    } else {
      // Start audio and smooth fade-in 1.4s
      startMoodAudio(activeMood);
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(volume, now + 1.4);
      setIsPlaying(true);
    }
  }, [activeMood, getAudioContext, isPlaying, startMoodAudio, stopAllAudio, volume]);

  // Adjust volume on the fly
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain && isPlaying) {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(newVol, now + 0.1);
    }
  };

  // Switch Mood
  const handleSelectMood = (mood: SoundscapeMood) => {
    setActiveMood(mood);
    if (isPlaying) {
      startMoodAudio(mood);
    }
  };

  // Click outside to close panel
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(() => undefined);
      }
    };
  }, [stopAllAudio]);

  const currentMoodConfig = MOODS.find((m) => m.id === activeMood) || MOODS[0];
  const CurrentIcon = currentMoodConfig.icon;

  return (
    <div className="relative inline-block" ref={panelRef}>
      {/* Soundscape Pill Button */}
      <div className="inline-flex items-center rounded-[2px] border border-brass/40 bg-header/90 text-xs shadow-xs transition-all hover:border-brass">
        {/* Toggle play/pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? t('soundscape.mute', 'Tắt âm cảnh di sản') : t('soundscape.play', 'Bật âm cảnh di sản')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-sans font-medium transition-colors ${
            isPlaying ? 'bg-forest text-brass' : 'text-forest hover:bg-paper-warm hover:text-forest'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 size={13} className="text-brass animate-pulse" />
              <span className="hidden sm:inline font-cinzel text-[11px] uppercase tracking-wider font-bold">
                {t(currentMoodConfig.labelKey, currentMoodConfig.defaultLabel)}
              </span>
            </>
          ) : (
            <>
              <VolumeX size={13} className="text-charcoal-muted" />
              <span className="hidden sm:inline font-sans text-[11px] text-charcoal-muted">
                {t('soundscape.ambient', 'Âm Cảnh')}
              </span>
            </>
          )}
        </button>

        {/* Expand Options Arrow */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={t('soundscape.options', 'Tùy chỉnh âm cảnh')}
          aria-expanded={isOpen}
          className="border-l border-brass/30 px-1.5 py-1.5 text-forest/70 hover:bg-paper-warm hover:text-forest transition-colors"
        >
          <ChevronUp
            size={12}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-brass' : ''}`}
          />
        </button>
      </div>

      {/* Floating Heritage Soundscape Palette Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-[2px] border border-brass/60 bg-paper p-4 shadow-xl text-forest animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-paper-border pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <CurrentIcon size={14} className="text-brass" />
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-forest">
                {t('soundscape.title', 'Âm Cảnh Tĩnh Lặng')}
              </span>
            </div>
            <span className="font-sans text-[10px] text-brass uppercase tracking-widest font-semibold">
              {isPlaying ? t('soundscape.playing', 'Đang phát') : t('soundscape.paused', 'Tạm ngưng')}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-charcoal/80 mb-3">
            {t(
              'soundscape.intro',
              'Không gian âm thanh cổ tự mộc mạc, giúp du khách tĩnh tâm chiêm ngưỡng di sản.'
            )}
          </p>

          {/* Sound Mood Options */}
          <div className="space-y-1.5 mb-4">
            {MOODS.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = activeMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => handleSelectMood(mood.id)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-[2px] text-left transition-all border ${
                    isSelected
                      ? 'border-forest bg-forest text-paper shadow-xs'
                      : 'border-paper-border bg-paper-warm/60 text-forest hover:border-brass hover:bg-paper-warm'
                  }`}
                >
                  <MoodIcon
                    size={14}
                    className={`mt-0.5 shrink-0 ${isSelected ? 'text-brass-light' : 'text-brass'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${isSelected ? 'text-paper' : 'text-forest'}`}>
                      {t(mood.labelKey, mood.defaultLabel)}
                    </p>
                    <p className={`text-[10px] leading-tight truncate ${isSelected ? 'text-paper/80' : 'text-charcoal-muted'}`}>
                      {t(mood.descKey, mood.defaultDesc)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="border-t border-paper-border pt-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="flex items-center gap-1.5 text-charcoal-muted font-medium">
                <Sliders size={12} className="text-brass" />
                {t('soundscape.volume', 'Âm lượng')}
              </span>
              <span className="font-mono text-[10px] font-bold text-forest">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#B88A38] cursor-pointer"
              aria-label={t('soundscape.volume', 'Âm lượng')}
            />
          </div>

          {/* Master Action Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            className={`mt-3.5 w-full py-2 px-3 text-xs font-sans font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 border ${
              isPlaying
                ? 'border-forest bg-forest text-brass hover:bg-forest-dark'
                : 'border-brass bg-brass text-forest hover:bg-brass-light shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX size={13} />
                <span>{t('soundscape.stopPlayback', 'Tạm Dừng Âm Cảnh')}</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span>{t('soundscape.startPlayback', 'Bật Lắng Nghe Di Sản')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
