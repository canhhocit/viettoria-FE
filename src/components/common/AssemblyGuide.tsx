import React, { useState } from 'react';
import { Hammer, CheckCircle, ChevronRight, Info, Sparkles } from 'lucide-react';
import type { AssemblyStepData } from '../../types';

interface AssemblyGuideProps {
  steps?: AssemblyStepData[];
  heritageName?: string;
}

const DEFAULT_STEPS: AssemblyStepData[] = [
  {
    step: 1,
    title: 'Gia Cố Trụ Đơn & Bệ Đá',
    nameVi: 'Cột trụ đá đường kính 1.25m & Chân tảng hoa sen',
    description: 'Khối đế vững chãi mô phỏng chân tảng hoa sen nguyên khối. Cột trụ được in 3D rỗng vi hạt để tạo trọng tâm hoàn hảo tại đáy hồ Linh Chiểu.',
    detail: 'Khớp mộng số 01: Mộng âm tròn định tâm chống xoay lệch.',
    highlight: 'Trụ đá nguyên khối vươn cao',
  },
  {
    step: 2,
    title: 'Đan Khung Hệ Xà Nách',
    nameVi: 'Hệ thống xà lim đòn tay mộng gỗ âm dương',
    description: 'Tám cánh xà nách vươn rộng như 8 cánh sen lớn đỡ lấy tòa đài. Các thanh dầm được gài khít vào nhau theo tỷ lệ mộng cổ không dùng keo dán hóa học.',
    detail: 'Khớp mộng số 02 - 08: Hệ mộng én đôi khóa chéo chịu lực uốn.',
    highlight: '8 xà nách vươn tỏa như đài sen',
  },
  {
    step: 3,
    title: 'Dựng Điện Liên Hoa Đài',
    nameVi: 'Khung điện thờ gỗ lim vuông vắn',
    description: 'Tòa Phật đường nhỏ nhắn kích thước mỗi cạnh 3m. Hệ cột quân, cửa bức bàn và xà ngang được liên kết chặt chẽ vào sàn đài sen.',
    detail: 'Khớp mộng số 09 - 18: Mộng mang cá ghép kín 4 góc hiên.',
    highlight: 'Chính điện thờ tượng Quan Âm',
  },
  {
    step: 4,
    title: 'Lợp Mái Ngói Mũi Hài & Đầu Đao',
    nameVi: 'Bộ 4 mái ngói đao cong thanh thoát thời Lý',
    description: 'Bốn góc mái ngói uốn cong nhẹ nhàng hướng lên trời cao với hình tượng lá sen và đuôi chim phượng, tái hiện nguyên vẹn kỹ nghệ đắp ngói cổ truyền.',
    detail: 'Khớp mộng số 19 - 24: Khóa nóc chóp nhọn hoàn thiện cấu trúc.',
    highlight: 'Góc đao uốn cong uyển chuyển',
  },
];

export const AssemblyGuide: React.FC<AssemblyGuideProps> = ({ steps = DEFAULT_STEPS, heritageName = 'Chùa Một Cột' }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="bg-paper-warm border border-brass/40 corner-frame overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 bg-forest text-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brass/30">
        <div>
          <div className="flex items-center gap-2 text-brass text-[11px] font-mono tracking-widest uppercase mb-1">
            <Hammer className="w-4 h-4" />
            <span>Kỹ Nghệ Khớp Mộng Gỗ Truyền Thống</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-paper leading-snug">
            Cơ Chế Lắp Ráp Thủ Công — {heritageName}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-paper/80 bg-forest-dark px-3 py-1.5 border border-paper/10">
          <Sparkles className="w-3.5 h-3.5 text-brass" />
          <span>Không Keo Dán • Thuần Mộng Âm Dương</span>
        </div>
      </div>

      {/* Step Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-paper-border bg-paper">
        {steps.map((st, idx) => (
          <button
            key={st.step}
            onClick={() => setActiveStepIndex(idx)}
            className={`p-4 text-left border-r last:border-r-0 border-paper-border transition-all ${
              activeStepIndex === idx
                ? 'bg-forest text-paper border-b-2 border-b-brass shadow-inner'
                : 'bg-paper hover:bg-paper-warm text-charcoal'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                activeStepIndex === idx ? 'text-brass' : 'text-charcoal-muted'
              }`}>
                Bước 0{st.step}
              </span>
              {activeStepIndex === idx && <CheckCircle className="w-3.5 h-3.5 text-brass" />}
            </div>
            <p className="font-serif text-sm font-semibold truncate">{st.title}</p>
          </button>
        ))}
      </div>

      {/* Step Detail Panel */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-paper-warm">
        {/* Left Information */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-block px-3 py-1 bg-brass/15 border border-brass/30 text-forest text-xs font-mono uppercase tracking-wider font-semibold">
            {currentStep.highlight}
          </div>

          <h4 className="font-serif text-2xl font-bold text-forest">
            {currentStep.nameVi}
          </h4>

          <p className="text-sm text-charcoal/85 leading-relaxed font-normal">
            {currentStep.description}
          </p>

          <div className="p-4 bg-paper border-l-2 border-brass border-y border-r border-paper-border flex items-start gap-3">
            <Info className="w-4 h-4 text-brass shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-forest font-medium">
              {currentStep.detail}
            </p>
          </div>

          {/* Step Navigation Controls */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-4 py-2 border border-paper-border bg-paper text-charcoal text-xs font-mono uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:border-brass transition-colors"
            >
              Bước Trước
            </button>

            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-5 py-2 bg-forest text-paper text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brass transition-colors"
            >
              <span>Bước Kế Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Blueprint Graphic Diagram */}
        <div className="lg:col-span-5 bg-forest-dark border border-brass/30 p-6 text-paper text-center relative overflow-hidden group">
          <div 
            className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--heritage-brass)_1px,transparent_1px)] bg-[size:16px_16px]"
            aria-hidden="true"
          />

          <div className="relative z-10 py-6">
            <div className="w-20 h-20 mx-auto border-2 border-brass flex items-center justify-center text-brass font-serif text-3xl font-bold mb-4 shadow-inner">
              0{currentStep.step}
            </div>

            <p className="font-serif text-base font-semibold text-paper mb-1">
              Bản Vẽ Kết Cấu 3D Sơ Lược
            </p>
            <p className="text-[11px] font-mono text-paper/60 uppercase tracking-widest">
              Định vị khớp mộng chuẩn xác 0.08mm
            </p>

            <div className="mt-6 pt-4 border-t border-paper/10 text-left text-xs font-mono text-brass-subtle space-y-1.5">
              <div className="flex justify-between">
                <span>Vật liệu:</span>
                <span className="text-paper">BioPETG Khoáng Đá</span>
              </div>
              <div className="flex justify-between">
                <span>Độ dung sai:</span>
                <span className="text-paper">± 0.05 mm</span>
              </div>
              <div className="flex justify-between">
                <span>Lực khóa khớp:</span>
                <span className="text-paper">Khóa ma sát tự nhiên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblyGuide;
