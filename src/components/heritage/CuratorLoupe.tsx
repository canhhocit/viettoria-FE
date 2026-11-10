import React, { useState, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';

interface CuratorLoupeProps {
  imageSrc: string;
  altText: string;
  zoomLevel?: number;
  className?: string;
}

export const CuratorLoupe: React.FC<CuratorLoupeProps> = ({
  imageSrc,
  altText,
  zoomLevel = 2.5,
  className = '',
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const LENS_DIAMETER = 160;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Ensure cursor is within image
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        setIsHovering(false);
        return;
      }

      setIsHovering(true);
      setLensPos({ x, y });

      // Calculate zoomed background position
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      setBgPos({ x: bgX, y: bgY });
    },
    [isActive]
  );

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Loupe Toggle Button */}
      <div className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-sans font-semibold rounded-[2px] transition-all shadow-md ${
            isActive
              ? 'border-brass bg-forest text-brass'
              : 'border-paper-border bg-paper/90 text-forest hover:border-brass'
          }`}
          title={isActive ? 'Tắt kính lúp giám định' : 'Bật kính lúp giám định'}
        >
          <Search size={13} className="text-brass" />
          <span className="font-sans text-[11px] uppercase tracking-wider">
            {isActive ? 'Kính Lúp: Bật' : 'Kính Lúp: Tắt'}
          </span>
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative h-full w-full overflow-hidden ${
          isActive ? 'cursor-crosshair' : 'cursor-default'
        }`}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="h-full w-full object-contain pointer-events-none"
        />

        {/* Circular Antique Brass Bezel Loupe Lens */}
        {isActive && isHovering && (
          <div
            className="pointer-events-none absolute z-30 rounded-full border-2 border-brass bg-no-repeat shadow-2xl transition-opacity duration-75"
            style={{
              width: `${LENS_DIAMETER}px`,
              height: `${LENS_DIAMETER}px`,
              left: `${lensPos.x - LENS_DIAMETER / 2}px`,
              top: `${lensPos.y - LENS_DIAMETER / 2}px`,
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              boxShadow: '0 0 0 2px rgba(20,40,32,0.4), 0 10px 25px -5px rgba(0,0,0,0.5)',
            }}
          >
            {/* Crosshair guidelines */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="h-full w-px bg-brass/60" />
              <div className="absolute w-full h-px bg-brass/60" />
            </div>

            {/* Inner Brass Rim Glow */}
            <div className="absolute inset-0 rounded-full border border-brass-light/40" />

            {/* Magnification Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap border border-brass/80 bg-forest px-2 py-0.5 text-[9px] font-sans font-bold text-brass uppercase tracking-widest shadow-sm rounded-[1px]">
              {zoomLevel}× Giám Định
            </div>
          </div>
        )}
      </div>

      {/* Instructional helper text */}
      {isActive && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 border border-paper-border/60 bg-paper/90 px-2.5 py-1 text-[11px] text-charcoal-muted font-sans rounded-[1px]">
          Rê chuột để soi nét chạm khắc & vân vật liệu
        </div>
      )}
    </div>
  );
};
