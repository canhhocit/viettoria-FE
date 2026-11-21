import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2,
  Pause, 
  Play, 
  RotateCcw, 
  Video,
  VideoOff,
  Volume2, 
  VolumeX,
  X 
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
  const guideVideoARef = useRef<HTMLVideoElement | null>(null);
  const guideVideoBRef = useRef<HTMLVideoElement | null>(null);
  const [activeGuideLayer, setActiveGuideLayer] = useState<'A' | 'B'>('A');
  const activeGuideLayerRef = useRef<'A' | 'B'>('A');
  activeGuideLayerRef.current = activeGuideLayer;
  const isCrossfadingRef = useRef(false);
  const crossfadeTimerRef = useRef<number | null>(null);
  const guideLoopCheckRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ttsTimerRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);

  // Floating tour guide companion visibility: 'expanded' | 'minimized' | 'hidden'
  const [guideMode, setGuideMode] = useState<'expanded' | 'minimized' | 'hidden'>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('viettoria_guide_mode');
      if (saved === 'minimized' || saved === 'hidden' || saved === 'expanded') {
        return saved;
      }
    }
    return 'expanded';
  });

  const handleSetGuideMode = (mode: 'expanded' | 'minimized' | 'hidden') => {
    setGuideMode(mode);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('viettoria_guide_mode', mode);
    }
  };

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
  const hasVietnameseVoice = useMemo(() => {
    return Boolean(findBestVoice(availableVoices, 'vi'));
  }, [availableVoices]);

  const activeAudioUrl = configuredAudioUrl && !audioFallbackActive
    ? configuredAudioUrl
    : language === 'vi' && (audioFallbackActive || (!configuredAudioUrl && (!hasVietnameseVoice || availableVoices.length === 0)))
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

  // Seamless Dual-Video Crossfade Looper: eliminates black blink / stutter during loop replay
  useEffect(() => {
    if (!isPlaying) {
      if (guideLoopCheckRef.current) {
        window.clearInterval(guideLoopCheckRef.current);
        guideLoopCheckRef.current = null;
      }
      if (crossfadeTimerRef.current) {
        window.clearTimeout(crossfadeTimerRef.current);
        crossfadeTimerRef.current = null;
      }
      isCrossfadingRef.current = false;
      guideVideoARef.current?.pause();
      guideVideoBRef.current?.pause();
      return;
    }

    // Play currently active video layer
    const activeVideo = activeGuideLayerRef.current === 'A' ? guideVideoARef.current : guideVideoBRef.current;
    if (activeVideo) {
      void activeVideo.play().catch(() => {
        // Autoplay policy non-blocking
      });
    }

    // Check periodically for upcoming video end to trigger crossfade before any freeze/black frame
    guideLoopCheckRef.current = window.setInterval(() => {
      const activeLayer = activeGuideLayerRef.current;
      const currentVideo = activeLayer === 'A' ? guideVideoARef.current : guideVideoBRef.current;
      const nextVideo = activeLayer === 'A' ? guideVideoBRef.current : guideVideoARef.current;

      if (!currentVideo || !nextVideo || isCrossfadingRef.current) return;

      const totalDuration = currentVideo.duration;
      if (!Number.isFinite(totalDuration) || totalDuration <= 1) return;

      // Start seamless crossfade 0.5s before current video reaches its end
      const triggerTime = totalDuration - 0.5;
      if (currentVideo.currentTime >= triggerTime) {
        isCrossfadingRef.current = true;
        const nextLayer = activeLayer === 'A' ? 'B' : 'A';

        // Prepare and play the other video from beginning seamlessly
        nextVideo.currentTime = 0;
        void nextVideo.play().catch(() => undefined);

        // Switch visible layer with smooth CSS opacity transition
        setActiveGuideLayer(nextLayer);
        activeGuideLayerRef.current = nextLayer;

        // Reset previous video in background after crossfade completes
        crossfadeTimerRef.current = window.setTimeout(() => {
          currentVideo.pause();
          currentVideo.currentTime = 0;
          isCrossfadingRef.current = false;
        }, 500);
      }
    }, 40);

    return () => {
      if (guideLoopCheckRef.current) {
        window.clearInterval(guideLoopCheckRef.current);
        guideLoopCheckRef.current = null;
      }
      if (crossfadeTimerRef.current) {
        window.clearTimeout(crossfadeTimerRef.current);
        crossfadeTimerRef.current = null;
      }
    };
  }, [isPlaying]);

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
    if (guideVideoARef.current) {
      guideVideoARef.current.pause();
      guideVideoARef.current.currentTime = 0;
    }
    if (guideVideoBRef.current) {
      guideVideoBRef.current.pause();
      guideVideoBRef.current.currentTime = 0;
    }
    setActiveGuideLayer('A');
    activeGuideLayerRef.current = 'A';
    isCrossfadingRef.current = false;
    if (guideLoopCheckRef.current) {
      window.clearInterval(guideLoopCheckRef.current);
      guideLoopCheckRef.current = null;
    }
    if (crossfadeTimerRef.current) {
      window.clearTimeout(crossfadeTimerRef.current);
      crossfadeTimerRef.current = null;
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
    } else if (language === 'vi') {
      // Guard: OS/browser missing Vietnamese TTS voice; don't let English voice speak Vietnamese text
      setAudioFallbackActive(true);
      return;
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

    if (guideVideoARef.current) {
      guideVideoARef.current.currentTime = 0;
    }
    if (guideVideoBRef.current) {
      guideVideoBRef.current.currentTime = 0;
    }
    setActiveGuideLayer('A');
    activeGuideLayerRef.current = 'A';
    isCrossfadingRef.current = false;

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
                <button 
                  type="button" 
                  onClick={() => handleSetGuideMode(guideMode === 'expanded' ? 'minimized' : 'expanded')} 
                  disabled={!hasAudio || audioError} 
                  className={`flex h-8 w-8 items-center justify-center border transition-colors cursor-pointer ${
                    guideMode === 'expanded' 
                      ? 'border-brass bg-brass/15 text-brass' 
                      : 'border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light'
                  }`} 
                  title={guideMode === 'expanded' ? t('audioPlayer.hideNarrator', 'Ẩn video hướng dẫn viên') : t('audioPlayer.showNarrator', 'Hiện video hướng dẫn viên')} 
                  aria-label={guideMode === 'expanded' ? t('audioPlayer.hideNarrator', 'Ẩn video hướng dẫn viên') : t('audioPlayer.showNarrator', 'Hiện video hướng dẫn viên')}
                >
                  {guideMode === 'expanded' ? <Video className="h-4 w-4" strokeWidth={1.5} /> : <VideoOff className="h-4 w-4" strokeWidth={1.5} />}
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

      {/* 2. Floating Tour Guide Companion at Bottom-Right Corner (Conical Hat Guide Video, No Text) */}
      {typeof document !== 'undefined' && guideMode !== 'hidden' && createPortal(
        <aside 
          className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none"
          aria-label={t('audioPlayer.narrator', 'Hướng dẫn viên Viettoria')}
        >
          {/* A. Minimized Pill Badge */}
          {guideMode === 'minimized' && (
            <div className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full bg-forest-dark/95 border border-brass/70 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md animate-fadeIn">
              <button
                type="button"
                onClick={() => handleSetGuideMode('expanded')}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                aria-label={t('audioPlayer.showNarrator', 'Mở lại video hướng dẫn viên')}
                title={t('audioPlayer.showNarrator', 'Mở lại video hướng dẫn viên')}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-brass shrink-0">
                  <img src="/images/guide/guide-poster.jpg" alt="" className="w-full h-full object-cover" />
                  {isPlaying && (
                    <span className="absolute inset-0 bg-forest/40 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-brass animate-ping" />
                    </span>
                  )}
                </div>
                <span className="font-serif text-[11px] sm:text-xs text-paper/90 group-hover:text-brass font-medium transition-colors">
                  {t('audioPlayer.narratorShort', 'HDV')}
                </span>
                <Maximize2 className="w-3 h-3 text-brass/70 group-hover:text-brass transition-colors" />
              </button>

              <div className="w-[1px] h-3.5 bg-paper/20 ml-0.5" />
              <button
                type="button"
                onClick={() => handleSetGuideMode('hidden')}
                className="p-1 text-paper/60 hover:text-brass transition-colors cursor-pointer rounded-full"
                aria-label={t('audioPlayer.dismissNarrator', 'Tắt hẳn')}
                title={t('audioPlayer.dismissNarrator', 'Tắt hẳn')}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* B. Expanded Video Card (Kept in DOM so dual-video refs & playback stay uninterrupted) */}
          <div 
            className={`relative w-[104px] h-[184px] sm:w-[126px] sm:h-[224px] group transition-all duration-300 ease-in-out ${
              guideMode === 'expanded' 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-90 pointer-events-none absolute -bottom-96'
            }`}
          >
            {/* Grounded Pedestal Shadow & Subtle Golden Ambient Glow */}
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-[100%] bg-black/75 blur-[4px] pointer-events-none" 
              aria-hidden="true" 
            />
            <div 
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 rounded-[100%] bg-brass/35 blur-[6px] pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-40'}`} 
              aria-hidden="true" 
            />

            {/* Prominent Close/Minimize Button at Top-Right Corner */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSetGuideMode('minimized');
              }}
              className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-forest-dark border border-brass/80 text-brass hover:text-paper hover:bg-forest hover:border-brass hover:scale-110 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all cursor-pointer focus:outline-none"
              aria-label={t('audioPlayer.hideNarrator', 'Ẩn hướng dẫn viên')}
              title={t('audioPlayer.hideNarrator', 'Ẩn hướng dẫn viên')}
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Clickable Guide Video (Toggles Play/Pause, No Text Overlays) */}
            <button
              type="button"
              onClick={() => void togglePlay()}
              disabled={!hasAudio || audioError}
              className="relative h-full w-full cursor-pointer overflow-hidden rounded-[2px] border-2 border-brass/50 bg-forest-dark shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-brass hover:shadow-[0_16px_40px_rgba(184,138,56,0.35)] hover:scale-[1.025] active:scale-[0.98] disabled:cursor-not-allowed group/btn focus:outline-none"
              aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}
              title={isPlaying ? t('audioPlayer.pause', 'Bấm vào hướng dẫn viên để tạm dừng') : t('audioPlayer.listen', 'Bấm vào hướng dẫn viên để nghe thuyết minh')}
            >
              {/* Corner Frame Accents (Museum Atelier Framing) */}
              <div className="pointer-events-none absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-brass z-20" aria-hidden="true" />
              <div className="pointer-events-none absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-brass z-20" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-brass z-20" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-brass z-20" aria-hidden="true" />

              {/* Seamless Dual-Video Crossfade Layer: Eliminates black flash/flicker and creates organic continuous looping */}
              <video
                ref={guideVideoARef}
                src="/images/guide/Woman_speaking_as_tour_guide_6e120cf1.mp4"
                poster="/images/guide/guide-poster.jpg"
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-in-out ${
                  activeGuideLayer === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
              <video
                ref={guideVideoBRef}
                src="/images/guide/Woman_speaking_as_tour_guide_6e120cf1.mp4"
                poster="/images/guide/guide-poster.jpg"
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-in-out ${
                  activeGuideLayer === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />

              {/* Subtle hover icon overlay (Icon Only, No Text) */}
              <div className="absolute inset-0 bg-forest-dark/25 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover/btn:opacity-100 pointer-events-none z-10">
                <div className="w-10 h-10 rounded-full bg-forest/90 border border-brass flex items-center justify-center shadow-lg backdrop-blur-xs">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-brass fill-brass" />
                  ) : (
                    <Play className="w-4 h-4 text-brass fill-brass ml-0.5" />
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
