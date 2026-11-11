import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import type { AudioGuideData } from '../../types';
import { resolveAudioUrl } from '../../utils/mediaResolver';
import { useLanguage } from '../../contexts/LanguageContext';
import type { LanguageCode } from '../../locales';

interface AudioPlayerProps {
  audioGuide: AudioGuideData;
  heritageName: string;
}

const SAMPLE_AUDIO_URL = '/audio/heritage-guide-sample.wav';
const SAMPLE_TRANSCRIPT = 'Xin kính chào quý khách. Chúng ta đang cùng khám phá những dấu ấn kiến trúc Việt Nam qua các câu chuyện được lưu giữ trong từng công trình. Xin mời quý khách lắng nghe, quan sát và cảm nhận vẻ đẹp của di sản. Cảm ơn quý khách đã cùng Viettoria bắt đầu hành trình này.';

const parseDuration = (value?: string) => {
  if (!value) return 0;
  const parts = value.split(':').map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] || 0;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainder = wholeSeconds % 60;
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
};

/**
 * Calculates realistic narration duration for Text-to-Speech based on language and text volume
 */
const estimateSpeechDuration = (text: string, lang: LanguageCode): number => {
  if (!text) return 20;
  if (lang === 'zh' || lang === 'ja' || lang === 'ko') {
    const chars = text.replace(/\s+/g, '').length;
    return Math.max(12, Math.round(chars / 3.2));
  }
  const words = text.trim().split(/\s+/).length;
  return Math.max(12, Math.round(words / 2.2));
};

/**
 * Finds the highest quality native speech synthesis voice matching the requested language
 */
const findBestVoice = (voices: SpeechSynthesisVoice[], lang: LanguageCode): SpeechSynthesisVoice | null => {
  if (!voices || voices.length === 0) return null;

  const langPrefixMap: Record<LanguageCode, string[]> = {
    vi: ['vi-VN', 'vi'],
    en: ['en-US', 'en-GB', 'en-AU', 'en'],
    fr: ['fr-FR', 'fr-CA', 'fr'],
    zh: ['zh-CN', 'zh-TW', 'zh-HK', 'zh'],
    ko: ['ko-KR', 'ko'],
    ja: ['ja-JP', 'ja'],
  };

  const prefixes = langPrefixMap[lang] || ['en'];

  // 1. Try to find natural/neural/Google voices
  for (const prefix of prefixes) {
    const match = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith(prefix.toLowerCase()) &&
        (v.name.includes('Natural') ||
          v.name.includes('Online') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Premium'))
    );
    if (match) return match;
  }

  // 2. Fallback to any voice matching the language prefix
  for (const prefix of prefixes) {
    const match = voices.find((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(prefix.toLowerCase())
    );
    if (match) return match;
  }

  return null;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioGuide, heritageName }) => {
  const { t, language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ttsTimerRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [audioFallbackActive, setAudioFallbackActive] = useState(false);

  // Check language-specific audio file if exists, else fallback to standard audio or TTS
  const languageSpecificAudioUrl = audioGuide.audioUrls?.[language];
  const isAudioMatchingCurrentLang = Boolean(
    languageSpecificAudioUrl ||
    language === 'vi' ||
    (audioGuide.audioUrl && (
      audioGuide.audioUrl.includes(`-${language}.`) ||
      audioGuide.audioUrl.includes(`-${language}-`) ||
      (language === 'en' && (audioGuide.audioUrl.includes('-en.') || audioGuide.audioUrl.includes('-eng.')))
    ))
  );
  const configuredAudioUrl = resolveAudioUrl(languageSpecificAudioUrl || (isAudioMatchingCurrentLang ? audioGuide.audioUrl : ''));
  const activeAudioUrl = configuredAudioUrl && !audioFallbackActive
    ? configuredAudioUrl
    : language === 'vi' && audioFallbackActive
      ? SAMPLE_AUDIO_URL
      : '';

  const isUsingTts = !activeAudioUrl;

  const titleLabel = audioGuide.title || `${t('audioPlayer.speaking', 'Lời kể về')} ${heritageName}`;
  const transcriptLabel = audioGuide.transcript?.trim() || SAMPLE_TRANSCRIPT;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const estimatedTtsDuration = useMemo(() => {
    return estimateSpeechDuration(transcriptLabel, language);
  }, [transcriptLabel, language]);

  const [duration, setDuration] = useState(() => {
    return activeAudioUrl ? parseDuration(audioGuide.duration) : estimatedTtsDuration;
  });

  const [showTranscript, setShowTranscript] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const hasAudio = Boolean(activeAudioUrl || (typeof window !== 'undefined' && 'speechSynthesis' in window));

  // Preload transparent tour guide assets for seamless state transitions
  useEffect(() => {
    const idleImg = new Image();
    idleImg.src = '/images/guide/guide-idle.png';
    const speakingImg = new Image();
    speakingImg.src = '/images/guide/guide-speaking.webp';
  }, []);

  // Load available speech synthesis voices asynchronously
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop everything immediately and safely
  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimerRef.current) {
      window.clearInterval(ttsTimerRef.current);
      ttsTimerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    currentTimeRef.current = 0;
  }, []);

  // When language switches, re-initialize narration in that language
  useEffect(() => {
    stopAllAudio();
    setAudioError(false);
    setAudioFallbackActive(false);

    if (activeAudioUrl) {
      setDuration(parseDuration(audioGuide.duration));
    } else {
      setDuration(estimatedTtsDuration);
    }
  }, [language, activeAudioUrl, audioGuide.duration, estimatedTtsDuration, stopAllAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // Web Speech Synthesis Narrator Engine
  const speakWithTts = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioError(true);
      return;
    }

    window.speechSynthesis.cancel();
    if (ttsTimerRef.current) {
      window.clearInterval(ttsTimerRef.current);
      ttsTimerRef.current = null;
    }

    const text = transcriptLabel;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const langTagMap: Record<LanguageCode, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      fr: 'fr-FR',
      zh: 'zh-CN',
      ko: 'ko-KR',
      ja: 'ja-JP',
    };
    utterance.lang = langTagMap[language] || 'en-US';

    const bestVoice = findBestVoice(availableVoices, language);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.rate = 0.95; // Calm, respectful storytelling pace
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1;

    setDuration(estimatedTtsDuration);

    utterance.onstart = () => {
      setIsPlaying(true);
      const startTime = Date.now() - currentTimeRef.current * 1000;
      ttsTimerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= estimatedTtsDuration) {
          setCurrentTime(estimatedTtsDuration);
          currentTimeRef.current = estimatedTtsDuration;
        } else {
          setCurrentTime(elapsed);
          currentTimeRef.current = elapsed;
        }
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (ttsTimerRef.current) {
        window.clearInterval(ttsTimerRef.current);
        ttsTimerRef.current = null;
      }
      setCurrentTime(0);
      currentTimeRef.current = 0;
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis notice:', e);
      }
      setIsPlaying(false);
      if (ttsTimerRef.current) {
        window.clearInterval(ttsTimerRef.current);
        ttsTimerRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [transcriptLabel, language, availableVoices, isMuted, estimatedTtsDuration]);

  const togglePlay = async () => {
    if (!hasAudio || audioError) return;

    if (isPlaying) {
      // Pause action
      if (!isUsingTts && audioRef.current) {
        audioRef.current.pause();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (ttsTimerRef.current) {
          window.clearInterval(ttsTimerRef.current);
          ttsTimerRef.current = null;
        }
      }
      setIsPlaying(false);
      return;
    }

    // Play action
    if (!isUsingTts && audioRef.current) {
      try {
        if (audioRef.current.ended) audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        // Fallback to TTS if audio file cannot be decoded or loaded
        speakWithTts();
      }
    } else {
      speakWithTts();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    setCurrentTime(nextTime);
    currentTimeRef.current = nextTime;

    if (!isUsingTts && audioRef.current && Number.isFinite(nextTime)) {
      audioRef.current.currentTime = nextTime;
    } else if (isUsingTts && isPlaying) {
      speakWithTts();
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    currentTimeRef.current = 0;

    if (!isUsingTts && audioRef.current) {
      audioRef.current.currentTime = 0;
    } else if (isUsingTts) {
      if (isPlaying) {
        speakWithTts();
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!isUsingTts && audioRef.current) {
      audioRef.current.muted = nextMuted;
    } else if (isUsingTts && isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (!nextMuted) {
          speakWithTts();
        }
      }
    }
  };

  const durationLabel = duration > 0 ? formatTime(duration) : (configuredAudioUrl ? audioGuide.duration || '—:—' : '—:—');
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <>
      {/* 1. Main On-Page Heritage Audio Stage (Spacious, Centered, No Squeezed Layout) */}
      <section ref={containerRef} className="relative isolate min-h-[380px] overflow-hidden border border-brass/55 bg-forest-dark text-paper shadow-lg sm:min-h-[430px]">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="/videos/hero-background-poster.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/85 via-forest-dark/55 to-forest-dark/30" />
        </div>

        {activeAudioUrl && (
          <audio
            key={`${language}-${activeAudioUrl}`}
            ref={audioRef}
            src={activeAudioUrl}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => {
              const actualDuration = event.currentTarget.duration;
              if (Number.isFinite(actualDuration)) setDuration(actualDuration);
            }}
            onDurationChange={(event) => {
              const actualDuration = event.currentTarget.duration;
              if (Number.isFinite(actualDuration)) setDuration(actualDuration);
            }}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              if (activeAudioUrl !== SAMPLE_AUDIO_URL) {
                setAudioFallbackActive(true);
                setAudioError(false);
                setIsPlaying(false);
                setCurrentTime(0);
                return;
              }
              // If sample audio also fails, activate native TTS in that language
              speakWithTts();
            }}
          />
        )}

        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[800px] items-center justify-center px-4 py-8 sm:min-h-[430px] sm:px-8 sm:py-10">
          <div className="relative z-20 w-full max-w-[580px] border border-brass/65 bg-forest-dark/95 p-5 shadow-2xl sm:p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 pb-3.5">
              <div className="min-w-0">
                <p className="truncate font-serif text-base font-semibold text-paper sm:text-lg">{titleLabel}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-brass/35 bg-black/45 text-[10px] font-mono text-brass shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-brass animate-pulse' : 'bg-paper/40'}`} />
                <span>{isPlaying ? t('audioPlayer.speaking', 'ĐANG THUYẾT MINH') : t('audioPlayer.listen', 'SẴN SÀNG')}</span>
                <span className="ml-1 text-brass-light border-l border-brass/30 pl-1.5 uppercase font-sans font-bold">
                  {language.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="my-3.5 min-h-[95px] border border-paper/10 bg-forest-deep/90 p-3.5 sm:min-h-[105px]">
              <p className={`whitespace-pre-line font-sans text-xs italic leading-relaxed text-paper-card/90 ${showTranscript ? 'max-h-48 overflow-y-auto' : 'line-clamp-4'}`}>
                “{transcriptLabel}”
              </p>
            </div>

            <input 
              type="range" 
              min={0} 
              max={Math.max(duration, 1)} 
              step="0.1" 
              value={Math.min(currentTime, Math.max(duration, 1))} 
              onChange={seek} 
              disabled={!hasAudio || audioError || duration <= 0} 
              style={{ background: `linear-gradient(90deg, var(--heritage-brass) ${progressPercent}%, color-mix(in srgb, var(--color-paper) 20%, transparent) ${progressPercent}%)` }} 
              className="audio-guide-seek w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40" 
              aria-label="Tiến trình thuyết minh" 
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-paper/65">
              <span>{formatTime(currentTime)}</span>
              <span>{durationLabel}</span>
            </div>

            {!hasAudio || audioError ? (
              <p className="mt-2 text-xs text-paper/75" role="status">
                {audioError ? t('audioPlayer.audioError', 'Không mở được bản thu.') : t('audioPlayer.audioUpdating', 'Đang cập nhật âm thanh.')}
              </p>
            ) : null}

            <div className="mt-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={toggleMute} disabled={!hasAudio || audioError} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light disabled:opacity-35 cursor-pointer" title={isMuted ? t('audioPlayer.unmute') : t('audioPlayer.mute')} aria-label={isMuted ? t('audioPlayer.unmute') : t('audioPlayer.mute')}>
                  {isMuted ? <VolumeX className="h-4 w-4" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4" strokeWidth={1.5} />}
                </button>
                <button type="button" onClick={handleReset} disabled={!hasAudio || audioError} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light disabled:opacity-35 sm:w-auto sm:gap-1.5 sm:px-2 cursor-pointer" title={t('audioPlayer.replay')}>
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} /><span className="hidden sm:inline text-xs">{t('audioPlayer.replay')}</span>
                </button>
                <button type="button" onClick={() => setShowTranscript((shown) => !shown)} aria-expanded={showTranscript} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light cursor-pointer" title={showTranscript ? t('audioPlayer.collapseTranscript') : t('audioPlayer.expandTranscript')} aria-label={showTranscript ? t('audioPlayer.collapseTranscript') : t('audioPlayer.expandTranscript')}>
                  {showTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              <button type="button" onClick={() => void togglePlay()} disabled={!hasAudio || audioError} className="flex h-10 items-center justify-center gap-2 bg-brass px-4 text-xs font-semibold text-forest-dark transition-colors hover:bg-brass-light disabled:opacity-45 cursor-pointer" aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}>
                {isPlaying ? <><Pause className="h-4 w-4 fill-current" /><span>{t('audioPlayer.pause')}</span></> : <><Play className="h-4 w-4 fill-current" /><span>{t('audioPlayer.listen')}</span></>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Tour Guide Companion at Bottom-Right Corner (Transparent Heritage Narrator) */}
      {typeof document !== 'undefined' && createPortal(
        <aside 
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none"
          aria-label={t('audioPlayer.narrator', 'Hướng dẫn viên Viettoria')}
        >
          <div className="relative w-[110px] h-[195px] sm:w-[130px] sm:h-[230px] group">
            {/* Grounded Pedestal Shadow & Warm Ambient Glow Beneath Avatar Feet */}
            <div 
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-3.5 rounded-[100%] bg-black/45 blur-[4px] pointer-events-none" 
              aria-hidden="true" 
            />
            <div 
              className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3 rounded-[100%] bg-brass/30 blur-[6px] pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} 
              aria-hidden="true" 
            />

            {/* Clickable Transparent Guide Figure (Toggles Play/Pause) */}
            <button
              type="button"
              onClick={() => void togglePlay()}
              disabled={!hasAudio || audioError}
              className="relative h-full w-full cursor-pointer bg-transparent border-0 p-0 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 group/btn focus:outline-none"
              aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}
              title={isPlaying ? t('audioPlayer.pause', 'Bấm vào hướng dẫn viên để tạm dừng') : t('audioPlayer.listen', 'Bấm vào hướng dẫn viên để nghe thuyết minh')}
            >
              {/* Transparent Avatar Cutout (Idle PNG vs Animated Speaking WebP) */}
              <img
                src={isPlaying ? '/images/guide/guide-speaking.webp' : '/images/guide/guide-idle.png'}
                alt={t('audioPlayer.narrator', 'Hướng dẫn viên Viettoria')}
                className="h-full w-full object-contain object-bottom pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] select-none"
                draggable={false}
              />

              {/* Floating Action Orb on Hover */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">
                <div className="w-10 h-10 rounded-full bg-forest-dark/90 border border-brass text-brass-light flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-xs transition-transform duration-200 group-hover/btn:scale-105">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current text-brass" />
                  ) : (
                    <Play className="w-4 h-4 fill-current text-brass ml-0.5" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </aside>,
        document.body
      )}
    </>
  );
};

export default AudioPlayer;
