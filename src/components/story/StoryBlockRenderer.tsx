import React from 'react';
import type { StoryBlock } from '../../types';
import { Clock } from 'lucide-react';
import { resolveImageUrl, handleImageFallback } from '../../utils/mediaResolver';
import { useLanguage } from '../../contexts/LanguageContext';

interface StoryBlockRendererProps {
  block: StoryBlock;
  heritageName?: string;
}

export const StoryBlockRenderer: React.FC<StoryBlockRendererProps> = ({ block }) => {
  const { t } = useLanguage();
  if (block.status === 'hidden') return null;

  switch (block.type) {
    case 'text':
      return (
        <section className="py-8 sm:py-12 border-b border-paper-border last:border-b-0">
          <div className="max-w-3xl mx-auto space-y-4">
            {block.subtitle && (
              <p className="text-xs font-mono uppercase tracking-widest text-brass font-semibold">
                {block.subtitle}
              </p>
            )}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
              {block.title}
            </h3>
            <div className="text-base sm:text-lg text-charcoal/85 leading-relaxed font-normal whitespace-pre-line first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-forest first-letter:float-left first-letter:mr-2.5 first-letter:leading-none">
              {block.content}
            </div>
          </div>
        </section>
      );

    case 'image':
      return (
        <section className="py-8 sm:py-12 border-b border-paper-border last:border-b-0">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="overflow-hidden bg-forest-dark border border-brass/30 corner-frame">
              <img
                src={resolveImageUrl(block.mediaUrl)}
                alt={block.mediaCaption || block.title}
                onError={(e) => handleImageFallback(e)}
                className="w-full h-auto max-h-[550px] object-cover hover:scale-102 transition-transform duration-500"
              />
            </div>
            {block.mediaCaption && (
              <p className="text-center text-xs font-mono text-charcoal-muted uppercase tracking-wider italic">
                {block.mediaCaption}
              </p>
            )}
          </div>
        </section>
      );

    case 'text_image':
      return (
        <section className="py-10 sm:py-14 border-b border-paper-border last:border-b-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              {block.subtitle && (
                <p className="text-xs font-mono uppercase tracking-widest text-brass font-semibold">
                  {block.subtitle}
                </p>
              )}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                {block.title}
              </h3>
              <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-normal whitespace-pre-line">
                {block.content}
              </p>
            </div>

            {/* Right Media */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden bg-forest border border-brass/40 corner-frame shadow-lg">
                <img
                  src={resolveImageUrl(block.mediaUrl || '/images/chua-mot-cot.webp')}
                  alt={block.mediaCaption || block.title}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-auto object-cover"
                />
              </div>
              {block.mediaCaption && (
                <p className="mt-2 text-xs font-mono text-charcoal-muted tracking-wide">
                  {block.mediaCaption}
                </p>
              )}
            </div>
          </div>
        </section>
      );

    case 'timeline':
      return (
        <section className="py-10 sm:py-16 border-b border-paper-border last:border-b-0">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <div className="inline-flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                <span>{t('timeline.historyBadge', 'Tiến Trình Niên Đại Lịch Sử')}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                {block.title}
              </h3>
              {block.content && (
                <p className="text-sm text-charcoal-muted font-normal max-w-xl mx-auto">
                  {block.content}
                </p>
              )}
            </div>

            {/* Timeline Vertical Track */}
            <div className="relative pl-6 sm:pl-8 border-l border-brass/50 space-y-8 sm:space-y-10 ml-4 sm:ml-8">
              {(block.timelineItems || []).map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 bg-paper border-2 border-brass flex items-center justify-center group-hover:bg-forest transition-colors">
                    <div className="w-1.5 h-1.5 bg-brass"></div>
                  </div>

                  <div className="bg-paper p-5 border border-paper-border hover:border-brass transition-all corner-frame">
                    <span className="font-serif font-bold text-lg text-brass block mb-1">
                      {`${t('timeline.yearPrefix', 'Năm')} ${item.year}`}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-forest mb-1.5">
                      {item.event}
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal/80 font-normal leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'highlight':
      return (
        <section className="py-10 sm:py-14 border-b border-paper-border last:border-b-0">
          <div className="p-8 sm:p-10 bg-forest text-paper border border-brass corner-frame relative overflow-hidden">
            <div 
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle,var(--heritage-brass)_1px,transparent_1px)] bg-[size:24px_24px]"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
              {block.highlightBadge && (
                <span className="inline-block px-3 py-1 bg-brass text-forest text-xs font-mono uppercase tracking-widest font-bold">
                  {block.highlightBadge}
                </span>
              )}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                {block.title}
              </h3>
              <p className="font-serif text-lg sm:text-xl italic text-brass-subtle leading-relaxed">
                "{block.content}"
              </p>
              {block.subtitle && (
                <p className="text-xs font-mono uppercase tracking-widest text-paper/60 pt-2">
                  — {block.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};

export default StoryBlockRenderer;
