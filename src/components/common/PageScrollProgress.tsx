import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress = scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;
        setProgress(nextProgress);
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      resizeObserver.disconnect();
    };
  }, [location.pathname, location.search, location.hash]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-forest/[0.08]"
      role="progressbar"
      aria-label="Tiến độ cuộn trang"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-brass/75 shadow-[0_0_5px_rgba(184,138,68,0.22)] transition-transform duration-100 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

export default PageScrollProgress;
