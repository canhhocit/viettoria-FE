import React from 'react';

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'overlay' | 'section' | 'inline';
export type LoaderTheme = 'paper' | 'forest' | 'transparent';

export interface HeritageSpinnerProps {
  size?: LoaderSize;
  className?: string;
}

const SPINNER_SIZES: Record<LoaderSize, { box: string; ring: string }> = {
  sm: { box: 'w-7 h-7', ring: '-inset-1' },
  md: { box: 'w-12 h-12', ring: '-inset-1.5' },
  lg: { box: 'w-16 h-16', ring: '-inset-2' },
  xl: { box: 'w-22 h-22', ring: '-inset-2.5' },
};

/**
 * Biểu tượng Logo Viettoria xoay chuyển di sản (Heritage Spinner)
 * Kết hợp vòng nhật nguyệt Đồng Sơn antique brass và huy hiệu vàng Viettoria xoay tròn
 */
export const HeritageSpinner: React.FC<HeritageSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeConfig = SPINNER_SIZES[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${sizeConfig.box} ${className}`}
      role="status"
      aria-label="Đang tải..."
    >
      {/* 1. Vòng hoa văn Đồng Sơn quay ngược chiều kim đồng hồ */}
      <div
        className={`absolute ${sizeConfig.ring} rounded-full border border-dashed border-brass/50 animate-spin`}
        style={{ animationDuration: '7s', animationDirection: 'reverse' }}
        aria-hidden="true"
      />

      {/* 2. Vòng hào quang vàng son quay thuận chiều */}
      <div
        className="absolute inset-0 rounded-full border-2 border-brass/25 border-t-brass animate-spin"
        style={{ animationDuration: '2s' }}
        aria-hidden="true"
      />

      {/* 3. Huy hiệu Logo Viettoria quay tròn mượt mà */}
      <div className="relative h-full w-full rounded-full overflow-hidden p-0.5 shadow-md flex items-center justify-center bg-forest-dark border border-brass/80">
        <img
          src="/favicon.svg"
          alt="Viettoria Logo"
          className="h-full w-full object-cover rounded-full animate-spin"
          style={{ animationDuration: '4s' }}
        />
      </div>
    </div>
  );
};

export interface HeritageLoaderProps {
  /**
   * Chế độ hiển thị:
   * - 'overlay': Phủ và làm mờ nền phía sau (backdrop-blur)
   * - 'section': Hiển thị gọn gàng giữa khối nội dung (như trong trang Admin)
   * - 'inline': Hiển thị nhỏ gọn cạnh văn bản
   */
  variant?: LoaderVariant;
  size?: LoaderSize;
  message?: string;
  submessage?: string;
  showWordmark?: boolean;
  blur?: boolean;
  theme?: LoaderTheme;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Hệ thống Loading Di Sản Viettoria (Heritage Loader)
 * Đáp ứng linh hoạt 2 chế độ:
 * 1. Làm mờ màn hình (Backdrop Blur Overlay) cho trang khách hàng hoặc chuyển cảnh
 * 2. Quay tại chỗ (Section Inline) cho từng khu vực nội dung
 */
export const HeritageLoader: React.FC<HeritageLoaderProps> = ({
  variant = 'section',
  size = variant === 'inline' ? 'sm' : variant === 'overlay' ? 'lg' : 'md',
  message,
  submessage,
  showWordmark = variant === 'overlay',
  blur = true,
  theme = 'paper',
  fullScreen = false,
  className = '',
}) => {
  // 1. Chế độ Inline
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 font-sans text-xs text-charcoal ${className}`}>
        <HeritageSpinner size={size} />
        {message && <span>{message}</span>}
      </div>
    );
  }

  // 2. Chế độ Overlay làm mờ nền
  if (variant === 'overlay') {
    const backdropClasses = fullScreen
      ? 'fixed inset-0 z-50'
      : 'absolute inset-0 z-40';

    const themeClasses =
      theme === 'forest'
        ? `bg-forest-dark/80 text-paper ${blur ? 'backdrop-blur-md' : ''}`
        : theme === 'transparent'
        ? `${blur ? 'backdrop-blur-sm' : ''}`
        : `bg-paper/85 text-charcoal ${blur ? 'backdrop-blur-md' : ''}`;

    return (
      <div
        className={`${backdropClasses} ${themeClasses} flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center justify-center max-w-sm">
          {/* Logo quay */}
          <HeritageSpinner size={size} />

          {/* Logo chữ Viettoria */}
          {showWordmark && (
            <div className="mt-4">
              <img
                src="/viettoria-noback.svg"
                alt="VIETTORIA"
                className={`h-6 sm:h-7 w-auto object-contain transition-opacity ${
                  theme === 'forest' ? 'brightness-0 invert opacity-95' : 'opacity-90'
                }`}
              />
            </div>
          )}

          {/* Thông điệp chính */}
          {message && (
            <p className={`mt-3 font-serif text-sm font-semibold tracking-wide ${
              theme === 'forest' ? 'text-brass-subtle' : 'text-forest'
            }`}>
              {message}
            </p>
          )}

          {/* Thông điệp phụ */}
          {submessage && (
            <p className="mt-1 font-cinzel text-[11px] uppercase tracking-widest text-charcoal-muted font-semibold">
              {submessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. Chế độ Section (Mặc định trong các khối nội dung / Admin)
  return (
    <div
      className={`py-14 sm:py-20 flex flex-col items-center justify-center text-center px-4 select-none ${className}`}
      role="status"
      aria-live="polite"
    >
      <HeritageSpinner size={size} />

      {message && (
        <p className="mt-3.5 font-serif text-sm text-forest font-semibold tracking-wide">
          {message}
        </p>
      )}

      {submessage && (
        <p className="mt-1 font-cinzel text-[10px] uppercase tracking-widest text-charcoal-muted font-bold">
          {submessage}
        </p>
      )}
    </div>
  );
};

export default HeritageLoader;

