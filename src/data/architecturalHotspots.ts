/**
 * VIETTORIA — Dữ liệu Điểm Khảo Cứu Cấu Kiện Kiến Trúc 3D (3D Architectural Hotspots)
 * Tọa độ 3D (x y z) chuẩn xác được căn chuẩn theo kích thước mô hình glTF.
 * Tích hợp đường chỉ dẫn nét đứt (dashed leader line) và thẻ ghi chú nổi (floating callout card).
 */

export interface ArchitecturalHotspot {
  id: string;
  number: string;
  title: string;
  shortTitle?: string;
  category: string;
  detail: string;
  shortDesc?: string;
  position: string; // "x y z" in meters
  normal: string; // "nx ny nz"
  orbit?: string; // "theta phi radius" e.g. "0deg 75deg 1.8m"
  target?: string; // "x y z" in meters e.g. "0m 0.28m 0m"
  dx?: number; // Leader line horizontal offset in px (âm: sang trái, dương: sang phải)
  dy?: number; // Leader line vertical offset in px
}

export const ARCHITECTURAL_HOTSPOTS: Record<string, ArchitecturalHotspot[]> = {
  // 1. Chùa Một Cột (VT-HN-001)
  'chua-mot-cot': [
    {
      id: 'tru-da',
      number: '01',
      title: 'Trụ Đá Đơn Nguyên Khối',
      shortTitle: 'TRỤ ĐÁ ĐƠN NGUYÊN KHỐI',
      category: 'KẾT CẤU CHỊU LỰC CỐT LÕI',
      detail: 'Hai thớt đá xanh nguyên khối ghép khít bằng mộng đá (đường kính 1.25m, cao 4m), dựng đứng vững chãi giữa lòng hồ Linh Chiểu nâng đỡ toàn bộ ngôi chùa.',
      shortDesc: 'Hai thớt đá xanh đường kính 1.25m ghép mộng dựng giữa lòng hồ Linh Chiểu.',
      position: '0.00 0.24 0.18',
      normal: '0 0 1',
      orbit: '0deg 78deg 1.7m',
      target: '0m 0.24m 0m',
      dx: -140,
      dy: 35,
    },
    {
      id: 'xa-nach',
      number: '02',
      title: 'Hệ Xà Nách 8 Cánh Gỗ Lim',
      shortTitle: 'HỆ XÀ NÁCH 8 CÁNH GỖ LIM',
      category: 'TINH HOA MỘNG GỖ ĐẠI VIỆT',
      detail: 'Tám thanh gỗ lim xẻ xiên 45 độ ăn khớp vào ngọn cột đá, liên kết mộng giằng chịu tải trọng rung chấn, xòe rộng tựa đài hoa sen nâng đỡ gian thờ.',
      shortDesc: 'Tám thanh gỗ lim xẻ xiên 45 độ ăn khớp mộng giằng chịu lực rung chấn.',
      position: '0.28 0.48 0.22',
      normal: '1 0.5 1',
      orbit: '45deg 70deg 1.7m',
      target: '0.12m 0.48m 0.12m',
      dx: -140,
      dy: -30,
    },
    {
      id: 'gian-tho',
      number: '03',
      title: 'Gian Thờ Liên Hoa Đài',
      shortTitle: 'GIAN THỜ LIÊN HOA ĐÀI',
      category: 'KHÔNG GIAN TÂM LINH THIÊNG LIÊNG',
      detail: 'Không gian thờ tượng Phật Bà Quan Thế Âm ngự trên tòa sen vàng sơn then, mô phỏng lại giấc mơ điềm lành của vua Lý Thái Tông năm 1049.',
      shortDesc: 'Không gian thờ tượng Phật Bà Quan Âm ngự tòa sen vàng sơn then thế kỷ 11.',
      position: '0.00 0.62 0.30',
      normal: '0 0 1',
      orbit: '0deg 75deg 1.5m',
      target: '0m 0.62m 0.15m',
      dx: 140,
      dy: 35,
    },
    {
      id: 'mai-cong',
      number: '04',
      title: 'Bờ Mái Đao Cong Vút & Ngói Mũi Hài',
      shortTitle: 'BỜ MÁI ĐAO CONG VÚT',
      category: 'ĐIÊU KHẮC MÁI THỜI LÝ',
      detail: 'Bốn góc mái đao uốn cong thanh thoát, lợp ngói mũi hài nung thủ công với sống mái đắp hình hoa sen và vân mây uốn lượn đặc trưng nghệ thuật thời Lý.',
      shortDesc: 'Bốn góc mái đao uốn cong thanh thoát, lợp ngói mũi hài nung thủ công thời Lý.',
      position: '0.00 0.88 0.42',
      normal: '0 1 1',
      orbit: '20deg 60deg 1.9m',
      target: '0m 0.80m 0m',
      dx: 135,
      dy: -45,
    },
  ],

  // 2. Khuê Văn Các (VT-HN-002) - Căn chuẩn theo tham khảo visual của người dùng
  'khue-van-cac': [
    {
      id: 'tru-gach-vuong',
      number: '01',
      title: 'Trụ Vuông Đá Thanh',
      shortTitle: 'TRỤ VUÔNG ĐÁ THANH',
      category: 'TRIẾT LÝ TRỜI TRÒN ĐẤT VUÔNG',
      detail: 'Tầng dưới gồm 4 cột gạch đá vuông vức tượng trưng cho Đất vuông, nâng đỡ tầng lầu gỗ tròn bên trên tượng trưng cho Trời tròn (Âm Dương giao hòa).',
      shortDesc: '4 trụ đá vuông vức nâng đỡ lầu gỗ: Đất vuông Trời tròn.',
      position: '-0.18 0.22 0.22',
      normal: '-1 0 1',
      orbit: '-45deg 80deg 1.8m',
      target: '0m 0.22m 0m',
      dx: -140,
      dy: 40,
    },
    {
      id: 'cua-so-sao-khue',
      number: '02',
      title: 'Cửa Sổ Nhật Nguyệt',
      shortTitle: 'CỬA SỔ NHẬT NGUYỆT',
      category: 'BIỂU TƯỢNG VĂN HIẾN TRÀNG AN',
      detail: 'Cửa sổ tròn bốn mặt với các thanh gỗ xòe đều như tia sáng của sao Khuê - ngôi sao chủ về văn học, nghệ thuật và tinh thần hiếu học dân tộc.',
      shortDesc: 'Cửa sổ tròn sao Khuê tỏa tia sáng, thếp vàng thủ công.',
      position: '0.22 0.62 0.28',
      normal: '1 0 1',
      orbit: '25deg 75deg 1.6m',
      target: '0m 0.68m 0m',
      dx: 140,
      dy: 35,
    },
    {
      id: 'mai-chong-diem',
      number: '03',
      title: 'Mái Chồng Diêm',
      shortTitle: 'MÁI CHỒNG DIÊM',
      category: 'KẾT CẤU GỖ TRUYỀN THỐNG',
      detail: 'Kiến trúc hai tầng mái chồng diêm duyên dáng lợp ngói ống, các đầu đao cong vút nhẹ nhàng, bờ nóc đắp dải hoa chanh tinh xảo thời Nguyễn.',
      shortDesc: '8 góc mái uốn cong thanh tao đặc trưng Thăng Long thế kỷ 19.',
      position: '0.12 0.88 0.24',
      normal: '1 1 1',
      orbit: '20deg 60deg 1.7m',
      target: '0m 0.85m 0m',
      dx: 135,
      dy: -45,
    },
  ],

  // 3. Cột Cờ Hà Nội (VT-HN-003)
  'cot-co-ha-noi': [
    {
      id: 'vong-canh-dinh',
      number: '01',
      title: 'Vọng Canh Bát Giác & Đỉnh Cột',
      shortTitle: 'VỌNG CANH BÁT GIÁC',
      category: 'ĐIỂM CAO QUAN SÁT HOÀNG THÀNH',
      detail: 'Lầu quan sát hình bát giác trên đỉnh cột cờ với 8 ô cửa sổ nhìn bao quát toàn bộ thành lũy và phố phường Hà Nội, nơi cắm quốc kỳ thiêng liêng.',
      shortDesc: 'Lầu quan sát 8 ô cửa sổ ngắm trọn kinh thành, nơi cắm quốc kỳ thiêng liêng.',
      position: '0.00 0.92 0.08',
      normal: '0 1 0',
      orbit: '0deg 60deg 1.8m',
      target: '0m 0.90m 0m',
      dx: 135,
      dy: -40,
    },
    {
      id: 'than-thap-bat-giac',
      number: '02',
      title: 'Thân Tháp Gạch Vồ Thăng Long',
      shortTitle: 'THÂN THÁP GẠCH VỒ',
      category: 'CÔNG TRÌNH PHÒNG THỦ KIÊN CỐ',
      detail: 'Thân tháp xây bằng gạch vồ nung đỏ cao hơn 18m, thon dần lên đỉnh với 39 lỗ hoa thị xẻ rãnh hoa cúc đón gió và lấy ánh sáng cho cầu thang xoắn ốc.',
      shortDesc: 'Tháp bát giác cao hơn 18m xây bằng gạch vồ nung già triều Nguyễn.',
      position: '-0.12 0.58 0.12',
      normal: '-1 0 1',
      orbit: '-45deg 75deg 1.7m',
      target: '0m 0.58m 0m',
      dx: -140,
      dy: 0,
    },
    {
      id: 'ba-tang-de',
      number: '03',
      title: 'Ba Tầng Bệ Vuông Giật Cấp',
      shortTitle: 'BA TẦNG BỆ VUÔNG',
      category: 'NỀN MÓNG THÀNH QUÁCH THỜI NGUYỄN',
      detail: '3 tầng đế vuông xây giật cấp kiên cố có lan can bao quanh, bốn phía trổ vòm cuốn khắc tên chữ Hán: Nghênh Húc (đón nắng sớm), Hướng Minh, Hồi Quang.',
      shortDesc: 'Ba tầng bệ vuông giật cấp kiên cố trổ vòm cuốn khắc chữ Hán cổ.',
      position: '0.28 0.18 0.28',
      normal: '1 0.5 1',
      orbit: '45deg 80deg 2.0m',
      target: '0m 0.18m 0m',
      dx: 135,
      dy: 45,
    },
  ],

  // 4. Ngọ Môn Huế (VT-HUE-004)
  'ngo-mon-hue': [
    {
      id: 'lau-ngu-phung',
      number: '01',
      title: 'Lầu Ngũ Phụng Uy Nghiêm',
      shortTitle: 'LẦU NGŨ PHỤNG',
      category: 'ĐỈNH CAO CUNG ĐÌNH HUẾ',
      detail: 'Công trình 2 tầng 9 nóc tựa năm con chim phụng xòe cánh che chở hoàng thành, lợp xen kẽ ngói hoàng lưu ly vàng rực rỡ và thanh lưu ly xanh biếc.',
      shortDesc: 'Lầu gác 2 tầng 9 nóc lợp ngói hoàng lưu ly và thanh lưu ly rực rỡ.',
      position: '0.00 0.72 0.35',
      normal: '0 1 1',
      orbit: '0deg 65deg 2.2m',
      target: '0m 0.70m 0m',
      dx: 135,
      dy: -45,
    },
    {
      id: 'cong-chinh-ngo-mon',
      number: '02',
      title: 'Cửa Cuốn Chính Giữa Dành Cho Vua',
      shortTitle: 'LỐI ĐI VƯƠNG QUYỀN',
      category: 'LỐI ĐI ĐỘC TÔN CỦA HOÀNG ĐẾ',
      detail: 'Cửa vòm chính giữa xây cuốn bằng đá hoa cương chỉ mở khi Hoàng đế ngự giá xuất cung, tôn nghiêm bậc nhất Đại Nội Huế.',
      shortDesc: 'Cửa vòm đá hoa cương chỉ mở khi Hoàng đế ngự giá xuất cung.',
      position: '-0.15 0.22 0.45',
      normal: '-1 0 1',
      orbit: '-20deg 80deg 2.0m',
      target: '0m 0.22m 0.2m',
      dx: -140,
      dy: 30,
    },
    {
      id: 'ta-huu-giap-mon',
      number: '03',
      title: 'Tả Giáp Môn & Hữu Giáp Môn',
      shortTitle: 'NỀN ĐÀI ĐÁ THANH',
      category: 'HÀNH LANG QUAN VĂN QUAN VÕ',
      detail: 'Hai cổng phụ hai bên cổng chính dành riêng cho các quan văn, quan võ và binh lính triều đình theo nghi thức triều hội nghiêm ngặt.',
      shortDesc: 'Nền đài kiên cố trổ các cổng phụ cho quan văn, quan võ triều đình.',
      position: '0.55 0.22 0.45',
      normal: '1 0 1',
      orbit: '30deg 80deg 2.0m',
      target: '0.5m 0.22m 0.2m',
      dx: 135,
      dy: 45,
    },
  ],

  // 5. Bến Nhà Rồng (VT-SG-005)
  'ben-nha-rong': [
    {
      id: 'luong-long-chau-nguyet',
      number: '01',
      title: 'Lưỡng Long Chầu Nguyệt',
      shortTitle: 'LƯỠNG LONG CHẦU NGUYỆT',
      category: 'BIỂU TƯỢNG PHƯƠNG NAM',
      detail: 'Đôi rồng đất nung tráng men xanh uốn lượn chầu mặt trăng trên đỉnh nóc tòa nhà, nguồn gốc tạo nên tên gọi lịch sử Bến Nhà Rồng năm 1863.',
      shortDesc: 'Đôi rồng gốm men xanh uốn lượn chầu mặt trăng trên đỉnh mái ngói đỏ.',
      position: '0.00 0.88 0.05',
      normal: '0 1 0',
      orbit: '0deg 60deg 1.9m',
      target: '0m 0.85m 0m',
      dx: 135,
      dy: -45,
    },
    {
      id: 'hanh-lang-vom-phap',
      number: '02',
      title: 'Hành Lang Vòm Cung Cổ Điển',
      shortTitle: 'VÒM CUỐN ĐÔNG DƯƠNG',
      category: 'GIAO THOA KIẾN TRÚC Á - ÂU',
      detail: 'Dãy hành lang vòm cuốn mở thoáng đãng phong cách tân cổ điển Pháp đón trọn luồng gió mát từ sông Sài Gòn thổi vào.',
      shortDesc: 'Dãy hành lang vòm cuốn thoáng đãng phong cách tân cổ điển Pháp đón gió sông.',
      position: '-0.35 0.38 0.38',
      normal: '-1 0 1',
      orbit: '-30deg 75deg 1.8m',
      target: '-0.2m 0.38m 0m',
      dx: -140,
      dy: 20,
    },
  ],

  // 6. Gác Lâu Thăng Long (VT-HN-006)
  'gac-lau-thang-long': [
    {
      id: 'mai-chong-diem',
      number: '01',
      title: 'Mái Chồng Diêm Ba Tầng',
      shortTitle: 'MÁI CHỒNG DIÊM 3 TẦNG',
      category: 'KIẾN TRÚC LẦU ĐÀI ĐẠI VIỆT',
      detail: 'Ba tầng mái ngói mũi hài thanh thoát xếp lớp thu dần lên đỉnh, góc đao vươn cao mô phỏng cấu trúc lầu đài cung đình thời Lê Sơ.',
      shortDesc: 'Ba tầng mái ngói mũi hài thanh thoát thu dần lên đỉnh.',
      position: '0.00 18.50 3.20',
      normal: '0 0.8 0.6',
      orbit: '20deg 60deg 30m',
      target: '0m 18.0m 0m',
      dx: 140,
      dy: -30,
    },
    {
      id: 'dau-dao-uon-luon',
      number: '02',
      title: 'Đầu Đao Khắc Rồng Thời Lê',
      shortTitle: 'ĐẦU ĐAO KHẮC RỒNG',
      category: 'NGHỆ THUẬT ĐIÊU KHẮC LÊ SƠ',
      detail: 'Đầu đao uốn lượn mạnh mẽ chạm khắc hoa văn lá lật và hình tượng rồng thời Lê Sơ dũng mãnh, biểu tượng uy quyền vương giả.',
      shortDesc: 'Đầu đao uốn lượn chạm khắc hoa văn rồng thời Lê Sơ.',
      position: '-5.80 8.50 5.80',
      normal: '-0.7 0.4 0.7',
      orbit: '-35deg 70deg 30m',
      target: '-4.0m 8.5m 4.0m',
      dx: -140,
      dy: -30,
    },
    {
      id: 'chan-de-khao-co',
      number: '03',
      title: 'Chân Bệ Đá Khảo Cổ Thăng Long',
      shortTitle: 'BỆ ĐÁ KHẢO CỔ',
      category: 'HIỆN VẬT KHẢO CỔ THẾ KỶ 15',
      detail: 'Chân bệ mô phỏng tầng nền gạch vồ Thăng Long và chân đá tảng hoa sen khai quật tại trung tâm Hoàng thành.',
      shortDesc: 'Chân bệ mô phỏng gạch vồ và đá tảng hoa sen khảo cổ.',
      position: '0.00 0.80 6.60',
      normal: '0 0.4 1',
      orbit: '0deg 80deg 36m',
      target: '0m 1.0m 0m',
      dx: 140,
      dy: 30,
    },
  ],
};

/**
 * Trả về danh sách điểm khảo cứu kiến trúc dựa theo slug, code hoặc id
 */
export function getHotspotsForProduct(identifier?: string): ArchitecturalHotspot[] {
  if (!identifier) return ARCHITECTURAL_HOTSPOTS['chua-mot-cot'];

  const clean = identifier.toLowerCase().trim();

  // Tra cứu trực tiếp theo slug
  if (ARCHITECTURAL_HOTSPOTS[clean]) {
    return ARCHITECTURAL_HOTSPOTS[clean];
  }

  // Tra cứu theo mã di sản
  if (clean.includes('001') || clean.includes('chua-mot-cot') || clean.includes('mot-cot')) {
    return ARCHITECTURAL_HOTSPOTS['chua-mot-cot'];
  }
  if (clean.includes('002') || clean.includes('khue-van-cac')) {
    return ARCHITECTURAL_HOTSPOTS['khue-van-cac'];
  }
  if (clean.includes('003') || clean.includes('cot-co')) {
    return ARCHITECTURAL_HOTSPOTS['cot-co-ha-noi'];
  }
  if (clean.includes('004') || clean.includes('ngo-mon') || clean.includes('hue')) {
    return ARCHITECTURAL_HOTSPOTS['ngo-mon-hue'];
  }
  if (clean.includes('005') || clean.includes('nha-rong') || clean.includes('ben-nha-rong')) {
    return ARCHITECTURAL_HOTSPOTS['ben-nha-rong'];
  }
  if (clean.includes('006') || clean.includes('gac-lau') || clean.includes('lau-gac')) {
    return ARCHITECTURAL_HOTSPOTS['gac-lau-thang-long'];
  }

  // Mặc định trả về cấu kiện tiêu chuẩn
  return ARCHITECTURAL_HOTSPOTS['chua-mot-cot'];
}
