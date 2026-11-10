import type React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean | string;
        'rotation-per-second'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        exposure?: string;
        loading?: string;
        reveal?: string;
        'interaction-prompt'?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'quick-look-browsers'?: string;
        style?: React.CSSProperties;
        className?: string;
        ref?: React.Ref<HTMLElement | null>;
        children?: React.ReactNode;
      };
    }
  }
}
