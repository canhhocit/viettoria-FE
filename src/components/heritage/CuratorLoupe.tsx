import React, { useState, useRef, useCallback } from 'react';

interface CuratorLoupeProps {
  imageSrc: string;
  altText: string;
  zoomLevel?: number;
  className?: string;
}

export const CuratorLoupe: React.FC<CuratorLoupeProps> = ({
  imageSrc,
  altText,
  zoomLevel = 2,
  className = '',
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const LENS_DIAMETER = 180;

  const updateLoupe = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || !imgRef.current) return;
      const container = containerRef.current;
      const img = imgRef.current;
      const containerRect = container.getBoundingClientRect();

      // Check if cursor is outside container bounds
      if (
        clientX < containerRect.left ||
        clientX > containerRect.right ||
        clientY < containerRect.top ||
        clientY > containerRect.bottom
      ) {
        setIsHovering(false);
        return;
      }

      const cursorX = clientX - containerRect.left;
      const cursorY = clientY - containerRect.top;

      // Handle rendered image dimensions with object-contain
      const nw = img.naturalWidth || containerRect.width;
      const nh = img.naturalHeight || containerRect.height;
      const containerAspect = containerRect.width / containerRect.height;
      const imgAspect = nw / nh;

      let renderedW = containerRect.width;
      let renderedH = containerRect.height;
      let renderedX = 0;
      let renderedY = 0;

      if (imgAspect > containerAspect) {
        renderedH = containerRect.width / imgAspect;
        renderedY = (containerRect.height - renderedH) / 2;
      } else {
        renderedW = containerRect.height * imgAspect;
        renderedX = (containerRect.width - renderedW) / 2;
      }

      const imgCursorX = cursorX - renderedX;
      const imgCursorY = cursorY - renderedY;

      // Only show loupe if hovering over the actual photo area
      if (
        imgCursorX < 0 ||
        imgCursorX > renderedW ||
        imgCursorY < 0 ||
        imgCursorY > renderedH
      ) {
        setIsHovering(false);
        return;
      }

      setIsHovering(true);
      setLensPos({ x: cursorX, y: cursorY });

      // Magnified dimensions of the background image
      const zoomW = renderedW * zoomLevel;
      const zoomH = renderedH * zoomLevel;

      // Center the point under cursor at the center of the circular lens
      const bgX = LENS_DIAMETER / 2 - imgCursorX * zoomLevel;
      const bgY = LENS_DIAMETER / 2 - imgCursorY * zoomLevel;

      setBgSize({ w: zoomW, h: zoomH });
      setBgPos({ x: bgX, y: bgY });
    },
    [zoomLevel]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateLoupe(e.clientX, e.clientY);
    },
    [updateLoupe]
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      updateLoupe(touch.clientX, touch.clientY);
    },
    [updateLoupe]
  );

  const handleLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div className={`relative select-none ${className}`}>
      {/* Main Image Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleLeave}
        className="relative h-full w-full overflow-hidden cursor-crosshair"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt={altText}
          className="h-full w-full object-contain pointer-events-none"
        />

        {/* Circular Antique Brass Bezel Loupe Lens */}
        {isHovering && (
          <div
            className="pointer-events-none absolute z-30 rounded-full border-2 border-brass bg-no-repeat shadow-2xl transition-opacity duration-75"
            style={{
              width: `${LENS_DIAMETER}px`,
              height: `${LENS_DIAMETER}px`,
              left: `${lensPos.x - LENS_DIAMETER / 2}px`,
              top: `${lensPos.y - LENS_DIAMETER / 2}px`,
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
              backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
              boxShadow:
                '0 0 0 2px rgba(20,40,32,0.5), inset 0 0 16px rgba(0,0,0,0.35), 0 12px 28px -4px rgba(0,0,0,0.6)',
            }}
          >
            {/* Inner Brass Rim Accent */}
            <div className="absolute inset-0 rounded-full border border-brass-light/35 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};
