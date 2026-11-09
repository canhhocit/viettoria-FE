import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Headphones,
  Layers, 
  ShieldCheck, 
  Compass,
  Camera,
  ArrowRight
} from 'lucide-react';
import { VIETTORIA_IMAGES, handleImageFallback } from '../utils/mediaResolver';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-paper min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Atelier Hero Section */}
        <section className="max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-brass text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Câu Chuyện Khởi Nguồn & Sứ Mệnh</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-forest leading-[1.15]">
            Khắc Dấu Thời Gian,<br />
            <span className="italic font-normal text-brass-dark">Nối Dài Hồn Cốt Dân Tộc</span>
          </h1>

          <p className="font-serif text-xl sm:text-2xl italic text-charcoal/85 leading-relaxed font-normal border-l-2 border-brass pl-6">
            "VIETTORIA không bán một mô hình thu nhỏ đơn thuần. VIETTORIA mang đến một cách mới để khám phá, hiểu và lưu giữ những câu chuyện của di sản Việt Nam."
          </p>

          <p className="text-base sm:text-lg text-charcoal/80 font-normal leading-relaxed">
            Xuất phát từ niềm đau đáu trước nguy cơ mai một của các công trình kiến trúc cổ kính qua thăng trầm thời gian và khói lửa chiến tranh, VIETTORIA được thành lập như một xưởng chế tác di sản kết hợp công nghệ vật lý và số hóa (Phygital Heritage Atelier). Chúng tôi biến những di sản trầm mặc nghìn năm thành những hiện vật sống động có thể chạm vào, cảm nhận và lắng nghe ngay trên lòng bàn tay.
          </p>
        </section>

        {/* Brand Meaning Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-paper-warm border border-paper-border corner-frame p-8 sm:p-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brass font-bold">
              Ý Nghĩa Tên Gọi VIETTORIA
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest">
              Giao Thoa Giữa Bản Sắc Việt & Khát Vọng Trường Tồn
            </h2>
            <div className="space-y-3 text-sm text-charcoal/80 font-normal leading-relaxed">
              <p>
                <strong className="text-forest font-semibold">"VIET":</strong> Tượng trưng cho non sông gấm vóc, cốt cách kiên cường và bề dày văn hóa ngàn năm của người Việt Nam.
              </p>
              <p>
                <strong className="text-forest font-semibold">"TORIA" (Từ gốc Victoria / Khải Hoàn):</strong> Biểu trưng cho sự chiến thắng của ký ức trước thời gian, sự tôn vinh vĩnh cửu những giá trị thủ công và kiến trúc mà tiền nhân đã dày công kiến tạo.
              </p>
            </div>
          </div>

          <div className="bg-forest text-paper p-8 border border-brass corner-frame space-y-4">
            <span className="text-xs font-mono text-brass uppercase tracking-widest block">Cam Kết Atelier</span>
            <p className="font-serif text-2xl font-bold text-paper">
              Khảo Cứu Tư Liệu & Đối Chiếu Tỷ Lệ
            </p>
            <p className="text-sm text-paper/80 font-normal leading-6">
              Tất cả chi tiết kiến trúc—từ vòm cuốn gạch vồ, con sơn kẻ chuyền, đến từng đầu đao mái ngói—đều được đối sánh trực tiếp với hồ sơ trùng tu và bản vẽ khảo cổ học.
            </p>
          </div>
        </section>

        {/* 3 Core Production Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brass font-semibold">
              Kỹ Nghệ & Công Nghệ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              Quy Trình Chế Tác Độc Bản
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                1. Vật Liệu Xanh BioPETG
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                Ứng dụng sợi sinh học BioPETG kết hợp bột khoáng tự nhiên, đạt độ bền cơ học cao, chịu ẩm nhiệt đới và an toàn tuyệt đối với sức khỏe con người cũng như môi trường.
              </p>
            </div>

            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                2. Mộng Gỗ Không Dùng Keo
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                Kế thừa trọn vẹn trí tuệ của thợ mộc xưa: cấu kiện ghép nối hoàn toàn bằng khớp mộng âm dương chính xác đến từng micro-mét, cho phép tháo lắp và khám phá cấu trúc rường cột bên trong.
              </p>
            </div>

            <div className="bg-paper p-8 border border-paper-border hover:border-brass transition-all corner-frame space-y-4">
              <div className="w-12 h-12 bg-forest text-brass flex items-center justify-center border border-brass">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">
                3. Trải Nghiệm Thuyết Minh Số
              </h3>
              <p className="text-sm text-charcoal/80 font-normal leading-6">
                Tích hợp mã QR độc bản dẫn đến không gian số hoá riêng biệt. Người sở hữu được lắng nghe bản thu âm độc quyền và đọc các tư liệu lịch sử lưu trữ chuyên sâu.
              </p>
            </div>
          </div>
        </section>

        {/* Workshop & Real Model Atelier Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-paper-border pb-4">
            <div className="space-y-2">
              <span className="text-xs font-cinzel uppercase tracking-widest text-brass font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-brass" />
                <span>Thực Địa & Chế Tác</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest">
                Không Gian Nghiên Cứu & Hiện Vật Thực Tế
              </h2>
            </div>
            <p className="text-xs font-cinzel text-charcoal-muted uppercase tracking-wider">
              Tư liệu lưu trữ xưởng Viettoria Atelier
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.productHighlight}
                  alt="Mô hình in 3D hoàn thiện"
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">Mô Hình Khảo Cứu Thực Tế</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">Tái hiện chân thực đường cong mái đao và kết cấu cột trụ đá</p>
              </div>
            </div>

            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.certificateCard}
                  alt="Thẻ chứng nhận và bao bì"
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">Bao Bì & Thẻ Định Danh Độc Bản</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">Mỗi mô hình được cấp một số hiệu bảo chứng và tem QR riêng</p>
              </div>
            </div>

            <div className="bg-paper-warm border border-paper-border p-3 space-y-3 corner-frame group shadow-xs hover:border-brass/60 transition-colors">
              <div className="aspect-[16/10] overflow-hidden bg-paper-card border border-paper-border">
                <img
                  src={VIETTORIA_IMAGES.monumentDetail1}
                  alt="Chi tiết mộng gỗ"
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <p className="font-display font-bold text-base text-forest">Chi Tiết Cấu Kiện Mộng Khớp</p>
                <p className="text-sm font-sans text-charcoal/75 font-normal leading-relaxed mt-1">Độ chuẩn xác cao, tái hiện kỹ thuật mộng truyền thống của tiền nhân</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer-facing collection call to action */}
        <section className="bg-forest-dark text-paper border border-brass corner-frame p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-subtle">Khám phá Viettoria</p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-paper">
              Mang một phần di sản về gần hơn
            </h2>

            <p className="text-sm sm:text-base text-paper/85 font-normal leading-relaxed">
              Mỗi tác phẩm kết hợp hình dáng kiến trúc, câu chuyện lịch sử và mô hình số để bạn có thể ngắm nhìn di sản theo cách gần gũi hơn.
            </p>

            <Link to="/collections" className="inline-flex items-center gap-2 border-b border-brass/70 pb-1 text-sm font-semibold text-paper transition-colors hover:text-brass-subtle">
              Xem bộ sưu tập <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
