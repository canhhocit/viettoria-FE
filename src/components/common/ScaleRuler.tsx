import React, { useState } from 'react';
import { Ruler, Hand, Info } from 'lucide-react';
import type { ModelSpecifications } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ScaleRulerProps {
  modelSpecs: ModelSpecifications;
  heritageName: string;
}

export const ScaleRuler: React.FC<ScaleRulerProps> = ({ modelSpecs, heritageName }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ruler' | 'hand'>('ruler');
  
  // Height in cm (default 12 for Chua Mot Cot if missing)
  const height = modelSpecs.heightCm || 12;
  const width = modelSpecs.widthCm || 10;
  
  // Generate tick marks for SVG ruler up to 25cm
  const maxRulerCm = 24;
  const rulerTicks = Array.from({ length: maxRulerCm + 1 }, (_, i) => i);

  return (
    <div className="bg-paper-warm border border-brass/40 corner-frame p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest font-semibold">
            <Ruler className="w-4 h-4" />
            <span>{t('scaleRuler.eyebrow')}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
            {t('scaleRuler.title')}
          </h3>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex border border-paper-border bg-paper p-0.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('ruler')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ruler'
                ? 'bg-forest text-brass font-bold'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{t('scaleRuler.rulerTab')}</span>
          </button>
          <button
            onClick={() => setActiveTab('hand')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'hand'
                ? 'bg-forest text-brass font-bold'
                : 'text-charcoal-muted hover:text-forest'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{t('scaleRuler.handTab')}</span>
          </button>
        </div>
      </div>

      {activeTab === 'ruler' ? (
        /* Ruler View */
        <div className="space-y-4">
          <p className="text-xs text-charcoal/80 font-normal">
            {t('scaleRuler.descRuler')} <strong className="text-forest font-semibold">{modelSpecs.scale}</strong>. {t('scaleRuler.heightLabel')} <strong className="text-brass-dark font-semibold">{height} cm</strong> {t('scaleRuler.widthLabel')} <strong className="text-brass-dark font-semibold">{width} cm</strong>.
          </p>

          {/* Graphical SVG Scale Ruler */}
          <div className="p-4 bg-paper border border-paper-border overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Architecture Model Height Indicator Bar */}
              <div className="relative mb-2">
                <div 
                  className="h-7 bg-brass/25 border-l-2 border-r-2 border-brass flex items-center justify-center text-[11px] font-mono font-bold text-forest"
                  style={{ width: `${(height / maxRulerCm) * 100}%` }}
                >
                  <span className="truncate px-2">
                    {heritageName}: {height}cm ({modelSpecs.scale})
                  </span>
                </div>
              </div>

              {/* The Metric Ruler SVG */}
              <svg className="w-full h-12" viewBox={`0 0 ${maxRulerCm * 20} 48`}>
                {/* Main Axis Line */}
                <line x1="0" y1="24" x2={maxRulerCm * 20} y2="24" stroke="var(--heritage-brass)" strokeWidth="1.5" />

                {/* Ticks and centimeter numbers */}
                {rulerTicks.map((cm) => {
                  const x = cm * 20;
                  const isMajor = cm % 5 === 0;
                  const isTarget = cm === Math.round(height);

                  return (
                    <g key={cm}>
                      <line
                        x1={x}
                        y1={isMajor ? 8 : 16}
                        x2={x}
                        y2={isMajor ? 40 : 32}
                        stroke={isTarget ? 'var(--heritage-cinnabar)' : isMajor ? 'var(--heritage-forest)' : 'var(--heritage-brass)'}
                        strokeWidth={isTarget ? 2 : isMajor ? 1.5 : 1}
                      />
                      {isMajor && (
                        <text
                          x={x}
                          y="46"
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="monospace"
                          fill="var(--heritage-forest)"
                          fontWeight="bold"
                        >
                          {cm}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-charcoal-muted uppercase pt-1">
                <span>{t('scaleRuler.lakeOrigin')}</span>
                <span>{t('scaleRuler.opticalTolerance')}</span>
                <span>{maxRulerCm} cm</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hand Comparison View */
        <div className="p-6 bg-paper border border-paper-border space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-around">
            {/* Hand Silhouette Graphic */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="w-24 h-36 border border-dashed border-paper-border flex flex-col items-center justify-center p-3 text-charcoal-muted">
                <Hand className="w-12 h-12 text-forest/40 mb-1" />
                <span className="text-[10px] font-mono">{t('scaleRuler.standardHand')}</span>
              </div>
              <span className="text-[11px] font-mono text-charcoal-muted">{t('scaleRuler.humanScaleRef')}</span>
            </div>

            {/* Model Height Comparison */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div 
                className="w-20 border-2 border-brass bg-brass/15 flex flex-col items-center justify-center p-2 text-forest shadow-sm"
                style={{ height: `${(height / 18) * 144}px` }}
              >
                <span className="font-serif font-bold text-xs">{heritageName}</span>
                <span className="font-mono text-sm font-bold text-brass-dark">{height} cm</span>
              </div>
              <span className="text-[11px] font-mono text-brass font-bold">{t('scaleRuler.miniatureModel')}</span>
            </div>

            {/* Tactile Highlights */}
            <div className="max-w-xs space-y-2 text-xs font-normal text-charcoal/85">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                <span>
                  {t('scaleRuler.tactileDesc')}
                </span>
              </div>
              <div className="p-2 bg-paper-warm border border-paper-border text-[11px] font-mono">
                {t('scaleRuler.netWeightLabel')} <strong>{modelSpecs.weightGrams} gram</strong> {t('scaleRuler.materialBioDesc')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaleRuler;
