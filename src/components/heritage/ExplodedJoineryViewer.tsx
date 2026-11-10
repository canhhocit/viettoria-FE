import React, { useState } from 'react';
import { Layers, Box, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { LanguageCode } from '../../locales';

interface ExplodedMonument {
  id: string;
  name: string;
  subtitle: string;
  epoch: string;
  diagramImage: string;
  model3dUrl: string;
  tiers: {
    letter: string;
    name: string;
    joineryType: string;
    technique: string;
    structuralRole: string;
    pinY: string; // approximate vertical % position on diagram
  }[];
}

const EXPLODED_MONUMENTS: ExplodedMonument[] = [
  {
    id: 'khue-van-cac',
    name: 'Khuê Văn Các (Văn Miếu)',
    subtitle: 'Gác Chuông Sao Khuê · Đỉnh Cao Mộng Gỗ Thời Nguyễn',
    epoch: 'Triều Nguyễn · Dựng năm 1805',
    diagramImage: '/viettoria_img/IMG_6369.PNG',
    model3dUrl: '/3D/khue-van-cac.glb',
    tiers: [
      {
        letter: 'C',
        name: 'Mái Chùa 2 Tầng Chồng Diêm',
        joineryType: 'Mộng then cài mui rùa & kẻ chuyền',
        technique: 'Hệ 8 mái với 8 đầu đao uốn cong thanh thoát lợp ngói ống cổ, xà gồ gỗ lim liên kết bằng mộng then kín khít.',
        structuralRole: 'Tạo độ nhẹ thanh thoát cho tầng trên, che chắn buồng gác sao Khuê trước gió bão Bắc Bộ.',
        pinY: '25%',
      },
      {
        letter: 'B',
        name: 'Thân Gác Lưới & Cửa Sổ Tròn',
        joineryType: 'Mộng đuôi én âm dương & ngàm then giằng',
        technique: 'Buồng gác vuông vắn với 4 cửa sổ tròn tượng trưng cho trời tỏa sáng (Khuê tinh tú chiếu), toàn bộ ván vách ăn mộng không dùng đinh.',
        structuralRole: 'Hấp thụ lực vặn xoắn khi có giông gió, phân bổ tải trọng xuống 4 cột đá bên dưới.',
        pinY: '50%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế Đá & 4 Trụ Cột Vuông',
        joineryType: 'Mộng chân tảng kê tự do & lỗ mộng ngậm',
        technique: '4 cột gạch đá vuông chạm khắc hoa văn câu đối chữ Hán nâng đỡ toàn bộ gác gỗ bên trên.',
        structuralRole: 'Cách ly gỗ khỏi độ ẩm của đất và giếng Thiên Quang, nền móng vững chắc qua hơn 220 năm.',
        pinY: '80%',
      },
    ],
  },
  {
    id: 'chua-mot-cot',
    name: 'Chùa Một Cột (Diên Hựu Tự)',
    subtitle: 'Đài Sen Nghìn Năm · Trụ Đá Độc Nhất Vô Nhị',
    epoch: 'Triều Lý · Khởi dựng 1049',
    diagramImage: '/viettoria_img/IMG_6372.PNG',
    model3dUrl: '/3D/chua-mot-cot.glb',
    tiers: [
      {
        letter: 'C',
        name: 'Mái Chùa Mũi Hài Đao Cong',
        joineryType: 'Mộng ngậm đầu đao & kìm nóc cúc dây',
        technique: 'Bốn đao cong vút như cánh hoa sen đang nở, bờ nóc đắp đôi rồng chầu mặt nguyệt thời Lý.',
        structuralRole: 'Tạo đối trọng cân bằng cho buồng chùa trên không trung.',
        pinY: '38%',
      },
      {
        letter: 'B',
        name: 'Gác Lớp & Hệ Giằng Gỗ Lim',
        joineryType: 'Kèo chống nách & mộng sập chịu lực',
        technique: 'Tám thanh gỗ lim lớn choãi ra từ thân cột đá vươn lên đỡ sàn chùa tạo hình bông sen khổng lồ nhô lên mặt nước.',
        structuralRole: 'Chuyển toàn bộ tải trọng buồng thờ tập trung vào một tâm cột duy nhất.',
        pinY: '54%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế & Cột Trụ Đá Nguyên Khối',
        joineryType: 'Khớp nối 2 thớt đá cối âm dương',
        technique: 'Cột đá đường kính 1.25m ghép từ 2 khối đá xanh khít khao cắm sâu xuống đáy hồ sen Linh Chiểu.',
        structuralRole: 'Trụ chống vĩnh cửu nâng đỡ toàn bộ công trình giữa mặt nước.',
        pinY: '78%',
      },
    ],
  },
  {
    id: 'ngo-mon-hue',
    name: 'Ngọ Môn (Hoàng Thành Huế)',
    subtitle: 'Lầu Ngũ Phụng · Cửa Chính Cung Điện Hoàng Gia',
    epoch: 'Triều Nguyễn · Minh Mạng 1833',
    diagramImage: '/viettoria_img/IMG_6368.PNG',
    model3dUrl: '/3D/ngo-mon-hue.glb',
    tiers: [
      {
        letter: 'D',
        name: 'Mái Chùa Kết Cấu Lầu Ngũ Phụng',
        joineryType: 'Ngói lưu ly âm dương & xà gồ then',
        technique: 'Chín bộ mái liên hoàn chia làm hai tầng, lợp ngói hoàng lưu ly (vua ngự) và thanh lưu ly (quan viên).',
        structuralRole: 'Mái nhẹ nhàng nhiều tầng thoát nước mưa miền Trung và cản gió bão.',
        pinY: '48%',
      },
      {
        letter: 'C',
        name: 'Gác Lớp & Khung Sườn 100 Cột',
        joineryType: 'Đấu củng cung đình & mộng ngậm xuyên tâm',
        technique: 'Hệ thống 100 cột gỗ lim sơn then đỏ thắm liên kết bằng xà ngang mộng thắt không có mối nối thừa.',
        structuralRole: 'Tạo khoảng không gian thông thoáng đón gió bốn phương làm nơi thiết triều đại lễ.',
        pinY: '60%',
      },
      {
        letter: 'B',
        name: 'Bệ Đế & Khung Sườn Sàn Gỗ',
        joineryType: 'Mộng giằng then cài sàn lầu',
        technique: 'Sàn gỗ lim bằng phẳng trải rộng theo hình chữ U bề thế ôm lấy sân trước.',
        structuralRole: 'Phân bổ trọng lực của lầu Ngũ Phụng xuống khối đế đá đồ sộ.',
        pinY: '68%',
      },
      {
        letter: 'A',
        name: 'Bệ Đế Đá Thanh & 5 Cửa Cổng',
        joineryType: 'Vòm cuốn đá gạch vồ Thang Long - Huế',
        technique: 'Xây bằng đá Thanh Hóa và gạch vồ, trổ 5 cửa cổng (Ngọ Môn ở giữa chỉ vua ngự, Tả Hữu Giáp Môn, Tả Hữu Dịch Môn).',
        structuralRole: 'Nền tảng pháo đài phòng thủ kiên cố qua hai thế kỷ.',
        pinY: '78%',
      },
    ],
  },
];

const EXPLODED_LOCALES: Record<string, Partial<Record<LanguageCode, {
  name: string;
  subtitle: string;
  epoch: string;
  tiers: Record<string, {
    name: string;
    joineryType: string;
    technique: string;
    structuralRole: string;
  }>;
}>>> = {
  'khue-van-cac': {
    en: {
      name: 'Khue Van Cac (Temple of Literature)',
      subtitle: 'Constellation Pavilion · Pinnacle of Nguyen Dynasty Timber Joinery',
      epoch: 'Nguyen Dynasty · Erected 1805',
      tiers: {
        'C': {
          name: 'Double-Eaved 2-Tier Temple Roof',
          joineryType: 'Tortoiseshell pin mortise & through-purlins',
          technique: '8-roof system with 8 gracefully curving eaves tiled in antique tubular terracotta, ironwood purlins seamlessly interlocked with mortise pins.',
          structuralRole: 'Imparts airy lightness to the upper chamber, sheltering the stellar pavilion from northern monsoons.',
        },
        'B': {
          name: 'Lattice Chamber & Sunburst Windows',
          joineryType: 'Yin-yang dovetail joints & interlocking tie-beams',
          technique: 'Square chamber with 4 circular windows symbolizing the radiant cosmos (Khue star shining), wall paneling entirely mortised without iron nails.',
          structuralRole: 'Absorbs torsional storm forces, evenly channeling gravity loads down to the 4 stone pillars below.',
        },
        'A': {
          name: 'Stone Plinth & 4 Square Columns',
          joineryType: 'Free-standing pedestal mortise & socketed plinths',
          technique: '4 square stone pillars inscribed with Chinese couplets firmly anchoring the elevated timber pavilion above.',
          structuralRole: 'Isolates timber from ground moisture and Thien Quang Well, standing steadfast for over 220 years.',
        },
      },
    },
    fr: {
      name: 'Pavillon Khuê Văn (Temple de la Littérature)',
      subtitle: 'Pavillon de la Constellation · Apogée de la Charpenterie Nguyễn',
      epoch: 'Dynastie des Nguyễn · Érigé en 1805',
      tiers: {
        'C': {
          name: 'Toiture Double à Combles Superposés',
          joineryType: 'Assemblage en carapace de tortue & pannes traversantes',
          technique: 'Ensemble de 8 pans de toiture aux 8 arêtiers recourbés, pannes en bois de fer emboîtées par chevilles invisibles.',
          structuralRole: 'Confère légèreté à l\'étage supérieur, protégeant le pavillon des typhons du Nord.',
        },
        'B': {
          name: 'Chambre à Claustras & Fenêtres Circulaires',
          joineryType: 'Queues d\'aronde yin-yang & traverses d\'entretoisement',
          technique: 'Chambre carrée percée de 4 fenêtres rondes symbolisant le rayonnement céleste, parois assemblées sans aucun clou métallique.',
          structuralRole: 'Dissipe les torsions sous les rafales de vent et reporte les charges sur les 4 piliers de pierre.',
        },
        'A': {
          name: 'Soubassement & 4 Colonnes Carrées en Pierre',
          joineryType: 'Emboîtement sur dés de pierre & mortaises libres',
          technique: '4 colonnes de pierre ornées de sentences parallèles soutenant l\'ensemble de la structure en bois.',
          structuralRole: 'Isole le bois de l\'humidité du sol et du puits Thiên Quang, préservant l\'édifice depuis plus de 220 ans.',
        },
      },
    },
    zh: {
      name: '奎文阁（文庙 - 国子监）',
      subtitle: '奎星高照 · 阮朝大木作榫卯绝艺巅峰',
      epoch: '阮朝 · 嘉隆四年（1805）',
      tiers: {
        'C': {
          name: '双层重檐攒尖顶',
          joineryType: '龟背穿销榫与穿梁排架',
          technique: '八角重檐、八道飞檐翘角飘逸舒展，上铺古法筒瓦，格木檩条以密实暗榫紧扣。',
          structuralRole: '赋予上层轻盈飘逸之美，庇护奎星主室抵御北方季风暴雨侵袭。',
        },
        'B': {
          name: '棂格阁身与四象圆窗',
          joineryType: '阴阳燕尾榫与抱头梁抱扣',
          technique: '方正木阁四面辟圆窗象征天圆地方、奎星文光普照，全壁板材咬合自锁，滴铁不用。',
          structuralRole: '有效化解暴风扭力，将上部荷载均衡传导至下方四根巨型石柱。',
        },
        'A': {
          name: '石构基座与四根方柱',
          joineryType: '平柱覆盆石础与卡卯基座',
          technique: '四根四方形高大青石柱刻镌汉字对联，巍峨托起上层全木结构楼阁。',
          structuralRole: '隔绝地表湿气与天光井水汽侵蚀，奠定历经两百二十余年稳固基础。',
        },
      },
    },
    ko: {
      name: '규문각 (문묘)',
      epoch: '응우옌 왕조 · 1805년 건립',
      subtitle: '규성각 · 응우옌 왕조 전통 목조 결구의 정수',
      tiers: {
        'C': {
          name: '2층 중첩 지붕',
          joineryType: '거북등 쐐기장부 및 가로보 결구',
          technique: '고대 원통형 기와를 얹은 8개 처마선이 날렵하게 휘어져 올라가며, 림목 도리가 숨은 쐐기장부로 빈틈없이 결합됨.',
          structuralRole: '상층부에 경쾌한 미감을 부여하며 북부의 폭풍우로부터 규성각 내부를 보호함.',
        },
        'B': {
          name: '격자 목실 및 원형 창',
          joineryType: '음양 연미장부 및 멍에 결합',
          technique: '하늘의 빛남(규성조요)을 상징하는 4개의 둥근 창을 낸 사각 누각으로, 전 벽판이 못 없이 순수 짜맞춤으로 고정됨.',
          structuralRole: '비바람의 비틀림 외력을 흡수하여 하부 4개 석주로 하중을 균등하게 분산시킴.',
        },
        'A': {
          name: '석조 기단 및 4대 각기둥',
          joineryType: '초석 안착 결구 및 홈 맞춤',
          technique: '한자 대련이 음각된 4개의 사각 화강석 기둥이 상부 목조 누각 전체를 견고하게 떠받침.',
          structuralRole: '지면 습기와 천광정 호수 수분으로부터 목재를 격리하여 220년 이상 영구 보존의 기반 마련.',
        },
      },
    },
    ja: {
      name: '奎文閣（文廟）',
      epoch: '阮朝 · 1805年建立',
      subtitle: '奎星の鐘楼 · 阮朝木組み建築の最高峰',
      tiers: {
        'C': {
          name: '二重軒重檐屋根',
          joineryType: '亀甲栓ほぞ＆貫通梁仕口',
          technique: '8つの反り屋根が優美な曲線を描き、伝統筒瓦を葺き、鉄木母屋桁を精緻な隠しほぞで緊結。',
          structuralRole: '上層部に軽快な美を与え、北部の風雨から奎星の閣室を保護。',
        },
        'B': {
          name: '格子木室と四方の円窓',
          joineryType: '陰陽蟻継ぎ＆貫梁仕口',
          technique: '天の輝きを象徴する4つの丸窓を配した正方形の閣室。全板壁が釘を一切使わずに噛み合います。',
          structuralRole: '暴風時のねじれ外力を吸収し、下部の4本の大石柱へ荷重を均等に伝達。',
        },
        'A': {
          name: '石造基壇と4本の角柱',
          joineryType: '礎石載せ式＆ほぞ穴接合',
          technique: '漢詩対聯が刻まれた4本の角型青石柱が、上部の全木造楼閣を堅牢に支えます。',
          structuralRole: '地面の湿気と天光井の水分から木材を隔離し、220年を超える恒久性を担保。',
        },
      },
    },
  },
  'chua-mot-cot': {
    en: {
      name: 'One Pillar Pagoda (Dien Huu)',
      subtitle: 'Millennium Lotus Shrine · Unprecedented Monolithic Stone Column',
      epoch: 'Ly Dynasty · Founded 1049',
      tiers: {
        'C': {
          name: 'Curved Lotus Eaves Roof',
          joineryType: 'Eave-head mortise & chrysanthemum ridge-cap',
          technique: 'Four soaring curved eaves resembling an unfurling lotus blossom, crowned with pair of Ly Dynasty dragons greeting the moon.',
          structuralRole: 'Provides equilibrium counterbalance for the elevated wooden temple suspended in mid-air.',
        },
        'B': {
          name: 'Supporting Brackets & Timber Struts',
          joineryType: 'Cantilever tie-struts & interlocking corbel brackets',
          technique: 'Eight massive ironwood struts splaying out from the central stone pillar to support temple floor, forming a giant blooming lotus.',
          structuralRole: 'Channels the entire mass of the temple hall down into a single centralized vertical axis.',
        },
        'A': {
          name: 'Plinth & Monolithic Stone Pillar',
          joineryType: 'Twin cylindrical stone mortar joint',
          technique: '1.25m diameter stone column assembled from 2 tightly interlocking bluestone blocks rooted deep beneath Linh Chieu lotus pond.',
          structuralRole: 'Serves as an eternal aquatic pillar elevating the sacred sanctuary above water.',
        },
      },
    },
    fr: {
      name: 'Pagode au Pilier Unique (Diên Hựu)',
      subtitle: 'Sanctuaire du Lotus Millénaire · Pilier Monolithique Inégalé',
      epoch: 'Dynastie des Lý · Érigée en 1049',
      tiers: {
        'C': {
          name: 'Toit Recourbé en Pétales de Lotus',
          joineryType: 'Assemblage d\'arêtier & faîtage aux dragons',
          technique: 'Quatre arêtiers élancés évoquant un lotus en fleur, couronnés de deux dragons Lý saluant la lune.',
          structuralRole: 'Garantit l\'équilibre parfait de la cellule sacrée suspendue dans les airs.',
        },
        'B': {
          name: 'Aisseliers & Charpente en Bois de Fer',
          joineryType: 'Bras de force rayonnants & consoles à tenon',
          technique: 'Huit puissantes poutres obliques jaillissant du pilier de pierre pour porter le plancher, figurant les pétales d\'un lotus aquatique.',
          structuralRole: 'Concentrent l\'intégralité des charges sur le centre du pilier unique.',
        },
        'A': {
          name: 'Socle & Pilier Monolithique en Pierre',
          joineryType: 'Emboîtement tenon-mortaise cylindrique',
          technique: 'Colonne de pierre de 1,25 m de diamètre composée de 2 blocs de pierre bleue ancrés au fond du bassin Linh Chiểu.',
          structuralRole: 'Colonne éternelle maintenant le sanctuaire hors de l\'eau depuis près d\'un millénaire.',
        },
      },
    },
    zh: {
      name: '一柱寺（延佑寺）',
      subtitle: '千载独木莲台 · 举世无双单石柱营造奇迹',
      epoch: '李朝 · 始建于1049年',
      tiers: {
        'C': {
          name: '四角翘曲飞檐莲瓣顶',
          joineryType: '翘角插榫与卷草正脊',
          technique: '四角飞檐凌空展翼宛如盛开青莲，屋脊饰双龙戏珠大越李朝典型纹样。',
          structuralRole: '为空中悬挑佛殿构筑四方受力平衡对重。',
        },
        'B': {
          name: '斜撑悬挑与格木梁架',
          joineryType: '悬挑斜撑木与暗榫斗拱',
          technique: '八根粗壮格木大梁自石柱身部八方斜展，托起殿底木台，构成水中莲瓣怒放之姿。',
          structuralRole: '将悬空木殿之全部恒载与活载极致汇聚于中央单一石轴。',
        },
        'A': {
          name: '石底座与巨型圆柱石台',
          joineryType: '阴阳双石臼咬合榫',
          technique: '直径达1.25米之巨型石柱由两整块清化青石精密嵌套，深植于灵沼莲池底基。',
          structuralRole: '永恒立于水中的承重中流砥柱。',
        },
      },
    },
    ko: {
      name: '일주사 (못꼿 사원)',
      epoch: '리 왕조 · 1049년 창건',
      subtitle: '천년의 연꽃 대좌 · 유일무이한 단일 석주 건축',
      tiers: {
        'C': {
          name: '연꽃 날개형 곡선 지붕',
          joineryType: '추녀마루 결구 및 용마루 장식',
          technique: '피어나는 연꽃잎처럼 날렵하게 치솟은 4면 처마, 리 왕조 양식의 쌍룡 조각.',
          structuralRole: '허공에 떠 있는 사당 본전의 무게 균형을 정밀하게 잡아줌.',
        },
        'B': {
          name: '외팔보 경사 지지대 및 림목 가새',
          joineryType: '방사형 지지보 및 장부 맞춤',
          technique: '중앙 석주로부터 8방향으로 뻗어 나온 대형 림목 보가 누각 바닥을 받쳐 거대한 연꽃 형상을 이룸.',
          structuralRole: '공중 사당의 전체 하중을 단 하나의 석주 중심점으로 완벽히 유도.',
        },
        'A': {
          name: '기단 및 원형 단일 석주',
          joineryType: '상하 2단 음양 맞춤 석재 결구',
          technique: '직경 1.25m의 거대한 청석 2개를 정밀 맞물려 영조지 연못 바닥에 깊이 고정.',
          structuralRole: '물 위에 우뚝 솟아 천년을 지탱하는 영구적 지주.',
        },
      },
    },
    ja: {
      name: '一柱寺（延祐寺）',
      epoch: '李朝 · 1049年創建',
      subtitle: '千年の蓮華台 · 空前絶後の単一石柱構造',
      tiers: {
        'C': {
          name: '蓮華反り屋根',
          joineryType: '隅木ほぞ＆李朝龍紋大棟',
          technique: '花開く蓮の花弁のように跳ね上がる4つの反り屋根。大棟には李朝特有の双龍拝月を配置。',
          structuralRole: '空中に浮遊する堂宇の絶妙な荷重バランスを保持。',
        },
        'B': {
          name: '方杖・片持ち梁構造',
          joineryType: '斜材ブラケット＆耐震ほぞ組み',
          technique: '中心の石柱から放射状に広がる8本の巨木梁が堂の床を支え、水面に咲く巨蓮を造形。',
          structuralRole: '空中堂宇の全荷重を中心の単一石柱へ完璧に集中・伝達。',
        },
        'A': {
          name: '基盤と単一円柱石軸',
          joineryType: '上下2段陰陽石材継手',
          technique: '直径1.25mの2つの巨大青石を狂いなく組み合わせ、霊沼池の底深くに定着。',
          structuralRole: '水面中央にそびえ立ち、千年の風雪を耐え抜く不朽の支柱。',
        },
      },
    },
  },
  'ngo-mon-hue': {
    en: {
      name: 'Noon Gate (Hue Citadel)',
      subtitle: 'Five-Phoenix Pavilion · Principal Royal Palace Portal',
      epoch: 'Nguyen Dynasty · Minh Mang 1833',
      tiers: {
        'D': {
          name: 'Five-Phoenix Multi-Tier Roofs',
          joineryType: 'Yin-yang imperial tiles & interlocking purlins',
          technique: 'Nine interlocking roof sections arranged across two tiers, adorned with yellow glazed tiles (imperial) and cyan tiles (mandarins).',
          structuralRole: 'Lightweight multi-tiered roofs shed torrential central rains and buffer typhoon winds.',
        },
        'C': {
          name: 'Upper Pavilion & 100-Column Colonnade',
          joineryType: 'Imperial dougong brackets & through-tenons',
          technique: 'Colonnade of 100 vermilion-lacquered ironwood pillars tied with mortised tie-beams without excess connections.',
          structuralRole: 'Creates an expansive open-air pavilion to welcome breezes for grand royal coronation ceremonies.',
        },
        'B': {
          name: 'Timber Floor Deck & Joist System',
          joineryType: 'Mortise-locked deck joists',
          technique: 'Smooth ironwood flooring spreading in an imposing U-shape embracing the courtyard below.',
          structuralRole: 'Evenly distributes the immense gravitational load of Five-Phoenix Pavilion down onto the stone foundation.',
        },
        'A': {
          name: 'Granite Substructure & 5 Arched Portals',
          joineryType: 'Ancient masonry barrel vaults',
          technique: 'Erected from Thanh Hoa granite and brick, opening into 5 portals (central Noon Gate reserved for the Emperor).',
          structuralRole: 'Impregnable fortress foundation enduring across two centuries of history.',
        },
      },
    },
    fr: {
      name: 'Porte du Midi (Ngọ Môn)',
      subtitle: 'Pavillon des Cinq Phénix · Porte d\'Apparat Royale',
      epoch: 'Dynastie des Nguyễn · Minh Mạng 1833',
      tiers: {
        'D': {
          name: 'Toitures du Pavillon des Cinq Phénix',
          joineryType: 'Tuiles vernissées impériales & pannes assemblées',
          technique: 'Neuf toitures communicantes sur deux niveaux, parées de tuiles jaunes (empereur) et turquoises (mandarins).',
          structuralRole: 'Évacuent rapidement les moussons du Centre tout en brisant les rafales de vent.',
        },
        'C': {
          name: 'Étage & Colonnade des 100 Piliers',
          joineryType: 'Consoles royales & mortaises traversantes',
          technique: '100 colonnes en bois de fer laquées de pourpre impérial, entretoisées sans aucun clou parasite.',
          structuralRole: 'Offre une vaste tribune ouverte sur quatre horizons pour les proclamations royales.',
        },
        'B': {
          name: 'Plancher & Solivage en Bois de Fer',
          joineryType: 'Assemblage à tenons des solives',
          technique: 'Plancher de bois noble déployé en U monumental ceinturant la cour d\'honneur.',
          structuralRole: 'Répartit uniformément le poids des toitures sur l\'imposant massif de pierre.',
        },
        'A': {
          name: 'Massif en Pierre & 5 Portes Voûtées',
          joineryType: 'Voûtes maçonnées traditionnelles',
          technique: 'Construit en granit de Thanh Hóa et briques d\'époque, percé de 5 passages voûtés.',
          structuralRole: 'Socle de forteresse inébranlable depuis deux siècles.',
        },
      },
    },
    zh: {
      name: '顺化午门（顺化皇城）',
      subtitle: '五凤楼 · 阮朝皇家宫殿正大之门',
      epoch: '阮朝 · 明命十四年（1833）',
      tiers: {
        'D': {
          name: '五凤楼多重连环九脊顶',
          joineryType: '阴阳琉璃瓦与斗口榫檩条',
          technique: '九组大殿连环重檐屋顶，分铺金黄色黄琉璃瓦（帝王御用）与碧色青琉璃瓦（王公百官）。',
          structuralRole: '多重出檐轻盈导泄中部暴雨，化解台风强风荷载。',
        },
        'C': {
          name: '上层楼阁与百柱金柱大构架',
          joineryType: '宫廷斗拱与贯穿抱头梁',
          technique: '一百根朱漆大红铁木金柱巍然排布，横纵大梁紧扣贯通，无任何多余杂卯。',
          structuralRole: '营造四面受风、通透庄严的大型开阔空间，用作册封与大朝盛典。',
        },
        'B': {
          name: '凹字形格木回廊楼板骨架',
          joineryType: '穿带企口平接暗榫',
          technique: '平整厚实之格木地板沿U形平面环抱前廷，形成壮阔朝仪空间。',
          structuralRole: '将五凤楼庞大木构重力均匀漫铺至下部厚重石砌台基。',
        },
        'A': {
          name: '清化青石基台与五座拱门',
          joineryType: '青石发券与古砖拱券',
          technique: '清化坚固花岗岩与青砖叠砌，开五道拱门（中为午门御道专奉皇帝，左右为夹门与驿门）。',
          structuralRole: '历经两百载烽烟的坚不可摧堡垒根基。',
        },
      },
    },
    ko: {
      name: '오문 (후에 황성 정문)',
      epoch: '응우옌 왕조 · 민망 1833',
      subtitle: '오봉루 · 황실 궁전의 웅장한 정문',
      tiers: {
        'D': {
          name: '오봉루 9개 연환 지붕',
          joineryType: '음양 유리기와 및 도리 결합',
          technique: '2단으로 나뉜 9개 지붕군으로, 황제 전용 황색 유리기와와 관료용 청색 유리기와를 조화롭게 얹음.',
          structuralRole: '중부 지방의 집중 호우를 신속히 배출하고 태풍을 분산시키는 유연한 구조.',
        },
        'C': {
          name: '상층 누각 및 100개 림목 기둥열',
          joineryType: '궁중 공포 및 관통 장부',
          technique: '붉은 옻칠을 한 100개의 림목 기둥이 가로보와 결구되어 불필요한 이음매 없이 연결됨.',
          structuralRole: '사방의 바람을 맞이하는 개방형 공간을 조성하여 황실 대례 거행.',
        },
        'B': {
          name: 'U자형 림목 바닥 프레임',
          joineryType: '장부 빗장이음 바닥 장선',
          technique: '전면 마당을 감싸 안는 장엄한 U자형 평면을 따라 펼쳐진 평평한 림목 바닥.',
          structuralRole: '오봉루 전체의 거대한 중력을 석조 기단으로 고르게 분산.',
        },
        'A': {
          name: '화강암 기단 및 5대 홍예문',
          joineryType: '석조 및 전돌 홍예 아치',
          technique: '타인호아 화강석과 전돌로 축조되었으며 5개의 홍예문을 냄 (중앙문은 황제 전용).',
          structuralRole: '2세기를 지켜온 난공불락의 요새형 방어 기초.',
        },
      },
    },
    ja: {
      name: '午門（順化・フエ王宮）',
      epoch: '阮朝 · 明命1833年',
      subtitle: '五鳳楼 · 皇宮の壮麗なる正門',
      tiers: {
        'D': {
          name: '五鳳楼の九連複合屋根',
          joineryType: '陰陽瑠璃瓦＆ほぞ組み母屋',
          technique: '2層に連なる9つの複合屋根。皇帝専用の黄瑠璃瓦と官僚用の青瑠璃瓦を葺き分け。',
          structuralRole: '中部特有の豪雨を効率的に排水し、台風の強風を受け流す重層構造。',
        },
        'C': {
          name: '上層閣室と百本円柱大列柱',
          joineryType: '宮廷組物＆貫通長ほぞ',
          technique: '真紅の漆塗りを施した100本の鉄木大柱が、無駄のない貫梁で緊密に結合。',
          structuralRole: '四方に吹き抜ける開放的な空間を形成し、国家の大典・朝議の場を提供。',
        },
        'B': {
          name: 'U字型鉄木床板フレーム',
          joineryType: '実組み・栓留め床根太',
          technique: '前庭を抱きかかえるようにU字型に広がる重厚な鉄木製フロア。',
          structuralRole: '五鳳楼の巨大な自重を均等に下部石造基壇へ分散。',
        },
        'A': {
          name: '花崗岩城台と5つのアーチ門',
          joineryType: '石造アーチ組積造',
          technique: 'タインホア産花崗岩と煉瓦で築かれ、5つのアーチ門を開削（中央は皇帝専用）。',
          structuralRole: '2世紀の動乱を耐え抜いた不抜の要塞基礎。',
        },
      },
    },
  },
};

export const ExplodedJoineryViewer: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('khue-van-cac');
  const [activeTierIndex, setActiveTierIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'diagram' | '3d'>('diagram');

  const rawMonument =
    EXPLODED_MONUMENTS.find((m) => m.id === selectedMonumentId) || EXPLODED_MONUMENTS[0];
  const monLoc = EXPLODED_LOCALES[rawMonument.id]?.[language];

  const currentMonument: ExplodedMonument = {
    ...rawMonument,
    name: monLoc?.name || rawMonument.name,
    subtitle: monLoc?.subtitle || rawMonument.subtitle,
    epoch: monLoc?.epoch || rawMonument.epoch,
    tiers: rawMonument.tiers.map((tier) => {
      const tierLoc = monLoc?.tiers?.[tier.letter];
      return {
        ...tier,
        name: tierLoc?.name || tier.name,
        joineryType: tierLoc?.joineryType || tier.joineryType,
        technique: tierLoc?.technique || tier.technique,
        structuralRole: tierLoc?.structuralRole || tier.structuralRole,
      };
    }),
  };

  const activeTier = currentMonument.tiers[activeTierIndex] || currentMonument.tiers[0];

  return (
    <section className="heritage-joinery-section border-b border-paper-border bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brass">
              <Layers size={16} />
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brass">
                {t('joinery.eyebrow', 'Bí Thuật Kiến Trúc Gỗ Việt · Không Dùng Đinh')}
              </p>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
              {t('joinery.heading', 'Bóc Tách Cấu Kiện Mộng Khớp Âm Dương')}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
              {t('joinery.desc', 'Khám phá bản vẽ bóc tách kỹ thuật 3D chân thực: từng tầng mái, buồng gác và cột tảng đá được phân rã theo trục thẳng đứng, giải mã vì sao di sản gỗ Việt đứng vững nghìn năm trước bão giông.')}
            </p>
          </div>

          {/* Top Actions: Monument Selector & Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Monument Selector Tabs */}
            <nav className="flex flex-wrap items-center gap-2" aria-label={t('joinery.selectMonument', 'Chọn công trình bóc tách')}>
              {EXPLODED_MONUMENTS.map((monument) => (
                <button
                  key={monument.id}
                  type="button"
                  onClick={() => {
                    setSelectedMonumentId(monument.id);
                    setActiveTierIndex(0);
                  }}
                  className={`border px-3 py-2 text-xs font-sans transition-all rounded-[2px] ${
                    selectedMonumentId === monument.id
                      ? 'border-forest bg-forest text-brass font-bold shadow-xs'
                      : 'border-paper-border bg-paper text-forest hover:border-brass hover:bg-paper-warm font-medium'
                  }`}
                >
                  <span>{monument.name.split(' (')[0]}</span>
                </button>
              ))}
            </nav>

            {/* View Mode Toggle: Exploded Diagram vs Interactive 3D */}
            <div className="inline-flex items-center border border-brass/50 bg-paper p-0.5 rounded-[2px]">
              <button
                type="button"
                onClick={() => setViewMode('diagram')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  viewMode === 'diagram' ? 'bg-forest text-brass font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Layers size={12} />
                <span>{t('joinery.blueprintMode', 'Bản Vẽ Bóc Tách')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 text-xs font-sans font-medium flex items-center gap-1 transition-colors rounded-[1px] ${
                  viewMode === '3d' ? 'bg-brass text-forest font-bold' : 'text-charcoal hover:text-forest'
                }`}
              >
                <Box size={12} />
                <span>{t('joinery.rotate3dMode', 'Xoay 3D Thực Tế')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Master Joinery Interactive Stage */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
          {/* Left: Exploded Stage Visualizer */}
          <div className="corner-frame border-2 border-brass/50 bg-paper-card p-4 sm:p-6 shadow-xl relative flex flex-col justify-between overflow-hidden">
            {/* Atelier Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#B88A38_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Mode 1: Authentic Exploded Blueprint Diagram */}
            {viewMode === 'diagram' ? (
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-[#1B1814] border border-brass/40 shadow-inner flex items-center justify-center p-2 sm:p-4 rounded-[1px]">
                <img
                  src={currentMonument.diagramImage}
                  alt={`${t('joinery.blueprintMode', 'Bản vẽ bóc tách cấu kiện')} ${currentMonument.name}`}
                  className="h-full w-full object-contain"
                />

                {/* Target Beacon Overlay for Active Tier */}
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-brass bg-forest/90 px-3 py-1.5 text-xs text-brass shadow-2xl backdrop-blur-sm transition-all duration-300 rounded-[2px]"
                  style={{ top: activeTier.pinY }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-brass text-forest text-[11px] font-bold rounded-full">
                    {activeTier.letter}
                  </span>
                  <span className="font-sans font-bold text-paper text-xs">
                    {activeTier.name}
                  </span>
                </div>
              </div>
            ) : (
              /* Mode 2: Live Interactive 3D Model Viewer */
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-paper border border-brass/40 shadow-inner rounded-[1px]">
                <model-viewer
                  src={currentMonument.model3dUrl}
                  alt={`3D: ${currentMonument.name}`}
                  camera-controls
                  auto-rotate
                  rotation-per-second="10deg"
                  shadow-intensity="1.2"
                  exposure="1.05"
                  loading="eager"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  className="h-full w-full"
                />
                <div className="pointer-events-none absolute left-3 top-3 border border-brass/40 bg-forest/90 px-2.5 py-1 text-[11px] font-sans text-brass font-semibold uppercase tracking-wider rounded-[1px]">
                  {t('joinery.realtime3dBadge', 'MÔ HÌNH 3D THỜI GIAN THỰC · KÉO ĐỂ XOAY')}
                </div>
              </div>
            )}

            {/* Tiers Navigation Selector Pills */}
            <div className="mt-4 border-t border-paper-border pt-4">
              <span className="font-sans text-[11px] uppercase font-bold text-charcoal-muted block mb-2 tracking-wider">
                {t('joinery.selectTier', 'Chọn Cấu Kiện Khảo Cứu:')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentMonument.tiers.map((tier, idx) => (
                  <button
                    key={tier.letter}
                    type="button"
                    onClick={() => setActiveTierIndex(idx)}
                    className={`p-2 text-left text-xs rounded-[2px] border transition-all ${
                      activeTierIndex === idx
                        ? 'border-forest bg-forest text-paper font-semibold shadow-xs'
                        : 'border-paper-border bg-paper hover:border-brass text-forest'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-brass font-bold block">
                      {t('joinery.tierPrefix', 'Tầng')} [{tier.letter}]
                    </span>
                    <span className="truncate block font-medium mt-0.5">{tier.name.split(' (')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Joinery Dossier Card */}
          <div className="corner-frame border-2 border-brass/50 bg-paper p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-paper-border pb-3">
                <Info size={16} className="text-brass" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brass">
                  {t('joinery.dossierHeader', 'Khảo Cứu Cấu Kiện')} · {t('joinery.tierPrefix', 'Tầng')} [{activeTier.letter}]
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl font-bold text-forest">
                {activeTier.name}
              </h3>
              <p className="mt-1 font-serif text-sm italic text-brass-dark">
                {currentMonument.subtitle}
              </p>

              <div className="mt-5 space-y-4">
                <div className="border border-paper-border bg-paper-warm p-3.5 rounded-[2px]">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-brass block">
                    {t('joinery.joineryMethod', 'Phương Thức Khớp Mộng Cổ Truyền')}
                  </span>
                  <p className="font-sans text-sm font-semibold text-forest mt-0.5">
                    {activeTier.joineryType}
                  </p>
                </div>

                <div>
                  <span className="font-sans text-xs font-bold text-forest uppercase tracking-wider block">
                    {t('joinery.techniqueLabel', 'Kỹ Thuật Ghép Nối Không Dùng Đinh:')}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                    {activeTier.technique}
                  </p>
                </div>

                <div className="border-t border-paper-border pt-3">
                  <span className="font-sans text-xs font-bold text-forest uppercase tracking-wider block">
                    {t('joinery.structuralRoleLabel', 'Công Năng Chịu Lực & Địa Chấn:')}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-charcoal/85 leading-relaxed font-normal">
                    {activeTier.structuralRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Atelier Heritage Guarantee Note */}
            <div className="mt-6 border-t border-paper-border pt-4 bg-paper-warm/60 p-3 rounded-[2px] border border-paper-border">
              <div className="flex items-center gap-2 text-xs text-forest font-semibold">
                <CheckCircle2 size={14} className="text-brass" />
                <span>{t('joinery.guaranteeTitle', 'Bảo chứng tỷ lệ khảo cổ 1:120 của Viettoria Atelier')}</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mt-1 font-normal">
                {t('joinery.guaranteeDesc', 'Mỗi cấu kiện được scan 3D bề mặt vi mô và đối chiếu với hồ sơ trùng tu của Viện Bảo tồn Di tích Quốc gia.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
