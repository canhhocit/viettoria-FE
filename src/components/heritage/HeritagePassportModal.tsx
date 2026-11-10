import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { usePassport } from '../../contexts/PassportContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MonumentInfo {
  slug: string;
  title: string;
  epoch: string;
  location: string;
  coords: string;
}

const MONUMENT_CATALOG: MonumentInfo[] = [
  {
    slug: 'chua-mot-cot',
    title: 'Chùa Một Cột',
    epoch: 'Triều Lý · 1049',
    location: 'Ba Đình, Hà Nội',
    coords: '21.0359° N, 105.8331° E',
  },
  {
    slug: 'khue-van-cac',
    title: 'Khuê Văn Các',
    epoch: 'Triều Nguyễn · 1805',
    location: 'Văn Miếu, Hà Nội',
    coords: '21.0294° N, 105.8361° E',
  },
  {
    slug: 'ngo-mon-hue',
    title: 'Ngọ Môn Huế',
    epoch: 'Triều Nguyễn · 1833',
    location: 'Đại Nội Huế',
    coords: '16.4686° N, 107.5794° E',
  },
  {
    slug: 'cot-co-ha-noi',
    title: 'Cột Cờ Hà Nội',
    epoch: 'Triều Nguyễn · 1812',
    location: 'Hoàng Thành Thăng Long',
    coords: '21.0325° N, 105.8394° E',
  },
  {
    slug: 'ben-nha-rong',
    title: 'Bến Nhà Rồng',
    epoch: 'Thế kỷ XIX · 1863',
    location: 'Quận 4, TP. Hồ Chí Minh',
    coords: '10.7682° N, 106.7067° E',
  },
];

export const HeritagePassportModal: React.FC = () => {
  const { isPassportOpen, setIsPassportOpen, stamps, totalStamped, totalAvailable, curatorRank } = usePassport();
  const { t } = useLanguage();

  if (!isPassportOpen) return null;

  const progressPercent = Math.round((totalStamped / totalAvailable) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/75 p-4 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsPassportOpen(false)}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border-2 border-brass/70 bg-paper p-6 sm:p-8 shadow-2xl rounded-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsPassportOpen(false)}
          className="absolute right-4 top-4 p-2 text-charcoal-muted hover:text-forest transition-colors"
          aria-label={t('common.close', 'Đóng')}
        >
          <X size={20} />
        </button>

        {/* Passport Booklet Header */}
        <div className="border-b-2 border-brass/40 pb-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-brass bg-forest text-brass">
            <Compass size={24} />
          </div>
          <p className="mt-3 font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-brass">
            Viettoria Atelier · Chứng Thư Khảo Cứu
          </p>
          <h2 id="passport-modal-title" className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-forest">
            Hộ Chiếu Di Sản Việt Nam
          </h2>
          <p className="mt-1 text-xs text-charcoal-muted font-normal max-w-md mx-auto">
            Hồ sơ chứng thực quá trình khảo sát thực địa, chiêm ngưỡng 3D và lắng nghe điển tích lịch sử của du khách.
          </p>

          {/* Rank & Progress Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-paper-border bg-paper-warm p-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <Award className="text-brass shrink-0" size={18} />
              <div className="text-left">
                <span className="font-cinzel text-[10px] uppercase tracking-wider text-brass font-bold block">
                  Phẩm Trật Giám Định
                </span>
                <span className="font-serif text-sm font-bold text-forest">
                  {curatorRank.title} ({curatorRank.badge})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-cinzel text-xs font-bold text-forest">
                {totalStamped} / {totalAvailable} Châu Phê
              </span>
              <div className="mt-1 h-2 w-32 bg-paper-border overflow-hidden rounded-[1px]">
                <div
                  className="h-full bg-brass transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stamps Grid - 5 Canonical Heritage Sites */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MONUMENT_CATALOG.map((monument) => {
            const stampRecord = stamps[monument.slug];
            const isStamped = Boolean(stampRecord);

            return (
              <div
                key={monument.slug}
                className={`relative flex flex-col justify-between border p-4 transition-all rounded-[2px] ${
                  isStamped
                    ? 'border-brass bg-paper-warm/80 shadow-xs'
                    : 'border-dashed border-paper-border bg-paper/50 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-cinzel text-[10px] font-bold text-brass uppercase tracking-wider">
                      {monument.epoch}
                    </span>
                    {isStamped ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-cinnabar">
                        <ShieldCheck size={12} /> Đã Đóng Dấu
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans text-charcoal-muted">Chưa Lưu Dấu</span>
                    )}
                  </div>

                  <h3 className="mt-1 font-serif text-base font-bold text-forest">
                    {monument.title}
                  </h3>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">{monument.location}</p>
                  <p className="font-mono text-[9px] text-charcoal-muted/70 mt-0.5">{monument.coords}</p>
                </div>

                {/* Center Stamp Mark */}
                <div className="my-4 flex items-center justify-center min-h-[90px]">
                  {isStamped ? (
                    <div className="relative flex h-20 w-20 items-center justify-center border-2 border-cinnabar bg-cinnabar/5 p-1 text-cinnabar rotate-[-4deg] shadow-inner">
                      <div className="border border-cinnabar/60 w-full h-full flex flex-col items-center justify-center text-center p-1">
                        <span className="font-cinzel text-[7px] font-bold tracking-widest text-cinnabar-dark">
                          VIETTORIA
                        </span>
                        <span className="font-serif text-[11px] font-extrabold leading-tight text-cinnabar-dark">
                          CHÂU PHÊ
                        </span>
                        <span className="font-mono text-[8px] text-cinnabar font-semibold">
                          {stampRecord.stampedAt}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center border border-dashed border-paper-border text-charcoal-muted/50 rounded-[2px]">
                      <span className="font-cinzel text-[9px] text-center px-1">TRIỆN TRỐNG</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="border-t border-paper-border pt-2 text-right">
                  <Link
                    to={`/products/${monument.slug}`}
                    onClick={() => setIsPassportOpen(false)}
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-forest hover:text-brass transition-colors"
                  >
                    <span>{isStamped ? 'Xem lại di sản' : 'Khảo cứu ngay'}</span>
                    <ExternalLink size={11} className="text-brass" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 border-t border-paper-border pt-4 text-center">
          <p className="text-xs text-charcoal-muted">
            Mẹo: Để thu thập đủ 5 triện son hoàng gia, hãy vào từng công trình, xoay mô hình 3D hoặc lắng nghe trọn vẹn bản Audio Guide thuyết minh.
          </p>
        </div>
      </div>
    </div>
  );
};
