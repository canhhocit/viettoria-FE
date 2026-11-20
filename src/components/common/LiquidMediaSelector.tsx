import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface LiquidMediaOption<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

export interface LiquidMediaSelectorProps<T extends string = string> {
  options: LiquidMediaOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: 'paper' | 'lacquer' | 'royal';
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export const LiquidMediaSelector = <T extends string = string>({
  options,
  activeId,
  onChange,
  className = '',
  variant = 'paper',
  size = 'md',
  ariaLabel = 'Media Selector',
}: LiquidMediaSelectorProps<T>): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<T, HTMLButtonElement>>(new Map());
  const uniqueId = useId().replace(/:/g, '_');
  const filterId = `liquid-goo-${uniqueId}`;

  // Track coordinates of the active pill
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; height: number }>({
    left: 0,
    width: 0,
    height: 0,
  });

  // Track liquid droplet stretch state
  const [isStretching, setIsStretching] = useState(false);
  const [dropletStyle, setDropletStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Click ripple particles
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Update pill position when activeId or options change
  const updatePosition = useCallback((targetId: T, animate = true) => {
    const container = containerRef.current;
    const button = buttonRefs.current.get(targetId);
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const targetLeft = buttonRect.left - containerRect.left;
    const targetWidth = buttonRect.width;
    const targetHeight = buttonRect.height;

    if (animate && pillStyle.width > 0) {
      // Calculate stretch between old pill and new pill
      const minLeft = Math.min(pillStyle.left, targetLeft);
      const maxRight = Math.max(pillStyle.left + pillStyle.width, targetLeft + targetWidth);
      const stretchWidth = maxRight - minLeft;

      // First phase: stretch liquid bridge
      setIsStretching(true);
      setDropletStyle({
        left: minLeft,
        width: stretchWidth,
      });

      // Second phase: snap into target pill
      const timer = window.setTimeout(() => {
        setPillStyle({
          left: targetLeft,
          width: targetWidth,
          height: targetHeight,
        });
        setIsStretching(false);
      }, 160);

      return () => window.clearTimeout(timer);
    } else {
      setPillStyle({
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
      });
    }
  }, [pillStyle.left, pillStyle.width]);

  useEffect(() => {
    updatePosition(activeId, true);
  }, [activeId, updatePosition]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      updatePosition(activeId, false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeId, updatePosition]);

  const handleSelect = (id: T, e: React.MouseEvent<HTMLButtonElement>) => {
    if (id === activeId) return;

    // Trigger liquid micro-ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x: rippleX, y: rippleY }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    onChange(id);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = options.findIndex((opt) => opt.id === activeId);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].id);
    }
  };

  // Theme variants
  const variantStyles = {
    paper: {
      container: 'bg-[#F2ECE1]/90 border border-brass/35 text-charcoal shadow-inner backdrop-blur-md',
      pill: 'bg-forest text-brass-light border border-brass/60 shadow-[0_4px_16px_rgba(20,40,32,0.35)]',
      activeText: 'text-brass-light font-bold drop-shadow-xs',
      inactiveText: 'text-charcoal-muted hover:text-forest',
      stretchGlow: 'bg-gradient-to-r from-forest via-[#1B352A] to-forest',
    },
    lacquer: {
      container: 'bg-[#0D1C16]/90 border border-brass/40 text-paper shadow-inner backdrop-blur-md',
      pill: 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88A38] text-forest border border-brass-light/80 shadow-[0_4px_18px_rgba(212,175,55,0.4)]',
      activeText: 'text-forest font-bold',
      inactiveText: 'text-paper/70 hover:text-paper',
      stretchGlow: 'bg-gradient-to-r from-[#B88A38] via-[#F3E5AB] to-[#B88A38]',
    },
    royal: {
      container: 'bg-[#15171C]/95 border border-[#D4AF37]/50 text-paper shadow-2xl backdrop-blur-lg',
      pill: 'bg-gradient-to-b from-[#D4AF37] to-[#8F6E4A] text-forest border border-[#F5D77F] shadow-[0_0_20px_rgba(212,175,55,0.5)]',
      activeText: 'text-forest font-extrabold',
      inactiveText: 'text-paper/65 hover:text-brass-light',
      stretchGlow: 'bg-gradient-to-r from-[#D4AF37] via-[#FFE8A3] to-[#8F6E4A]',
    },
  }[variant];

  const sizeStyles = {
    sm: {
      container: 'p-1 gap-1 text-[11px]',
      button: 'px-2.5 py-1.5 min-h-[32px] gap-1.5',
      icon: 'w-3.5 h-3.5',
      badge: 'text-[9px] px-1 py-0.2',
    },
    md: {
      container: 'p-1.5 gap-1.5 text-xs',
      button: 'px-3.5 py-2 min-h-[38px] gap-2',
      icon: 'w-4 h-4',
      badge: 'text-[9.5px] px-1.5 py-0.5',
    },
  }[size];

  return (
    <div className={`liquid-media-selector-wrap relative inline-flex ${className}`}>
      {/* 1. Invisible SVG Gooey Metaball Filter */}
      <svg
        className="pointer-events-none absolute -left-[9999px] -top-[9999px] h-0 w-0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 19 -8.5
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 2. Main Selector Shell */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={`liquid-selector-container relative flex items-center rounded-full select-none ${variantStyles.container} ${sizeStyles.container}`}
      >
        {/* 3. Liquid Gooey Background Layer */}
        <div
          className="liquid-filter-stage pointer-events-none absolute inset-0 rounded-full overflow-hidden"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Main Active Pill */}
          <div
            className={`liquid-active-pill absolute rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${variantStyles.pill}`}
            style={{
              left: `${pillStyle.left}px`,
              top: '4px',
              width: `${pillStyle.width}px`,
              height: pillStyle.height ? `${pillStyle.height}px` : 'calc(100% - 8px)',
              transform: isStretching ? 'scale(1.04, 0.96)' : 'scale(1, 1)',
            }}
          />

          {/* Meniscus Stretch Bridge (Liquid Droplet) */}
          {isStretching && (
            <div
              className={`liquid-stretch-droplet absolute rounded-full transition-all duration-150 ease-out opacity-90 ${variantStyles.stretchGlow}`}
              style={{
                left: `${dropletStyle.left}px`,
                top: '5px',
                width: `${dropletStyle.width}px`,
                height: pillStyle.height ? `${pillStyle.height - 2}px` : 'calc(100% - 10px)',
              }}
            />
          )}
        </div>

        {/* 4. Interactive Tabs Foreground Layer */}
        {options.map((option) => {
          const isActive = option.id === activeId;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(option.id, el);
                else buttonRefs.current.delete(option.id);
              }}
              role="tab"
              type="button"
              id={`tab-${option.id}-${uniqueId}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => handleSelect(option.id, e)}
              className={`group relative z-10 flex items-center justify-center font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${sizeStyles.button} ${
                isActive ? variantStyles.activeText : variantStyles.inactiveText
              }`}
            >
              {/* Icon with liquid elastic bounce */}
              {Icon && (
                <Icon
                  className={`transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${sizeStyles.icon} ${
                    isActive ? 'scale-110 rotate-2' : 'group-hover:scale-105'
                  }`}
                />
              )}

              {/* Label */}
              <span className="truncate">{option.label}</span>

              {/* Optional Count / Badge */}
              {option.badge !== undefined && (
                <span
                  className={`ml-1 rounded-full font-mono font-semibold transition-colors ${sizeStyles.badge} ${
                    isActive
                      ? 'bg-brass text-forest shadow-xs'
                      : 'bg-black/10 text-charcoal/70'
                  }`}
                >
                  {option.badge}
                </span>
              )}

              {/* Click Ripple Effect */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="pointer-events-none absolute h-6 w-6 rounded-full bg-brass/40 animate-ping"
                  style={{
                    left: `${ripple.x - 12}px`,
                    top: `${ripple.y - 12}px`,
                  }}
                />
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LiquidMediaSelector;
