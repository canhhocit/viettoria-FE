import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronDown, ChevronUp, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
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
  const [dismissSticky, setDismissSticky] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const hasAudio = Boolean(audioUrl);

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
    setDismissSticky(false);
    setAudioFallbackActive(false);
    if (audioRef.current) audioRef.current.pause();
  }, [configuredAudioUrl, audioGuide.duration]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio || audioError) return;
    setDismissSticky(false);
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
  const stickyPlayerVisible = isPlaying && isOutOfView && !dismissSticky;
  const durationLabel = duration > 0 ? formatTime(duration) : (configuredAudioUrl ? audioGuide.duration || '—:—' : '—:—');
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <>
      <section ref={containerRef} className="relative isolate min-h-[380px] overflow-hidden border border-brass/55 bg-forest-dark text-paper shadow-lg sm:min-h-[440px]">
        <div className="absolute inset-0" aria-hidden="true">
          <img src="/videos/hero-background-poster.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/75 via-forest-dark/35 to-forest-dark/10" />
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

        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[760px] items-end px-3 pb-4 pt-12 sm:min-h-[440px] sm:px-8 sm:pb-6">
          <div className="relative z-20 w-[calc(100%-165px)] max-w-[430px] border border-brass/65 bg-forest-dark/95 p-4 shadow-2xl sm:w-[calc(100%-250px)] sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 pb-3">
              <div className="min-w-0">
                <p className="truncate font-serif text-sm font-semibold text-paper sm:text-base">{titleLabel}</p>
                <p className="mt-1 truncate font-mono text-[9px] text-brass-light sm:text-[10px]">
                  {t('audioPlayer.narrator', 'Hướng dẫn viên Viettoria')} <span className="mx-1 text-brass">·</span>{durationLabel}
                </p>
              </div>
            </div>

            <div className="my-3 min-h-[98px] border border-paper/10 bg-forest-deep/90 p-3 sm:min-h-[106px]">
              <p className={`whitespace-pre-line font-sans text-xs italic leading-5 text-paper-card/85 ${showTranscript ? 'max-h-36 overflow-y-auto' : 'line-clamp-4'}`}>
                “{transcriptLabel}”
              </p>
            </div>

            <input type="range" min={0} max={Math.max(duration, 1)} step="0.1" value={Math.min(currentTime, Math.max(duration, 1))} onChange={seek} disabled={!hasAudio || audioError || duration <= 0} style={{ background: `linear-gradient(90deg, var(--heritage-brass) ${progressPercent}%, color-mix(in srgb, var(--color-paper) 20%, transparent) ${progressPercent}%)` }} className="audio-guide-seek w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40" aria-label="Tiến trình thuyết minh" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-paper/65">
              <span>{formatTime(currentTime)}</span>
              <span>{durationLabel}</span>
            </div>

            {!hasAudio || audioError ? (
              <p className="mt-2 text-xs text-paper/75" role="status">
                {audioError ? t('audioPlayer.audioError', 'Không mở được bản thu.') : t('audioPlayer.audioUpdating', 'Đang cập nhật âm thanh.')}
              </p>
            ) : null}

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={toggleMute} disabled={!hasAudio || audioError} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light disabled:opacity-35" title={isMuted ? t('audioPlayer.unmute') : t('audioPlayer.mute')} aria-label={isMuted ? t('audioPlayer.unmute') : t('audioPlayer.mute')}>
                  {isMuted ? <VolumeX className="h-4 w-4" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4" strokeWidth={1.5} />}
                </button>
                <button type="button" onClick={handleReset} disabled={!hasAudio || audioError} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light disabled:opacity-35 sm:w-auto sm:gap-1.5 sm:px-2" title={t('audioPlayer.replay')}>
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} /><span className="hidden sm:inline">{t('audioPlayer.replay')}</span>
                </button>
                <button type="button" onClick={() => setShowTranscript((shown) => !shown)} aria-expanded={showTranscript} className="flex h-8 w-8 items-center justify-center border border-paper/15 text-paper/75 hover:border-brass hover:text-brass-light" title={showTranscript ? t('audioPlayer.collapseTranscript') : t('audioPlayer.expandTranscript')} aria-label={showTranscript ? t('audioPlayer.collapseTranscript') : t('audioPlayer.expandTranscript')}>
                  {showTranscript ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              <button type="button" onClick={() => void togglePlay()} disabled={!hasAudio || audioError} className="flex h-10 w-10 items-center justify-center gap-2 bg-brass text-xs font-semibold text-forest-dark transition-colors hover:bg-brass-light disabled:opacity-45 sm:w-auto sm:px-4" aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}>
                {isPlaying ? <><Pause className="h-4 w-4 fill-current" /><span className="hidden sm:inline">{t('audioPlayer.pause')}</span></> : <><Play className="h-4 w-4 fill-current" /><span className="hidden sm:inline">{t('audioPlayer.listen')}</span></>}
              </button>
            </div>
          </div>

          <aside className="absolute bottom-0 right-0 z-10 flex h-[250px] w-[150px] items-end justify-center sm:right-6 sm:h-[405px] sm:w-[228px]">
            <button
              type="button"
              onClick={() => void togglePlay()}
              disabled={!hasAudio || audioError}
              className="h-full w-full cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed"
              aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}
              title={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.listen')}
            >
              <img
                src={isPlaying ? '/images/guide/guide-speaking.webp' : '/images/guide/guide-idle.png'}
                alt="Hướng dẫn viên Viettoria trong tà áo dài đỏ"
                className="h-full w-full object-contain object-bottom"
                loading="lazy"
              />
            </button>
          </aside>
        </div>

      </section>

      {stickyPlayerVisible && (
        <div className="fixed inset-x-4 bottom-4 z-40 border border-brass/55 bg-forest-dark px-4 py-3 text-paper shadow-2xl animate-fade-up sm:left-auto sm:right-6 sm:mr-0 sm:w-full sm:max-w-sm" role="region" aria-label="Hướng dẫn viên audio đang phát">
          <div className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-5">
            <img src="/images/guide/guide-idle.png" alt="" className="hidden h-10 w-8 shrink-0 object-contain object-bottom sm:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm font-semibold">{titleLabel}</p>
              <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-wider text-brass-light">{t('audioPlayer.speaking')} · {heritageName}</p>
            </div>
            <span className="hidden font-mono text-[10px] text-paper/65 md:block">{formatTime(currentTime)} / {durationLabel}</span>
            <button type="button" onClick={() => void togglePlay()} className="flex h-9 w-9 shrink-0 items-center justify-center bg-brass text-forest" aria-label={t('audioPlayer.pause')}><Pause className="h-4 w-4 fill-current" /></button>
            <button type="button" onClick={scrollToPlayer} className="hidden items-center gap-1 border border-paper/20 px-2.5 py-2 font-mono text-[9px] uppercase tracking-wider text-paper/75 hover:border-brass sm:flex" title={t('audioPlayer.player')}><ArrowUp className="h-3 w-3" />{t('audioPlayer.player')}</button>
            <button type="button" onClick={() => setDismissSticky(true)} className="px-1.5 text-paper/45 hover:text-paper" aria-label="Ẩn trình phát thu gọn"><X className="h-4 w-4" strokeWidth={1.5} /></button>
          </div>
          <div className="absolute inset-x-0 top-0 h-px bg-paper/10"><div className="h-full bg-brass transition-[width]" style={{ width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%` }} /></div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;
