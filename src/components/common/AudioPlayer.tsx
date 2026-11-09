import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import type { AudioGuideData } from '../../types';
import { resolveAudioUrl } from '../../utils/mediaResolver';
import { useLanguage } from '../../contexts/LanguageContext';

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

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioGuide, heritageName }) => {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [audioFallbackActive, setAudioFallbackActive] = useState(false);
  const configuredAudioUrl = resolveAudioUrl(audioGuide.audioUrl);
  const audioUrl = configuredAudioUrl && !audioFallbackActive
    ? configuredAudioUrl
    : audioFallbackActive
      ? SAMPLE_AUDIO_URL
      : '';
  const titleLabel = audioGuide.title || `${t('audioPlayer.speaking', 'Lời kể về')} ${heritageName}`;
  const transcriptLabel = audioGuide.transcript?.trim() || SAMPLE_TRANSCRIPT;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => configuredAudioUrl ? parseDuration(audioGuide.duration) : 0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isOutOfView, setIsOutOfView] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isGuideMinimized, setIsGuideMinimized] = useState(false);

  const hasAudio = Boolean(audioUrl);

  // Preload guide images into cache for immediate stutter-free animation
  useEffect(() => {
    const idleImg = new Image();
    idleImg.src = '/images/guide/guide-idle.png';
    const speakingImg = new Image();
    speakingImg.src = '/images/guide/guide-speaking.webp';
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsOutOfView(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(configuredAudioUrl ? parseDuration(audioGuide.duration) : 0);
    setAudioError(false);
    setAudioFallbackActive(false);
    if (audioRef.current) audioRef.current.pause();
  }, [configuredAudioUrl, audioGuide.duration]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio || audioError) return;
    if (audio.paused) {
      try {
        if (audio.ended) audio.currentTime = 0;
        await audio.play();
      } catch {
        if (audioUrl !== SAMPLE_AUDIO_URL) {
          setAudioFallbackActive(true);
          setAudioError(false);
          setCurrentTime(0);
        } else {
          setAudioError(true);
        }
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current && Number.isFinite(nextTime)) audioRef.current.currentTime = nextTime;
  };

  const handleReset = () => {
    if (!audioRef.current || !hasAudio) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const toggleMute = () => {
    if (!audioRef.current || !hasAudio) return;
    const muted = !audioRef.current.muted;
    audioRef.current.muted = muted;
    setIsMuted(muted);
  };

  const scrollToPlayer = () => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        {hasAudio && (
          <audio
            key={audioUrl}
            ref={audioRef}
            src={audioUrl}
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
              if (audioUrl !== SAMPLE_AUDIO_URL) {
                setAudioFallbackActive(true);
                setAudioError(false);
                setIsPlaying(false);
                setCurrentTime(0);
                return;
              }
              setAudioError(true);
              setIsPlaying(false);
            }}
          />
        )}

        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[800px] items-center justify-center px-4 py-8 sm:min-h-[430px] sm:px-8 sm:py-10">
          <div className="relative z-20 w-full max-w-[580px] border border-brass/65 bg-forest-dark/95 p-5 shadow-2xl sm:p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 pb-3.5">
              <div className="min-w-0">
                <p className="truncate font-serif text-base font-semibold text-paper sm:text-lg">{titleLabel}</p>
                <p className="mt-1 truncate font-mono text-[10px] text-brass-light sm:text-[11px]">
                  {t('audioPlayer.narrator', 'Thuyết minh viên Viettoria')} <span className="mx-1.5 text-brass">·</span>{durationLabel}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-brass/35 bg-black/45 text-[10px] font-mono text-brass shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-brass animate-pulse' : 'bg-paper/40'}`} />
                <span>{isPlaying ? 'ĐANG THUYẾT MINH' : 'SẴN SÀNG'}</span>
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

      {/* 2. Floating Tour Guide Companion at Bottom-Right Corner (Lifelike Micro-Motions & Equalizer Waves) */}
      <aside 
        className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none select-none transition-all duration-300"
        aria-label={t('audioPlayer.narrator', 'Hướng dẫn viên Viettoria')}
      >
        {isGuideMinimized ? (
          <button
            type="button"
            onClick={() => setIsGuideMinimized(false)}
            className="pointer-events-auto flex items-center gap-2 border border-brass/60 bg-forest-dark/95 text-paper px-3 py-2 text-xs font-serif shadow-2xl backdrop-blur-md hover:border-brass transition-all cursor-pointer group rounded-[2px]"
            title="Mở hướng dẫn viên Viettoria"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-brass' : 'bg-brass/50'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-brass' : 'bg-brass/70'}`} />
            </span>
            <Headphones className="w-3.5 h-3.5 text-brass" />
            <span className="font-medium text-[11px] text-paper">
              {isPlaying ? t('audioPlayer.speaking', 'Đang thuyết minh...') : t('audioPlayer.narrator', 'Hướng dẫn viên')}
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-brass group-hover:-translate-y-0.5 transition-transform" />
          </button>
        ) : (
          <div className="relative flex flex-col items-end">
            {/* A. Dynamic Speech Card / Floating Audio Pill */}
            <div className={`pointer-events-auto mb-2 w-[220px] sm:w-[245px] border border-brass/50 bg-[#121915]/95 p-2.5 sm:p-3 text-paper shadow-2xl backdrop-blur-md rounded-[2px] transition-all duration-300 ${
              isPlaying ? 'border-brass shadow-[0_8px_30px_rgba(184,138,68,0.3)]' : 'border-paper/20'
            }`}>
              {/* Header with real-time soundwave visualizer */}
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-paper/10">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3 shrink-0" aria-label="Âm thanh đang phát">
                      <span className="w-[2px] bg-brass animate-soundwave-1" />
                      <span className="w-[2px] bg-brass animate-soundwave-2" />
                      <span className="w-[2px] bg-brass animate-soundwave-3" />
                      <span className="w-[2px] bg-brass animate-soundwave-4" />
                    </div>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass/70 shrink-0" />
                  )}
                  <span className="font-serif text-[10.5px] font-bold text-brass truncate uppercase tracking-wider">
                    {isPlaying ? t('audioPlayer.speaking', 'Đang Thuyết Minh') : t('audioPlayer.narrator', 'Hướng Dẫn Viên')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGuideMinimized(true)}
                  className="p-0.5 text-paper/50 hover:text-paper transition-colors cursor-pointer"
                  title="Thu nhỏ hướng dẫn viên"
                  aria-label="Thu nhỏ hướng dẫn viên"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Live Time */}
              <p className="mt-1.5 font-serif text-xs font-semibold text-paper leading-snug truncate">
                {titleLabel}
              </p>
              <p className="mt-0.5 font-mono text-[9px] text-brass-light/80">
                {formatTime(currentTime)} / {durationLabel}
              </p>

              {/* Interactive Audio Controls */}
              <div className="mt-2 flex items-center justify-between gap-2 pt-1.5 border-t border-paper/10">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleMute}
                    disabled={!hasAudio || audioError}
                    className="p-1 text-paper/70 hover:text-brass transition-colors cursor-pointer disabled:opacity-40"
                    title={isMuted ? t('audioPlayer.unmute') : t('audioPlayer.mute')}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  {isOutOfView && (
                    <button
                      type="button"
                      onClick={scrollToPlayer}
                      className="p-1 text-paper/70 hover:text-brass transition-colors cursor-pointer"
                      title={t('audioPlayer.player', 'Đến khu vực thuyết minh')}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void togglePlay()}
                  disabled={!hasAudio || audioError}
                  className="inline-flex items-center gap-1.5 bg-brass hover:bg-brass-light text-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40 rounded-[2px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 fill-current" />
                      <span>{t('audioPlayer.pause', 'Dừng')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t('audioPlayer.listen', 'Nghe')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress bar line */}
              <div className="mt-2 h-[2px] w-full bg-paper/15 overflow-hidden rounded-full">
                <div
                  className="h-full bg-brass transition-[width] duration-150 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* B. Tour Guide Figure on Atmospheric Pedestal */}
            <div className="relative h-[155px] w-[95px] sm:h-[195px] sm:w-[120px] pointer-events-auto">
              {/* Pedestal Shadow (Pulsates in gentle breath rhythm) */}
              <div 
                className="guide-shadow-pulse absolute bottom-0 left-1/2 w-20 h-3 rounded-[100%] bg-black/70 blur-[3px] pointer-events-none" 
                aria-hidden="true" 
              />
              <div 
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-[100%] bg-brass/20 blur-[5px] pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Clickable Guide Figure with Smooth Dual-Layer Cross-Fade */}
              <button
                type="button"
                onClick={() => void togglePlay()}
                disabled={!hasAudio || audioError}
                className="relative h-full w-full cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed group transition-transform duration-300 hover:scale-[1.03]"
                aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}
                title={isPlaying ? 'Bấm vào hướng dẫn viên để tạm dừng' : 'Bấm vào hướng dẫn viên để nghe thuyết minh'}
              >
                {/* Layer 1: Idle Pose (Breathes naturally with organic CSS micro-float) */}
                <img
                  src="/images/guide/guide-idle.png"
                  alt="Hướng dẫn viên Viettoria trong tà áo dài đỏ"
                  className={`absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-500 ease-in-out ${
                    isPlaying ? 'opacity-0' : 'opacity-100'
                  } guide-idle-breath`}
                  draggable={false}
                />
                {/* Layer 2: Animated Speaking WebP (Active speech cadence gestures) */}
                <img
                  src="/images/guide/guide-speaking.webp"
                  alt="Hướng dẫn viên Viettoria đang thuyết minh"
                  className={`absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-500 ease-in-out ${
                    isPlaying ? 'opacity-100' : 'opacity-0'
                  } guide-speaking-motion`}
                  draggable={false}
                />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default AudioPlayer;
