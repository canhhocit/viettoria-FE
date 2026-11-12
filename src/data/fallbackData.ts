import type { Collection, Product, StoryBlock, BlogPost, MediaItem } from '../types/index';

export const FALLBACK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    code: 'COL-THANG-LONG',
    name: 'Dấu Ấn Hoàng Thành Thăng Long',
    slug: 'dau-an-hoang-thanh-thang-long',
    description: 'Hành trình nghìn năm văn vật nơi kinh thành Thăng Long, hội tụ tinh hoa kiến trúc cung đình và triết lý Phật giáo Đại Việt.',
    heroImage: '/3D/cot-co-ha-noi-poster.webp',
    displayOrder: 1,
    status: 'published',
    productsCount: 4
  },
  {
    id: 'col-2',
    code: 'COL-HUE',
    name: 'Quần Thể Di Tích Cố Đô Huế',
    slug: 'quan-the-di-tich-co-do-hue',
    description: 'Kiệt tác kiến trúc cung đình triều Nguyễn, vẻ đẹp trầm mặc uy nghiêm bên bờ dòng sông Hương êm đềm.',
    heroImage: '/3D/ngo-mon-hue-poster.webp',
    displayOrder: 2,
    status: 'published',
    productsCount: 1
  },
  {
    id: 'col-3',
    code: 'COL-SAI-GON',
    name: 'Dấu Ấn Sài Gòn - Gia Định',
    slug: 'dau-an-sai-gon-gia-dinh',
    description: 'Nơi giao thoa phong cách kiến trúc Đông Dương, chứng nhân của những bước chân lịch sử vĩ đại của dân tộc.',
    heroImage: '/3D/ben-nha-rong-poster.webp',
    displayOrder: 3,
    status: 'published',
    productsCount: 1
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'VT-HN-001',
    name: 'Chùa Một Cột',
    subName: 'Liên Hoa Đài — Diên Hựu Tự',
    slug: 'chua-mot-cot',
    collectionId: 'col-1',
    epoch: 'Thời Lý (Năm 1049)',
    location: 'Ba Đình, Hà Nội',
    shortDescription: 'Đóa sen nghìn năm ngự giữa lòng hồ Linh Chiểu, đỉnh cao triết lý Phật giáo Đại Việt và kiến trúc truyền thống.',
    modelSpecs: {
      scale: '1:120',
      heightCm: 12,
      widthCm: 10,
      weightGrams: 185,
      material: 'Nhựa kỹ thuật sinh thái BioPETG (an toàn, bền vững 15+ năm)',
      partsCount: 24,
      finishing: 'Phủ bóng mờ sáp ong, gờ ngói cổ chạm nổi, giả lập chất gỗ lim già'
    },
    heroImage: '/3D/chua-mot-cot-poster.webp',
    model3dUrl: '/3D/chua-mot-cot.glb',
    galleryImages: [
      '/3D/chua-mot-cot-poster.webp'
    ],
    audioGuide: {
      title: 'Hào Khí Thăng Long & Giấc Mơ Đài Sen',
      duration: '00:22',
      audioUrl: '/audio/chua-mot-cot-vi.mp3',
      audioUrls: {
        vi: '/audio/chua-mot-cot-vi.mp3',
        en: '/audio/chua-mot-cot-en.wav',
        fr: '/audio/chua-mot-cot-fr.mp3',
        zh: '/audio/chua-mot-cot-zh.mp3',
        ko: '/audio/chua-mot-cot-ko.mp3',
        ja: '/audio/chua-mot-cot-ja.mp3',
      },
      narrator: 'Nghệ nhân thuyết minh Viettoria',
      transcript: 'Mùa đông năm 1049, kinh thành Thăng Long sương sớm bảng lảng. Vua Lý Thái Tông mộng thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua bước lên. Khi tỉnh giấc, triều thần bàn việc lập chùa Diên Hựu giữa lòng hồ Linh Chiểu với trụ đá vươn cao như đóa hoa sen thanh tịnh, cầu chúc cho xã tắc trường thọ thái bình nghìn thu.'
    },
    displayOrder: 1,
    status: 'published',
    isHeroRelease: true
  },
  {
    id: 'prod-2',
    code: 'VT-HN-002',
    name: 'Khuê Văn Các',
    subName: 'Gác Sao Khuê — Văn Miếu Quốc Tử Giám',
    slug: 'khue-van-cac',
    collectionId: 'col-1',
    epoch: 'Thời Nguyễn (Năm 1805)',
    location: 'Đống Đa, Hà Nội',
    shortDescription: 'Biểu tượng đỉnh cao của nền văn hiến và tinh thần hiếu học Thăng Long - Hà Nội với kết cấu Trời tròn Đất vuông độc đáo.',
    modelSpecs: {
      scale: '1:120',
      heightCm: 13,
      widthCm: 11,
      weightGrams: 210,
      material: 'Nhựa sinh thái BioPETG kết hợp chi tiết thếp vàng đồng',
      partsCount: 28,
      finishing: 'Sơn son thếp vàng thủ công viền cửa tròn sao Khuê, mái ngói giả cổ'
    },
    heroImage: '/3D/khue-van-cac-poster.webp',
    model3dUrl: '/3D/khue-van-cac.glb',
    galleryImages: [
      '/3D/khue-van-cac-poster.webp'
    ],
    audioGuide: {
      title: 'Sao Khuê Tỏa Sáng Đất Tràng An',
      duration: '00:18',
      audioUrl: '/audio/khue-van-cac-vi.mp3',
      audioUrls: {
        vi: '/audio/khue-van-cac-vi.mp3',
        en: '/audio/khue-van-cac-en.wav',
        fr: '/audio/khue-van-cac-fr.mp3',
        zh: '/audio/khue-van-cac-zh.mp3',
        ko: '/audio/khue-van-cac-ko.mp3',
        ja: '/audio/khue-van-cac-ja.mp3',
      },
      narrator: 'Thuyết minh Viettoria Atelier',
      transcript: 'Khuê Văn Các soi bóng xuống giếng Thiên Quang phẳng lặng như gương soi lòng kẻ sĩ. Công trình được Tổng trấn Nguyễn Văn Thành cho dựng năm 1805, tượng trưng cho nền học vấn thanh cao và truyền thống tôn sư trọng đạo của dân tộc.'
    },
    displayOrder: 2,
    status: 'published',
    isHeroRelease: false
  },
  {
    id: 'prod-3',
    code: 'VT-HN-003',
    name: 'Cột Cờ Hà Nội',
    subName: 'Kỳ Đài Thăng Long',
    slug: 'cot-co-ha-noi',
    collectionId: 'col-1',
    epoch: 'Thời Nguyễn (Năm 1812)',
    location: 'Hoàng Diệu, Hà Nội',
    shortDescription: 'Chứng nhân lịch sử kiên cường qua bao biến thiên, lá cờ đỏ sao vàng kiêu hãnh tung bay trên bầu trời Thủ đô.',
    modelSpecs: {
      scale: '1:150',
      heightCm: 16,
      widthCm: 12,
      weightGrams: 230,
      material: 'Nhựa sinh thái BioPETG vân gạch vồ Thăng Long',
      partsCount: 18,
      finishing: 'Màu gạch nung cổ kính, 39 lỗ hoa thị đón sáng tinh tế'
    },
    heroImage: '/3D/cot-co-ha-noi-poster.webp',
    model3dUrl: '/3D/cot-co-ha-noi.glb',
    galleryImages: [
      '/3D/cot-co-ha-noi-poster.webp'
    ],
    audioGuide: {
      title: 'Hào Khí Kỳ Đài Thăng Long',
      duration: '00:18',
      audioUrl: '/audio/cot-co-ha-noi-vi.mp3',
      audioUrls: {
        vi: '/audio/cot-co-ha-noi-vi.mp3',
        en: '/audio/cot-co-ha-noi-en.wav',
        fr: '/audio/cot-co-ha-noi-fr.mp3',
        zh: '/audio/cot-co-ha-noi-zh.mp3',
        ko: '/audio/cot-co-ha-noi-ko.mp3',
        ja: '/audio/cot-co-ha-noi-ja.mp3',
      },
      narrator: 'Thuyết minh Viettoria Atelier',
      transcript: 'Kỳ đài Hà Nội xây dựng năm 1812, là một trong số ít công trình còn nguyên vẹn trong khuôn viên Hoàng thành Thăng Long, ghi dấu thời khắc thiêng liêng ngày giải phóng Thủ đô 10/10/1954.'
    },
    displayOrder: 3,
    status: 'published',
    isHeroRelease: false
  },
  {
    id: 'prod-4',
    code: 'VT-HUE-004',
    name: 'Ngọ Môn Huế',
    subName: 'Cổng Chính Hoàng Thành Cố Đô',
    slug: 'ngo-mon-hue',
    collectionId: 'col-2',
    epoch: 'Thời Nguyễn (Năm 1833)',
    location: 'Thành phố Huế',
    shortDescription: 'Đỉnh cao nghệ thuật kiến trúc cung đình triều Nguyễn với Lầu Ngũ Phụng 100 cây cột lim tráng lệ.',
    modelSpecs: {
      scale: '1:200',
      heightCm: 11,
      widthCm: 18,
      weightGrams: 260,
      material: 'Nhựa sinh thái BioPETG phối hợp màu sơn truyền thống',
      partsCount: 32,
      finishing: 'Ngói hoàng lưu ly vàng rực rỡ và ngói thanh lưu ly xanh biếc'
    },
    heroImage: '/3D/ngo-mon-hue-poster.webp',
    model3dUrl: '/3D/ngo-mon-hue.glb',
    galleryImages: [
      '/3D/ngo-mon-hue-poster.webp'
    ],
    audioGuide: {
      title: 'Âm Sắc Cung Đình Bên Dòng Hương Giang',
      duration: '00:20',
      audioUrl: '/audio/ngo-mon-hue-vi.mp3',
      audioUrls: {
        vi: '/audio/ngo-mon-hue-vi.mp3',
        en: '/audio/ngo-mon-hue-en.wav',
        fr: '/audio/ngo-mon-hue-fr.mp3',
        zh: '/audio/ngo-mon-hue-zh.mp3',
        ko: '/audio/ngo-mon-hue-ko.mp3',
        ja: '/audio/ngo-mon-hue-ja.mp3',
      },
      narrator: 'Thuyết minh Cố Đô Viettoria',
      transcript: 'Ngọ Môn nhìn về hướng nam theo dịch lý, nơi hội tụ ánh sáng và quyền uy vương triều. Phía trên là Lầu Ngũ Phụng, nơi tổ chức các đại lễ truyền lô, ban sóc và là nơi chứng kiến sự kiện thoái vị năm 1945.'
    },
    displayOrder: 4,
    status: 'published',
    isHeroRelease: false
  },
  {
    id: 'prod-5',
    code: 'VT-SG-005',
    name: 'Bến Nhà Rồng',
    subName: 'Bảo Tàng Hồ Chí Minh — Cảng Sài Gòn',
    slug: 'ben-nha-rong',
    collectionId: 'col-3',
    epoch: 'Thời Cận Đại (Năm 1863)',
    location: 'Quận 4, TP. Hồ Chí Minh',
    shortDescription: 'Nơi người thanh niên Nguyễn Tất Thành bước chân ra đi tìm đường cứu nước năm 1911, biểu tượng lịch sử son sắt của phương Nam.',
    modelSpecs: {
      scale: '1:180',
      heightCm: 12,
      widthCm: 16,
      weightGrams: 220,
      material: 'Nhựa sinh thái BioPETG màu gạch cổ thuộc địa',
      partsCount: 22,
      finishing: 'Chi tiết đôi rồng gốm men xanh ngậm ngọc chầu trăng trên đỉnh mái'
    },
    heroImage: '/3D/ben-nha-rong-poster.webp',
    model3dUrl: '/3D/ben-nha-rong.glb',
    galleryImages: [
      '/3D/ben-nha-rong-poster.webp'
    ],
    audioGuide: {
      title: 'Khúc Tráng Ca Trên Bến Cảng Sài Gòn',
      duration: '00:17',
      audioUrl: '/audio/ben-nha-rong-vi.mp3',
      audioUrls: {
        vi: '/audio/ben-nha-rong-vi.mp3',
        en: '/audio/ben-nha-rong-en.wav',
        fr: '/audio/ben-nha-rong-fr.mp3',
        zh: '/audio/ben-nha-rong-zh.mp3',
        ko: '/audio/ben-nha-rong-ko.mp3',
        ja: '/audio/ben-nha-rong-ja.mp3',
      },
      narrator: 'Thuyết minh Viettoria Atelier',
      transcript: 'Ngày 5 tháng 6 năm 1911, con tàu Đô đốc Latouche-Tréville rời bến cảng Sài Gòn chở theo khát vọng độc lập tự do cháy bỏng của người thanh niên 21 tuổi Nguyễn Tất Thành.'
    },
    displayOrder: 5,
    status: 'published',
    isHeroRelease: false
  },
  {
    id: 'prod-6',
    code: 'VT-HN-006',
    name: 'Gác Lâu Thăng Long',
    subName: 'Kiến Trúc Cung Đình Thời Lê Sơ',
    slug: 'gac-lau-thang-long',
    collectionId: 'col-1',
    epoch: 'Thời Lê Sơ (Thế Kỷ XV)',
    location: 'Hoàng Thành Thăng Long · Hà Nội',
    shortDescription: 'Kiệt tác lầu gác Đại Việt phục dựng từ di vật đất nung khảo cổ Hoàng thành Thăng Long, mái đao chồng diêm vươn cao uy nghi chốn cung đình.',
    modelSpecs: {
      scale: '1:100',
      heightCm: 19.6,
      widthCm: 14.3,
      weightGrams: 310,
      material: 'Nhựa sinh thái BioPETG kết cấu mộng gỗ cung đình Đại Việt',
      partsCount: 32,
      finishing: 'Sơn son thếp vàng, ngói lưu ly phục dựng khảo cổ Thăng Long'
    },
    heroImage: '/images/hoang-thanh-thang-long.webp',
    model3dUrl: '/3D/lau_gac_web.glb',
    galleryImages: [
      '/images/hoang-thanh-thang-long.webp'
    ],
    audioGuide: {
      title: 'Âm Vang Lầu Gác Cung Điện Lê Sơ',
      duration: '00:30',
      audioUrl: '',
      audioUrls: {
        vi: '',
        en: '',
        fr: '',
        zh: '',
        ko: '',
        ja: '',
      },
      narrator: 'Thuyết minh Viettoria Atelier',
      transcript: 'Hoàng thành Thăng Long thời Lê Sơ thế kỷ 15 là thời kỳ hoàng kim của nền văn hiến và nghệ thuật kiến trúc Đại Việt. Mô hình gác lâu được nghiên cứu và phục dựng từ những mảnh gốm men, ngói rồng và cấu kiện đất nung khai quật tại Hoàng thành Thăng Long, tái hiện hệ vì kèo mộng gỗ phức hợp, mái đao chồng diêm thanh thoát vươn lên giữa tầng không, thể hiện trọn vẹn khí phách vương triều và bàn tay tài hoa của người thợ thủ công Thăng Long xưa.'
    },
    displayOrder: 6,
    status: 'published',
    isHeroRelease: false
  }
];

export const FALLBACK_STORY_BLOCKS: StoryBlock[] = [
  {
    id: 'block-1',
    productId: 'prod-1',
    type: 'text_image',
    title: 'Giấc Mộng Đài Sen Mùa Đông Kỷ Sửu (1049)',
    subtitle: 'Khởi nguồn vương triều Lý và ước vọng thái bình',
    content: 'Chùa Một Cột (Diên Hựu Tự) được khởi dựng vào mùa đông năm Kỷ Sửu (1049) dưới triều vua Lý Thái Tông. Theo Đại Việt Sử Ký Toàn Thư, vua chiêm bao thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua bước lên. Tỉnh mộng, triều thần bàn việc lập chùa với trụ đá vươn cao giữa hồ sen vuông vức Linh Chiểu, tựa như đóa sen tinh khiết ngàn năm tỏa hương ngự giữa lòng kinh thành Thăng Long.',
    mediaUrl: '/3D/chua-mot-cot-poster.webp',
    mediaCaption: 'Diên Hựu Tự soi bóng bên hồ Linh Chiểu, quận Ba Đình, Hà Nội.',
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'block-2',
    productId: 'prod-1',
    type: 'highlight',
    title: 'Kiến Trúc Độc Tôn: Một Cột Đá Nâng Đỡ Tòa Sen',
    subtitle: 'Đỉnh cao kết cấu kiến trúc gỗ và đá của người Việt cổ',
    content: 'Toàn bộ công trình Liên Hoa Đài tựa trên một cột đá hình trụ tròn đường kính 1.2 mét. Phía trên đầu cột đá là hệ thống 8 thanh consol gỗ lớn xòe ra như 8 cánh hoa sen nở rộ, nâng đỡ trọn vẹn gian thờ vuông vức mà không cần bất kỳ cột phụ trợ nào.',
    highlightBadge: 'Độc bản thế giới',
    displayOrder: 2,
    status: 'published'
  },
  {
    id: 'block-4',
    productId: 'prod-1',
    type: 'timeline',
    title: 'Biên Niên Sử Diên Hựu Tự Qua 10 Thế Kỷ',
    subtitle: 'Những cột mốc thăng trầm cùng vận mệnh non sông',
    content: 'Chùa Một Cột đã trải qua nhiều lần trùng tu và thử thách của lịch sử để trở thành biểu tượng bất tử của Thăng Long.',
    timelineItems: [
      { year: '1049', event: 'Khởi Dựng Chùa Diên Hựu', detail: 'Vua Lý Thái Tông cho dựng chùa sau giấc mộng thấy Phật Bà Quan Âm.' },
      { year: '1105', event: 'Vua Lý Nhân Tông Mở Rộng', detail: 'Đào thêm hồ Bích Trì xung quanh, xây cầu vồng chạm khắc cầu kỳ dẫn vào chùa.' },
      { year: '1249', event: 'Trùng Tu Thời Trần', detail: 'Vương triều Trần tiếp tục tôn tạo, duy trì lễ tắm Phật định kỳ hàng tháng.' },
      { year: '1805', event: 'Thời Nguyễn Trùng Tu', detail: 'Quy hoạch lại cảnh quan xung quanh cụm di tích Đội Cấn - Ba Đình.' },
      { year: '1954', event: 'Phục Dựng Nguyên Trạng', detail: 'Bộ Văn hóa và các nghệ nhân kiến trúc phục dựng chính xác chùa theo kiến trúc thời Lý sau khi thủ đô giải phóng.' },
      { year: '2026', event: 'Số Hóa & Phygital Viettoria', detail: 'Dự án VIETTORIA tái hiện mô hình in 3D kết hợp nền tảng số hóa tương tác đa giác quan.' }
    ],
    displayOrder: 3,
    status: 'published'
  },
  {
    id: 'block-5',
    productId: 'prod-1',
    type: 'text',
    title: 'Triết Lý Phật Giáo & Khát Vọng Trường Tồn Dân Tộc',
    subtitle: 'Đóa sen nở từ bùn đen tượng trưng cho sự thanh tịnh vô nhiễm',
    content: 'Trong văn hóa Phật giáo Đại Việt, hoa sen là biểu tượng của sự thuần khiết, vượt lên trên mọi cám dỗ và thăng trầm của cõi tục. Chùa Một Cột ngự giữa lòng hồ nước không chỉ là một công trình tín ngưỡng, mà là tuyên ngôn về bản sắc văn hóa tự chủ, dung dị nhưng thâm sâu của cha ông ta nghìn năm trước.',
    displayOrder: 4,
    status: 'published'
  }
];

export const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Kỹ nghệ mộng gỗ âm dương trong kiến trúc cổ Việt Nam và hành trình số hóa 3D',
    slug: 'ky-nghe-mong-go-am-duong-trong-kien-truc-co-viet-nam',
    excerpt: 'Tìm hiểu triết lý không dùng một giọt keo dán hay đinh vít sắt của người xưa, và cách Viettoria module hóa từng khớp mộng thành mô hình in 3D sinh thái.',
    content: 'Trong nền kiến trúc truyền thống Việt Nam, kỹ thuật liên kết rường cột hoàn toàn dựa trên các mộng gỗ âm dương. Các thợ mộc xưa đo đạc bằng thước tầm, đục đẽo từng thanh đòn consol để khi gài vào nhau sẽ tự khóa chặt dưới sức nặng của chính công trình. Viettoria đã ứng dụng công nghệ quét 3D và thuật toán phân tích dung sai 0.1mm để tái hiện trọn vẹn vẻ đẹp này trên mô hình in 3D BioPETG.',
    coverImage: '/3D/chua-mot-cot-poster.webp',
    author: 'Ban Nghiên Cứu Di Sản Viettoria',
    category: 'Kỹ Nghệ & Kiến Trúc',
    readTime: '5 phút đọc',
    publishedAt: '2026-10-25',
    status: 'published'
  },
  {
    id: 'blog-2',
    title: 'Diên Hựu Tự: Đóa sen nghìn năm từ giấc mộng vua Lý Thái Tông',
    slug: 'dien-huu-tu-doa-sen-nghin-nam-tu-giac-mong-vua-ly-thai-tong',
    excerpt: 'Giải mã những ẩn ngữ phong thủy, triết lý Trời tròn Đất vuông và bối cảnh lịch sử Thăng Long thời Lý thế kỷ 11.',
    content: 'Mùa đông năm Kỷ Sửu (1049), kinh thành Thăng Long đón nhận một công trình có một không hai trong lịch sử kiến trúc nhân loại. Chùa Một Cột không chỉ ghi dấu lòng sùng đạo của vua Lý Thái Tông mà còn biểu trưng cho lời chúc quốc thái dân an, đưa Đại Việt bước vào kỷ nguyên văn minh rực rỡ.',
    coverImage: '/3D/khue-van-cac-poster.webp',
    author: 'Nguyễn Văn Cảnh',
    category: 'Lịch Sử & Giai Thoại',
    readTime: '7 phút đọc',
    publishedAt: '2026-10-28',
    status: 'published'
  },
  {
    id: 'blog-3',
    title: 'Khi kiến trúc xưa được thu nhỏ trong một mô hình',
    slug: 'kien-truc-xua-duoc-thu-nho-trong-mot-mo-hinh',
    excerpt: 'Một mô hình nhỏ có thể mở ra cách nhìn gần gũi hơn về tỷ lệ, chi tiết và câu chuyện của công trình xưa.',
    content: 'Mô hình thu nhỏ giúp người xem quan sát hình khối và những chi tiết kiến trúc từ nhiều góc độ. Khi kết hợp với tư liệu lịch sử và trải nghiệm 3D trên web, mỗi công trình có thêm một cách kể chuyện gần gũi, để người xem tự do ngắm nhìn và tìm hiểu theo nhịp của mình.',
    coverImage: '/3D/cot-co-ha-noi-poster.webp',
    author: 'Viettoria',
    category: 'Câu chuyện chế tác',
    readTime: '4 phút đọc',
    publishedAt: '2026-11-01',
    status: 'published'
  }
];

export const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    name: 'Chùa Một Cột Chính Diện',
    fileName: 'chua-mot-cot-poster.webp',
    fileType: 'image/webp',
    fileSize: 299290,
    url: '/3D/chua-mot-cot-poster.webp',
    altText: 'Ảnh chụp chính diện Chùa Một Cột Ba Đình Hà Nội',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'media-2',
    name: 'Văn Miếu Quốc Tử Giám',
    fileName: 'khue-van-cac-poster.webp',
    fileType: 'image/webp',
    fileSize: 297804,
    url: '/3D/khue-van-cac-poster.webp',
    altText: 'Khuê Văn Các soi bóng xuống giếng Thiên Quang',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'media-3',
    name: 'Kỳ Đài Thăng Long',
    fileName: 'cot-co-ha-noi-poster.webp',
    fileType: 'image/webp',
    fileSize: 191866,
    url: '/3D/cot-co-ha-noi-poster.webp',
    altText: 'Cột Cờ Hà Nội trong khuôn viên di tích Hoàng thành',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'media-4',
    name: 'Mô hình Viettoria Atelier Thực Tế',
    fileName: 'IMG_6026.PNG',
    fileType: 'image/png',
    fileSize: 929956,
    url: '/viettoria_img/IMG_6026.PNG',
    altText: 'Ảnh chụp mẫu mô hình in 3D thực tế tại xưởng Viettoria',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'media-5',
    name: 'Quy cách Đóng gói & Thẻ Chứng Nhận',
    fileName: 'IMG_6370.PNG',
    fileType: 'image/png',
    fileSize: 744162,
    url: '/viettoria_img/IMG_6370.PNG',
    altText: 'Thẻ chứng nhận độc bản và bao bì đóng gói cao cấp',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'media-6',
    name: 'Chi tiết Cấu kiện Mộng Ngàm',
    fileName: 'IMG_6361.PNG',
    fileType: 'image/png',
    fileSize: 1734432,
    url: '/viettoria_img/IMG_6361.PNG',
    altText: 'Chi tiết cấu kiện mộng ngàm kiến trúc gỗ truyền thống',
    uploadedAt: new Date().toISOString()
  }
];
