import type { Collection, Product, StoryBlock, BlogPost } from '../types';
import type { ArchitecturalHotspot } from '../data/architecturalHotspots';
import type { LanguageCode } from '../locales';

interface LocalizedCollectionFields {
  name: string;
  description: string;
}

interface LocalizedProductFields {
  name: string;
  subName: string;
  shortDescription: string;
  location: string;
  epoch: string;
  material?: string;
  finishing?: string;
  audioGuideTitle?: string;
  audioGuideNarrator?: string;
  audioGuideDuration?: string;
  audioGuideTranscript?: string;
}

interface LocalizedBlogFields {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  author?: string;
}

interface LocalizedStoryBlockFields {
  title?: string;
  subtitle?: string;
  content?: string;
  mediaCaption?: string;
  highlightBadge?: string;
  timelineItems?: Array<{ year: string; event: string; detail: string }>;
}

interface LocalizedHotspotFields {
  title: string;
  shortTitle?: string;
  category: string;
  detail: string;
  shortDesc?: string;
}

// -------------------------------------------------------------
// 1. COLLECTIONS TRANSLATION DICTIONARY (EN, FR, ZH, KO, JA)
// -------------------------------------------------------------
const COLLECTION_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedCollectionFields>>> = {
  'dau-an-hoang-thanh-thang-long': {
    en: {
      name: 'Imprints of Thang Long Imperial Citadel',
      description: 'A thousand-year journey through the venerable capital of Thang Long, converging the quintessence of royal court architecture and Dai Viet Buddhist philosophy.',
    },
    fr: {
      name: 'Empreintes de la Cité Impériale de Thang Long',
      description: 'Un voyage millénaire à travers l\'ancienne capitale de Thang Long, unissant la quintessence de l\'architecture royale et la philosophie bouddhiste du Dai Viet.',
    },
    zh: {
      name: '升龙皇城印记',
      description: '漫步千年文宪之地升龙古都，汇聚大越皇家宫廷建筑精华与崇高佛教哲思。',
    },
    ko: {
      name: '탕롱 황성의 자취',
      description: '천년 문헌의 고도 탕롱에서 펼쳐지는 여정, 대월 황실 궁궐 건축의 정수와 불교 철학의 조화.',
    },
    ja: {
      name: '昇龍皇城の記憶',
      description: '千年の文憲の都・昇龍の旅。大越の宮廷建築の粋と崇高な仏教哲学が融合した至宝。',
    },
  },
  'quan-the-di-tich-co-do-hue': {
    en: {
      name: 'Monuments Complex of Hue Ancient Capital',
      description: 'Nguyen Dynasty imperial court architectural masterpiece, exuding solemn serenity beside the poetic Perfume River.',
    },
    fr: {
      name: 'Ensemble de Monuments de l\'Ancienne Capitale de Hué',
      description: 'Chef-d\'œuvre architectural de la cour impériale des Nguyen, rayonnant de sérénité au bord de la poétique rivière des Parfums.',
    },
    zh: {
      name: '顺化古都遗迹群',
      description: '阮朝宫廷建筑之杰作，静穆肃穆地矗立于诗意盎然的香江之滨。',
    },
    ko: {
      name: '후에 고도 유적군',
      description: '응우옌 왕조 궁중 건축의 걸작, 서정적인 흐엉강 변에 깃든 고요하고 장엄한 아름다움.',
    },
    ja: {
      name: 'フエ古都遺跡群',
      description: '阮朝宮廷建築の最高傑作。詩情あふれるフォーン川のほとりに佇む静謐で荘厳な美。',
    },
  },
  'dau-an-sai-gon-gia-dinh': {
    en: {
      name: 'Imprints of Saigon - Gia Dinh',
      description: 'Where Indochine architecture meets modern heritage, witnessing monumental historical milestones of the Vietnamese nation.',
    },
    fr: {
      name: 'Empreintes de Saigon - Gia Dinh',
      description: 'Carrefour de l\'architecture indochinoise, témoin des tournants historiques majeurs de la nation vietnamienne.',
    },
    zh: {
      name: '西贡 - 嘉定印记',
      description: '印度支那殖民建筑与东方韵味的交汇点，见证了越南民族伟大历史征程的风云变幻。',
    },
    ko: {
      name: '사이공 - 자딘의 발자취',
      description: '인도차이나 건축 양식의 교차점이자 민족의 위대한 역사적 발걸음을 증언하는 유산.',
    },
    ja: {
      name: 'サイゴン・嘉定の記憶',
      description: 'インドシナ建築様式が交差し、民族の偉大な歴史的転換点を見守ってきた至宝。',
    },
  },
};

// -------------------------------------------------------------
// 2. PRODUCTS TRANSLATION DICTIONARY (EN, FR, ZH, KO, JA)
// -------------------------------------------------------------
export const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedProductFields>>> = {
  'chua-mot-cot': {
    en: {
      name: 'One Pillar Pagoda',
      subName: 'Lotus Pavilion — Dien Huu Pagoda',
      shortDescription: 'A millennial lotus blossom rising in the heart of Linh Chieu pond, the pinnacle of Dai Viet Buddhist philosophy and traditional wooden joinery.',
      location: 'Ba Dinh, Hanoi',
      epoch: 'Ly Dynasty (Year 1049)',
      material: 'Eco-friendly engineering BioPETG resin (durable 15+ years)',
      finishing: 'Beeswax satin sheen, hand-embossed ancient tiles, aged ironwood finish',
      audioGuideTitle: 'Thang Long Valor & The Dream of the Lotus Pavilion',
      audioGuideNarrator: 'Viettoria Heritage Narrator',
      audioGuideDuration: '02:31',
      audioGuideTranscript: 'In the winter of 1049, morning mist enveloped the capital of Thang Long. King Ly Thai Tong dreamt of Bodhisattva Avalokiteshvara seated on a lotus throne, guiding him upward. Upon awakening, the royal court conceived the founding of Dien Huu Pagoda amidst the Linh Chieu lotus pond, its single stone column soaring like a pristine lotus blossom, blessing the kingdom with peace and millennial longevity.',
    },
    fr: {
      name: 'Pagode au Pilier Unique',
      subName: 'Pavillon du Lotus — Pagode Dien Huu',
      shortDescription: 'Un lotus millénaire émergeant au cœur de l\'étang Linh Chieu, apogée de la philosophie bouddhiste du Dai Viet et des assemblages en bois traditionnels.',
      location: 'Ba Dinh, Hanoï',
      epoch: 'Dynastie Ly (Année 1049)',
      material: 'Résine technique écologique BioPETG (durable 15+ ans)',
      finishing: 'Finition satinée à la cire d\'abeille, tuiles anciennes en relief, texture bois de fer ancien',
      audioGuideTitle: 'Héroïsme de Thang Long & Le Rêve du Pavillon de Lotus',
      audioGuideNarrator: 'Narrateur du Patrimoine Viettoria',
      audioGuideTranscript: 'À l\'hiver 1049, une brume matinale enveloppait la capitale Thang Long. Le roi Ly Thai Tong rêva d\'Avalokiteshvara assis sur un lotus, l\'invitant à monter. À son réveil, la cour décida d\'ériger la pagode Dien Huu au milieu de l\'étang Linh Chieu, son unique pilier de pierre s\'élevant tel un lotus pur, veillant sur la paix et la prospérité du royaume.',
    },
    zh: {
      name: '一柱寺',
      subName: '莲花台 — 延祐寺',
      shortDescription: '灵沼池中千年绽放之莲花，大越佛教哲思与传统木构榫卯营建技术的巅峰之作。',
      location: '河内市巴亭坊',
      epoch: '李朝（公元 1049 年）',
      material: '环保工程 BioPETG 树脂（耐用 15 年以上）',
      finishing: '天然蜂蜡亚光微光、手工仿古瓦当浮雕、老铁杉木质感',
      audioGuideTitle: '升龙浩气与莲花台神梦',
      audioGuideNarrator: 'Viettoria 遗产解说员',
      audioGuideTranscript: '1049年冬，升龙古城晨雾缭绕。李太宗梦见观世音菩萨坐于莲台引帝登临。醒后朝臣共议，于灵沼池中立石柱建延祐寺，如芙蕖出水，祈国祚延绵、千秋太平。',
    },
    ko: {
      name: '못꼿 사원 (일주사)',
      subName: '연화대 — 연우사',
      shortDescription: '린찌에우 연못 한가운데 피어난 천년의 연꽃, 대월 불교 철학과 전통 목조 결구 건축의 정점.',
      location: '하노이시 바딘구',
      epoch: '리 왕조 (1049년)',
      material: '친환경 엔지니어링 BioPETG 수지 (15년 이상 내구성)',
      finishing: '비즈왁스 새틴 무광, 고기와 양각 엠보싱, 고재 철목 질감',
      audioGuideTitle: '탕롱의 기상과 연화대의 신비로운 꿈',
      audioGuideNarrator: 'Viettoria 문화유산 해설사',
      audioGuideTranscript: '1049년 겨울 아침 안개 낀 탕롱 수도에서 리 타이똥 황제는 연화대에 앉은 관세음보살이 손을 이끄는 꿈을 꾸었습니다. 꿈에서 깬 후 린찌에우 연못 중앙에 단 하나의 돌기둥을 세워 연우사를 창건하였습니다.',
    },
    ja: {
      name: '一柱寺 (延祐寺)',
      subName: '蓮花台 — 延祐寺',
      shortDescription: '霊沼池の中央に咲き誇る千年の蓮花。大越仏教哲学と伝統的な木組み建築技術の至高の結晶。',
      location: 'ハノイ市バーディン区',
      epoch: '李朝 (1049年)',
      material: '環境配慮型エンジニアリング BioPETG 樹脂 (耐用15年以上)',
      finishing: '蜜蝋サテン仕上げ、古代瓦の浮き彫り、古材アイアンウッドの質感再現',
      audioGuideTitle: '昇龍の気概と蓮台の吉夢',
      audioGuideNarrator: 'Viettoria 遺産専任ナレーター',
      audioGuideTranscript: '1049年の冬、朝霧に包まれた昇龍の都で、李太宗は蓮華座の観音菩薩に手を引かれる夢を見ました。目覚めた帝は臣下と図り、霊沼池に一本の石柱を立てて延祐寺を建立しました。',
    },
  },
  'khue-van-cac': {
    en: {
      name: 'Khue Van Pavilion',
      subName: 'Pavilion of the Constellation of Literature — Temple of Literature',
      shortDescription: 'The pinnacle symbol of Confucian heritage, scholarly reverence, and cosmic harmony in Thang Long - Hanoi with its distinctive Round Sky & Square Earth architecture.',
      location: 'Dong Da, Hanoi',
      epoch: 'Nguyen Dynasty (Year 1805)',
      material: 'BioPETG ecological resin accented with gold leaf brass detailing',
      finishing: 'Handcrafted vermilion lacquer with gilded sunburst window trims and antique tiles',
      audioGuideTitle: 'Constellation of Literature Illuminating Trang An',
      audioGuideNarrator: 'Viettoria Atelier Narrator',
      audioGuideDuration: '02:13',
      audioGuideTranscript: 'The Khue Van Pavilion reflects upon the tranquil surface of Thien Quang well, mirror of the scholar\'s soul. Erected in 1805 by Governor-General Nguyen Van Thanh, it stands as an enduring tribute to academic distinction and cultural enlightenment.',
    },
    fr: {
      name: 'Pavillon Khue Van',
      subName: 'Pavillon de la Constellation des Lettres — Temple de la Littérature',
      shortDescription: 'Symbole suprême de l\'érudition et de la tradition académique de Thang Long - Hanoï, avec son architecture remarquable unissant Ciel rond et Terre carrée.',
      location: 'Dong Da, Hanoï',
      epoch: 'Dynastie Nguyen (Année 1805)',
      material: 'Résine écologique BioPETG avec détails dorés à la feuille de cuivre',
      finishing: 'Laque vermillon artisanale dorée à la feuille, fenêtres circulaires en étoile et tuiles antiques',
      audioGuideTitle: 'L\'Étoile de la Littérature illuminant Trang An',
      audioGuideNarrator: 'Narrateur Viettoria Atelier',
      audioGuideTranscript: 'Le pavillon Khue Van se mire dans les eaux calmes du puits Thien Quang, miroir de l\'âme des lettrés. Érigé en 1805 par le gouverneur Nguyen Van Thanh, il incarne la noblesse du savoir et le respect des maîtres.',
    },
    zh: {
      name: '奎文阁',
      subName: '奎星之阁 — 文庙国子监',
      shortDescription: '升龙河内崇文重道精神的最高象征，天圆地方独特木构交相辉映。',
      location: '河内市栋多区',
      epoch: '阮朝（公元 1805 年）',
      material: 'BioPETG 环保树脂结合黄铜金箔细部',
      finishing: '手工朱漆贴金奎星圆窗边框与仿古瓦当',
      audioGuideTitle: '奎星璀璨耀长安',
      audioGuideNarrator: 'Viettoria 工坊解说员',
      audioGuideTranscript: '奎文阁倒映于天光井的静谧水面，如明镜映照文人雅士之心。1805年由总镇阮文诚主持营建，象征着大越崇文重道与尊师重教的优良传统。',
    },
    ko: {
      name: '규문각',
      subName: '규성루 — 문묘 국자감',
      shortDescription: '하노이 천년 문헌과 숭문 정신의 정점, 하늘은 둥글고 땅은 네모나다는 천원지방의 독창적 목조 누각.',
      location: '하노이시 동다구',
      epoch: '응우옌 왕조 (1805년)',
      material: 'BioPETG 친환경 수지 및 금박 황동 디테일',
      finishing: '전통 주칠 및 원형 창호 금박 마감, 전통 기와',
      audioGuideTitle: '장안의 땅을 비추는 규성의 빛',
      audioGuideNarrator: 'Viettoria 아틀리에 해설사',
      audioGuideTranscript: '규문각은 선비의 마음을 비추는 거울처럼 고요한 티엔꽝 우물에 모습을 비춥니다. 1805년 총진 응우옌 반 타인이 건립하였으며, 민족의 드높은 학문과 스승을 존경하는 숭고한 전통을 상징합니다.',
    },
    ja: {
      name: '奎文閣',
      subName: '奎星の楼閣 — 文廟・国子監',
      shortDescription: 'ハノイの学問尊重と文治の象徴。「天円地方」の宇宙観を宿した比类なき木造楼閣。',
      location: 'ハノイ市ドンダー区',
      epoch: '阮朝 (1805年)',
      material: 'BioPETG 樹脂および真鍮箔アクセント',
      finishing: '朱塗り漆工芸、奎星を象る円窓の金箔加飾、古代瓦',
      audioGuideTitle: '長安の地を照らす奎星の輝き',
      audioGuideNarrator: 'Viettoria アトリエナレーター',
      audioGuideTranscript: '奎文閣は、文人の心を映す鏡のように静まり返る天光井の水面にその優美な影を落とします。1805年に総鎮阮文誠により建立され、高潔な学問の精神と尊師重道の伝統を象徴しています。',
    },
  },
  'cot-co-ha-noi': {
    en: {
      name: 'Hanoi Flag Tower',
      subName: 'Thang Long Citadel Banner Bastion',
      shortDescription: 'A resilient witness across centuries of transformation, where the national flag proudly flutters above the historic capital.',
      location: 'Hoang Dieu, Hanoi',
      epoch: 'Nguyen Dynasty (Year 1812)',
      material: 'BioPETG resin replicating historic Thang Long clay bricks',
      finishing: 'Ancient brick red patina, 39 delicate floriated ventilation embrasures',
      audioGuideTitle: 'Valor of Thang Long Banner Bastion',
      audioGuideNarrator: 'Viettoria Atelier Narrator',
      audioGuideDuration: '02:21',
      audioGuideTranscript: 'Constructed in 1812, the Hanoi Flag Tower is one of the rare monuments that remained intact within the Imperial Citadel, marking the sacred Liberation Day of the capital on October 10, 1954.',
    },
    fr: {
      name: 'Tour du Drapeau de Hanoï',
      subName: 'Kỳ Đài Thang Long',
      shortDescription: 'Témoin inébranlable des siècles d\'histoire, où le drapeau national flotte fièrement au-dessus du ciel de la capitale.',
      location: 'Hoang Dieu, Hanoï',
      epoch: 'Dynastie Nguyen (Année 1812)',
      material: 'Résine BioPETG imitant la brique ancestrale de Thang Long',
      finishing: 'Patine rouge brique ancienne, 39 meurtrières en rosace sculptées',
      audioGuideTitle: 'Héroïsme du Bastion de Thang Long',
      audioGuideNarrator: 'Narrateur Viettoria Atelier',
      audioGuideTranscript: 'Construite en 1812, la Tour du Drapeau de Hanoï est l\'un des rares monuments préservés au sein de la Cité Impériale, marquant le jour sacré de la Libération de la Capitale le 10 octobre 1954.',
    },
    zh: {
      name: '河内旗台',
      subName: '升龙古城要塞旗台',
      shortDescription: '历经沧桑的坚毅历史见证，红旗金星巍然飘扬于首都蓝天之上。',
      location: '河内市黄耀街',
      epoch: '阮朝（公元 1812 年）',
      material: 'BioPETG 树脂还原升龙古砖纹理',
      finishing: '古朴砖红风化釉色，39个精雕梅花透气采光孔',
      audioGuideTitle: '升龙要塞旗台之浩气',
      audioGuideNarrator: 'Viettoria 工坊解说员',
      audioGuideTranscript: '河内旗台建于1812年，是升龙皇城内少有的完好保留至今的古建筑之一，铭刻着1954年10月10日首都解放的神圣历史时刻。',
    },
    ko: {
      name: '하노이 깃대',
      subName: '탕롱 기단',
      shortDescription: '수많은 역사적 변천 속에서도 굳건히 자리를 지킨 역사의 증인이자, 수도의 하늘에 국기가 휘날리는 성지.',
      location: '하노이시 황지에우',
      epoch: '응우옌 왕조 (1812년)',
      material: '탕롱 전통 고벽돌 질감을 재현한 BioPETG 수지',
      finishing: '고벽돌 붉은 녹색 파티나, 39개의 국화 채광창 정밀 조각',
      audioGuideTitle: '탕롱 기단의 기개와 역사',
      audioGuideNarrator: 'Viettoria 아틀리에 해설사',
      audioGuideTranscript: '1812년에 축조된 하노이 깃대는 탕롱 황성 안에서 온전히 보존된 몇 안 되는 유적 중 하나로, 1954년 10월 10일 수도 해방의 성스러운 순간을 상징합니다.',
    },
    ja: {
      name: 'ハノイの旗塔',
      subName: '昇龍旗台',
      shortDescription: '幾多の歴史の変遷を耐え抜いた不屈の証人。首都の空に誇り高く国旗が翻る象徴的要塞。',
      location: 'ハノイ市ホアンジエウ',
      epoch: '阮朝 (1812年)',
      material: '昇龍古煉瓦の風合いを再現した BioPETG 樹脂',
      finishing: '古煉瓦の赤褐色パティナ、39箇所の梅花換気採光窓',
      audioGuideTitle: '昇龍旗台の気概',
      audioGuideNarrator: 'Viettoria アトリエナレーター',
      audioGuideTranscript: '1812年に建設されたハノイの旗塔は、昇龍皇城の中で現存する数少ない貴重な建築遺産の一つであり、1954年10月10日の首都解放という歴史的瞬間を永遠に留めています。',
    },
  },
  'ngo-mon-hue': {
    en: {
      name: 'Ngo Mon Gate',
      subName: 'Principal Meridian Gateway of Hue Imperial City',
      shortDescription: 'The crowning glory of Nguyen Dynasty royal court architecture, featuring the grand Five-Phoenix Pavilion supported by 100 ironwood columns.',
      location: 'Hue City, Thua Thien Hue',
      epoch: 'Nguyen Dynasty (Year 1833)',
      material: 'BioPETG resin with authentic imperial court color palette',
      finishing: 'Vibrant yellow imperial glazed tiles and jade-green glazed ceramic tiles',
      audioGuideTitle: 'Imperial Melodies Beside the Perfume River',
      audioGuideNarrator: 'Viettoria Ancient Capital Narrator',
      audioGuideDuration: '02:35',
      audioGuideTranscript: 'Facing directly south according to geomantic principles, Ngo Mon Gate is where imperial authority converges with celestial light. Above sits the Five-Phoenix Pavilion, witness to major court proclamations and the historic abdication of 1945.',
    },
    fr: {
      name: 'Porte du Midi (Ngo Mon)',
      subName: 'Portail Principal de la Cité Impériale de Hué',
      shortDescription: 'Apogée de l\'architecture royale de la dynastie Nguyen, dominée par le Belvédère des Cinq Phénix aux 100 colonnes de bois de fer.',
      location: 'Ville de Hué, Thua Thien Hue',
      epoch: 'Dynastie Nguyen (Année 1833)',
      material: 'Résine BioPETG aux teintes fidèles à la cour impériale',
      finishing: 'Tuiles émaillées impériales jaune vif et céramiques vertes éclatantes',
      audioGuideTitle: 'Mélodies Impériales au Bord de la Rivière des Parfums',
      audioGuideNarrator: 'Narrateur Cité Impériale Viettoria',
      audioGuideTranscript: 'Faisant face au sud selon les principes de la géomancie, la Porte du Midi est le lieu où l\'autorité impériale s\'unit à la lumière céleste. Au sommet trône le Belvédère des Cinq Phénix, témoin des grandes proclamations et de l\'abdication historique de 1945.',
    },
    zh: {
      name: '顺化午门',
      subName: '顺化皇城正门 · 五凤楼',
      shortDescription: '阮朝宫廷营造技艺之绝顶，五凤楼百柱铁木凌空，宏伟壮丽。',
      location: '承天顺化省顺化市',
      epoch: '阮朝（公元 1833 年）',
      material: 'BioPETG 树脂配搭宫廷传统纯矿物漆色',
      finishing: '灿烂金黄琉璃瓦与青绿琉璃瓦双色交叠',
      audioGuideTitle: '香江之畔宫廷雅韵',
      audioGuideNarrator: 'Viettoria 古都解说员',
      audioGuideTranscript: '午门依照易理面南而立，乃皇权与光明汇聚之所。门楼之上建有五凤楼，见证了大朝传胪、颁朔之典，以及1945年保大帝宣布退位的重要历史转折。',
    },
    ko: {
      name: '후에 오문',
      subName: '후에 황성 정문 · 오봉루',
      shortDescription: '100개의 철목 기둥이 떠받치는 오봉루의 웅장함을 자랑하는 응우옌 왕조 궁궐 건축의 극치.',
      location: '투아트엔후에성 후에시',
      epoch: '응우옌 왕조 (1833년)',
      material: '궁중 전통 광물 도료를 재현한 BioPETG 수지',
      finishing: '황실 황유리와와 청유리와의 정교한 배치 마감',
      audioGuideTitle: '흐엉강 변에 울려 퍼지는 궁중의 선율',
      audioGuideNarrator: 'Viettoria 고도 문화유산 해설사',
      audioGuideTranscript: '오문은 역학의 원리에 따라 정남향을 바라보며, 황제의 권위와 빛이 모여드는 성스러운 공간입니다. 상부의 오봉루는 과거 급제자 발표와 책력 반포 등 국가 의례가 열렸으며, 1945년 역사적인 퇴위식이 거행된 장소입니다.',
    },
    ja: {
      name: 'フエ午門',
      subName: 'フエ王宮正門 · 五鳳楼',
      shortDescription: '100本の鉄木柱に支えられた五鳳楼の壮麗美を誇る阮朝宮廷建築の最高峰。',
      location: 'トゥアティエン＝フエ省フエ市',
      epoch: '阮朝 (1833年)',
      material: '宮廷伝統の鉱物漆色を再現した BioPETG 樹脂',
      finishing: '鮮やかな黄色の皇帝瑠璃瓦と青緑瑠璃瓦の二色葺き',
      audioGuideTitle: '香江のほとりに響く宮廷の調べ',
      audioGuideNarrator: 'Viettoria 古都専任ナレーター',
      audioGuideTranscript: '午門は易学の理に従い真南を向いて建ち、皇帝の威光と光が交わる神聖な場所です。上部には五鳳楼がそびえ、官吏登用発表や暦の頒布などの大礼が執り行われ、1945年の歴史的退位の舞台となりました。',
    },
  },
  'ben-nha-rong': {
    en: {
      name: 'Nha Rong Wharf',
      subName: 'Ho Chi Minh Museum — Port of Saigon',
      shortDescription: 'Where the young patriot Nguyen Tat Thanh set sail on his historic quest for national independence in 1911, a timeless symbol of southern heritage.',
      location: 'District 4, Ho Chi Minh City',
      epoch: 'Contemporary Era (Year 1863)',
      material: 'BioPETG resin replicating French colonial terracotta brick',
      finishing: 'Ceramic dual-dragon moon-worshipping rooftop sculpture with glazed emerald hue',
      audioGuideTitle: 'Epic Ballad on Saigon Harbor',
      audioGuideNarrator: 'Viettoria Atelier Narrator',
      audioGuideDuration: '02:41',
      audioGuideTranscript: 'On June 5, 1911, the steamship Amiral Latouche-Tréville cast off from Saigon Harbor, bearing the profound aspirations of 21-year-old patriot Nguyen Tat Thanh on his journey to find the path to national freedom.',
    },
    fr: {
      name: 'Quai Nha Rong',
      subName: 'Musée Ho Chi Minh — Port de Saigon',
      shortDescription: 'Lieu d\'où le jeune patriote Nguyen Tat Thanh s\'embarqua en 1911 pour sa quête d\'indépendance nationale, symbole éternel du Sud.',
      location: '4e arrondissement, Hô Chi Minh-Ville',
      epoch: 'Époque Contemporaine (Année 1863)',
      material: 'Résine BioPETG imitant la brique coloniale terracotta',
      finishing: 'Toiture ornée du couple de dragons en céramique émaillée turquoise vénérant la lune',
      audioGuideTitle: 'Chant Épique sur le Port de Saigon',
      audioGuideNarrator: 'Narrateur Viettoria Atelier',
      audioGuideTranscript: 'Le 5 juin 1911, le paquebot Amiral Latouche-Tréville quitta le port de Saigon, portant les ardentes aspirations du jeune patriote de 21 ans, Nguyen Tat Thanh, en quête de libération nationale.',
    },
    zh: {
      name: '龙屋码头',
      subName: '胡志明博物馆 — 西贡商港',
      shortDescription: '1911年爱国青年阮必成扬帆远航寻求救国之道之地，南方历史的永恒印记。',
      location: '胡志明市第四郡',
      epoch: '近现代（公元 1863 年）',
      material: 'BioPETG 树脂再现殖民地时代古红陶砖质地',
      finishing: '屋脊双龙戏珠青釉陶塑神兽浮雕',
      audioGuideTitle: '西贡商港之壮丽长歌',
      audioGuideNarrator: 'Viettoria 工坊解说员',
      audioGuideTranscript: '1911年6月5日，拉图什-特雷维尔海军上将号轮船缓缓驶离西贡港口，载着21岁青年阮必成寻找民族独立自由之路的赤诚炽热之志。',
    },
    ko: {
      name: '냐롱 부두',
      subName: '호치민 박물관 — 사이공 항구',
      shortDescription: '1911년 청년 응우옌 떳 타인이 구국의 길을 찾아 출항했던 남부 역사의 영원한 상징.',
      location: '호치민시 제4군',
      epoch: '근현대 (1863년)',
      material: '프랑스 식민지 시절 테라코타 벽돌을 모사한 BioPETG',
      finishing: '지붕 위 청록색 에나멜 도자기 쌍룡조월 상징 조각',
      audioGuideTitle: '사이공 항구 위에 울려 퍼지는 서사시',
      audioGuideNarrator: 'Viettoria 아틀리에 해설사',
      audioGuideTranscript: '1911년 6월 5일, 아미랄 라투슈-트레빌 호가 사이공 항구를 떠나며 21세 청년 응우옌 떳 타인의 조국 독립과 자유를 향한 뜨거운 열망을 싣고 항해를 시작했습니다.',
    },
    ja: {
      name: 'ニャロン埠頭',
      subName: 'ホーチミン博物館 — サイゴン港',
      shortDescription: '1911年に青年グエン・タット・タインが救国の志を抱いて旅立った、南部ベトナムの不朽の象徴。',
      location: 'ホーチミン市4区',
      epoch: '近代 (1863年)',
      material: 'フランス植民地時代のテラコッタ煉瓦を再現した BioPETG',
      finishing: '屋根上の青釉陶器製「双龍朝月」彫刻ディテール',
      audioGuideTitle: 'サイゴン港の壮大なる叙事詩',
      audioGuideNarrator: 'Viettoria アトリエナレーター',
      audioGuideTranscript: '1911年6月5日、ラトゥーシュ・トレヴィル提督号はサイゴン港を静かに出航しました。21歳の青年グエン・タット・タインの、祖国の独立と自由を求める燃えるような情熱を乗せて。',
    },
  },
  'gac-lau-thang-long': {
    en: {
      name: 'Thang Long Imperial Pavilion',
      subName: 'Early Le Dynasty Court Architecture',
      shortDescription: 'Dai Viet royal pavilion reconstructed from 15th-century archaeological artifacts at Thang Long Imperial Citadel, with soaring layered hip-and-gable eaves.',
      location: 'Thang Long Imperial Citadel, Hanoi',
      epoch: 'Early Le Dynasty (15th Century)',
      material: 'Eco-friendly BioPETG with traditional mortise-and-tenon structure',
      finishing: 'Gold leaf gilding, imperial glazed roof tiles',
      audioGuideTitle: 'Echoes of the Early Le Imperial Pavilion',
      audioGuideNarrator: 'Viettoria Atelier Narrator',
      audioGuideDuration: '02:00',
      audioGuideTranscript: 'The 15th-century Early Le Dynasty marked the golden age of Dai Viet civilization and royal architecture. Reconstructed from glazed ceramic fragments, dragon roof crests, and terracotta artifacts unearthed at the Thang Long Imperial Citadel, this pavilion model recreates the multi-tiered eaves soaring into the sky, embodying royal majesty and the mastery of ancient craftsmen.',
    },
    fr: {
      name: 'Pavillon Impérial de Thang Long',
      subName: 'Architecture de Cour de la Dynastie des Le Antérieurs',
      shortDescription: 'Pavillon royal du Dai Viet reconstitué à partir d\'artéfacts archéologiques du 15e siècle à la Cité Impériale de Thang Long.',
      location: 'Cité Impériale de Thang Long, Hanoï',
      epoch: 'Dynastie des Le Antérieurs (15e Siècle)',
      material: 'BioPETG écologique avec structure traditionnelle à tenon et mortaise',
      finishing: 'Dorure à la feuille d\'or, tuiles vernissées impériales',
      audioGuideTitle: 'Échos du Pavillon Impérial des Le Antérieurs',
      audioGuideNarrator: 'Narrateur de l\'Atelier Viettoria',
      audioGuideDuration: '02:00',
      audioGuideTranscript: 'Au 15e siècle sous la dynastie des Le Antérieurs, la civilisation du Dai Viet et l\'architecture royale ont atteint leur âge d\'or. Reconstitué à partir de fragments céramiques et de terres cuites découverts à la Cité Impériale de Thang Long, ce modèle reproduit les toitures superposées élancées vers le ciel.',
    },
    zh: {
      name: '升龙皇城阁楼',
      subName: '后黎朝早期宫廷建筑艺术',
      shortDescription: '依托升龙皇城15世纪考古出土陶构件考证复原之大越皇家阁楼，重檐翘角，雄浑巍峨。',
      location: '河内市升龙皇城遗迹区',
      epoch: '后黎朝（15 世纪）',
      material: '环保 BioPETG 树脂结合大越传统榫卯结构',
      finishing: '描金莳绘、升龙考古黄绿琉璃瓦色泽',
      audioGuideTitle: '黎初皇都阁楼之回响',
      audioGuideNarrator: 'Viettoria 工坊解说员',
      audioGuideDuration: '02:00',
      audioGuideTranscript: '15世纪后黎朝是大越文宪与皇家建筑营造的高峰期。此阁楼模型依据升龙皇城出土之龙首脊饰、釉陶残片精心考据复原，重现层叠飞檐凌空展翼的巍峨气派。',
    },
    ko: {
      name: '탕롱 황성 각루',
      subName: '후 레 왕조 초기 궁중 건축',
      shortDescription: '15세기 탕롱 황성 유적 발굴 토제 유물을 바탕으로 복원된 대월 황실 누각, 하늘로 솟아오른 겹처마의 위용.',
      location: '하노이 탕롱 황성 유적지',
      epoch: '후 레 왕조 (15세기)',
      material: '친환경 BioPETG 및 대월 전통 맞춤 결구 구조',
      finishing: '금박 및 탕롱 발굴 황·청 유약 기와 복원 마감',
      audioGuideTitle: '레 왕조 황실 각루의 울림',
      audioGuideNarrator: 'Viettoria 아틀리에 해설사',
      audioGuideDuration: '02:00',
      audioGuideTranscript: '15세기 레 왕조 초기는 대월 문명과 궁중 건축 예술의 황금기였습니다. 탕롱 황성에서 출토된 도자기 파편과 용마루 장식 기와를 고증하여 재현한 이 각루는 웅장한 다층 처마의 아름다움을 간직하고 있습니다.',
    },
    ja: {
      name: '昇龍皇城 閣楼',
      subName: '前期黎朝 宮廷建築',
      shortDescription: '15世紀の昇龍皇城遺跡から出土した陶製遺物をもとに復元された大越の王宮閣楼。天へと伸びる優美な多層屋根。',
      location: 'ハノイ 昇龍皇城遺跡',
      epoch: '前期黎朝 (15世紀)',
      material: '環境配慮型 BioPETG ＋ 伝統木組構造',
      finishing: '金箔押しおよび昇龍発掘釉薬瓦再現仕上げ',
      audioGuideTitle: '黎朝宮廷閣楼の響き',
      audioGuideNarrator: 'Viettoria アトリエナレーター',
      audioGuideDuration: '02:00',
      audioGuideTranscript: '15世紀の前期黎朝は、大越の文化と宮廷建築が栄華を極めた時代でした。昇龍皇城より発掘された龍頭瓦や施釉陶器の断片を精密に考証・復元した本モデルは、空へ羽ばたくような反り屋根の荘厳さを今に伝えます。',
    },
  },
};

// -------------------------------------------------------------
// 3. BLOG POSTS TRANSLATION DICTIONARY
// -------------------------------------------------------------
const BLOG_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedBlogFields>>> = {
  'ky-nghe-mong-go-am-duong-trong-kien-truc-co-viet-nam': {
    en: {
      title: 'Mortise-and-Tenon Joinery in Ancient Vietnamese Architecture & 3D Digitalization',
      excerpt: 'Exploring the ancient philosophy of interlocking timbers without glue or iron nails, and how Viettoria modularizes each joint into eco-friendly 3D miniatures.',
      content: 'In traditional Vietnamese timber architecture, the pillar-and-beam system relied purely on interlocking yin-yang mortise and tenon joints. Master carpenters measured using traditional bamboo calipers, hand-chiseling cantilever beams that self-locked under the monumental weight of the tiled roof. Viettoria leverages 3D optical scanning and 0.1mm tolerance algorithms to faithfully recreate this heritage in bio-friendly miniature collectibles.',
      category: 'Craftsmanship & Architecture',
      readTime: '5 min read',
      author: 'Viettoria Heritage Research Team',
    },
    fr: {
      title: 'L\'Art des Assemblages à Tenon et Morteise dans l\'Architecture Ancienne et sa Numérisation 3D',
      excerpt: 'Découvrez la philosophie ancestrale des charpentes assemblées sans clou ni colle, et comment Viettoria reproduit chaque tenon en modèles 3D écologiques.',
      content: 'Dans l\'architecture traditionnelle en bois du Vietnam, la structure porteuse repose entièrement sur des assemblages à tenon et mortaise. Les maîtres charpentiers d\'antan taillaient chaque poutre pour qu\'elle se verrouille sous le poids même de la toiture. Viettoria utilise la numérisation 3D et une tolérance de 0.1mm pour faire revivre cette prouesse technique sur ses maquettes BioPETG.',
      category: 'Artisanat & Architecture',
      readTime: '5 min de lecture',
      author: 'Équipe de Recherche Viettoria',
    },
    zh: {
      title: '越南古建阴阳榫卯营造技艺与 3D 数字化新生',
      excerpt: '探寻先人不用一钉一胶的营造哲思，以及 Viettoria 如何将传统大木作榫卯微缩为环保 3D 实体模型。',
      content: '在越南传统木构建筑中，梁柱体系完全依凭阴阳榫卯精密契合。古匠执尺量材、凿劈斗拱，使各构件在厚重瓦顶的自重压力下自锁成坚固整体。Viettoria 采用精密 3D 光学扫描与 0.1mm 公差算法，在 BioPETG 环保微缩模型上原汁原味再现古建榫卯之美。',
      category: '营造法式 & 建筑考古',
      readTime: '5 分钟阅读',
      author: 'Viettoria 遗产研学团队',
    },
    ko: {
      title: '베트남 고건축 음양 맞춤 결구법과 3D 디지털 복원의 여정',
      excerpt: '못이나 접착제를 일절 사용하지 않았던 선조들의 건축 철학, 그리고 Viettoria가 전통 결구를 친환경 3D 모형으로 모듈화한 과정.',
      content: '베트남 전통 목조건축에서 기둥과 보의 가구 구조는 순수하게 음양 짜맞춤 결구에 의존했습니다. 목수들은 기와지붕의 무게 자체로 목재가 서로 견고하게 맞물리도록 설계했습니다. Viettoria는 3D 스캐닝과 0.1mm 공차 해석을 통해 이 미학을 BioPETG 미니어처로 완벽히 되살려냈습니다.',
      category: '전통 기예 & 건축학',
      readTime: '5분 분량',
      author: 'Viettoria 유산 연구소',
    },
    ja: {
      title: 'ベトナム伝統建築の木組み「継手・仕口」と 3D デジタル再現の軌跡',
      excerpt: '釘や接着剤を一切使わない先人の建築哲学と、Viettoria が伝統の継手を環境配慮型 3D 模型へとモジュール化した技術的挑戦。',
      content: 'ベトナムの伝統木造建築では、柱と梁の結合は完全に陰陽の仕口と継手によって行われていました。重厚な瓦屋根の自重によって部材同士が互いに締め固まる構造です。Viettoria は 3D 光学スキャンと 0.1mm 公差アルゴリズムを用い、BioPETG 製ミニチュア模型としてこの木組みの美を忠実に再現しました。',
      category: '伝統技法 & 建築美学',
      readTime: '5分で読める',
      author: 'Viettoria 遺産研究チーム',
    },
  },
  'dien-huu-tu-doa-sen-nghin-nam-tu-giac-mong-vua-ly-thai-tong': {
    en: {
      title: 'Dien Huu Pagoda: The Millennial Lotus Born from King Ly Thai Tong\'s Sacred Vision',
      excerpt: 'Deciphering the geomantic symbolism, cosmic harmony of Round Sky & Square Earth, and the historical epoch of 11th-century Thang Long.',
      content: 'In the winter of 1049, the capital of Thang Long welcomed an unprecedented masterpiece in human architectural history. The One Pillar Pagoda not only honors the devotion of King Ly Thai Tong, but also embodies prayers for universal peace and prosperity, ushering Dai Viet into a golden era of civilization.',
      category: 'History & Legends',
      readTime: '7 min read',
      author: 'Nguyen Van Canh',
    },
    fr: {
      title: 'Pagode Dien Huu: Le Lotus Millénaire Issu du Songe Sacré du Roi Ly Thai Tong',
      excerpt: 'Décryptage du symbolisme géomantique, de l\'harmonie cosmique et du contexte historique de Thang Long au XIe siècle.',
      content: 'À l\'hiver 1049, la capitale Thang Long a vu naître une œuvre sans pareille dans l\'histoire de l\'architecture. La Pagode au Pilier Unique ne témoigne pas seulement de la ferveur bouddhique du roi Ly Thai Tong, mais scelle le vœu d\'un royaume prospère et en paix.',
      category: 'Histoire & Légendes',
      readTime: '7 min de lecture',
      author: 'Nguyen Van Canh',
    },
    zh: {
      title: '延祐寺：李太宗神梦中绽放的千年幽莲',
      excerpt: '破译风水堪舆隐喻、天圆地方宇宙观与 11 世纪升龙古都的辉煌黄金时代。',
      content: '公元 1049 年冬，升龙皇城迎来了人类建筑史上一座独一无二的里程碑。一柱寺不仅见证了李太宗的至诚弘佛，更是祈愿国泰民安的至高图腾，开启了大越文明的光辉时代。',
      category: '历史典故 & 风物志',
      readTime: '7 分钟阅读',
      author: '阮文景 (Nguyen Van Canh)',
    },
    ko: {
      title: '연우사: 리 타이똥 황제의 길몽에서 피어난 천년의 연꽃',
      excerpt: '풍수지리적 상징, 천원지방의 우주관, 그리고 11세기 탕롱의 찬란한 황금기를 해독하다.',
      content: '1049년 겨울, 탕롱 수도에 인류 건축사상 유례없는 걸작이 탄생했습니다. 일주사는 리 타이똥 황제의 불심뿐만 아니라 국태민안을 염원하는 상징으로서 대월 문명의 찬란한 번영을 열었습니다.',
      category: '역사 & 설화',
      readTime: '7분 분량',
      author: '응우옌 반 카인 (Nguyen Van Canh)',
    },
    ja: {
      title: '延祐寺：李太宗の神夢から咲き出でた千年の蓮華',
      excerpt: '風水思想の寓意、「天円地方」の宇宙観、そして11世紀の古都・昇龍の黄金時代を紐解く。',
      content: '1049年の冬、昇龍の都に人類建築史上類を見ない傑作が誕生しました。一柱寺は李太宗の篤い仏心のみならず、天下泰平の祈りを宿し、大越文明の黄金時代を切り拓きました。',
      category: '歴史 & 伝承',
      readTime: '7分で読める',
      author: 'グエン・ヴァン・カイン (Nguyen Van Canh)',
    },
  },
  'kien-truc-xua-duoc-thu-nho-trong-mot-mo-hinh': {
    en: {
      title: 'When Ancient Architecture is Miniaturized into a Tactile Model',
      excerpt: 'A delicate physical model opens an intimate perspective into the proportions, intricate joinery, and living history of ancient masterworks.',
      content: 'Miniature collectibles allow observers to study architectural geometry, interlocking timber brackets, and tilework from every perspective. Paired with historical archives and interactive 3D web experiences, each monument finds an engaging narrative voice for enthusiasts worldwide.',
      category: 'Atelier Stories',
      readTime: '4 min read',
      author: 'Viettoria Atelier',
    },
    fr: {
      title: 'Quand l\'Architecture Ancestrale se Miniaturise dans un Modèle Tactile',
      excerpt: 'Une maquette miniature offre un regard intime sur les proportions, les détails sculptés et la mémoire des monuments d\'autrefois.',
      content: 'La maquette miniature permet d\'observer la géométrie et les détails sous tous les angles. Associée aux archives historiques et aux rendus 3D interactifs, chaque chef-d\'œuvre trouve une nouvelle voix pour toucher les générations d\'aujourd\'hui.',
      category: 'Récits d\'Atelier',
      readTime: '4 min de lecture',
      author: 'Viettoria Atelier',
    },
    zh: {
      title: '当古老营造在指间微缩模型中重获新生',
      excerpt: '精微的手作实体模型，为我们打开了一扇亲近古建尺度比例、斗拱构件与流芳岁月的独特视窗。',
      content: '微缩建筑藏品让观者能够从全方位细细端详古建筑的几何结构与瓦当飞檐。结合珍贵历史文献与 Web 端 3D 沉浸式互动，每座东方古迹都能在当今时代发出最生动的声音。',
      category: '工坊造物录',
      readTime: '4 分钟阅读',
      author: 'Viettoria 工坊',
    },
    ko: {
      title: '옛 건축이 한 손의 정밀 모형으로 축소될 때',
      excerpt: '손끝에 닿는 섬세한 물리적 모형은 옛 건축의 비례와 결구, 그 안에 깃든 살아있는 역사를 가장 가깝게 만나는 통로가 됩니다.',
      content: '축소 모형을 통해 건축적 조형미와 목조 가구의 디테일을 다각도에서 관찰할 수 있습니다. 역사적 사료와 웹 3D 인터랙티브 경험이 결합될 때, 고유의 문화유산은 전 세계인에게 생생한 울림을 전합니다.',
      category: '아틀리에 제작기',
      readTime: '4분 분량',
      author: 'Viettoria 아틀리에',
    },
    ja: {
      title: '古の建築が手元のミニチュア模型に凝縮されるとき',
      excerpt: '指先に乗る精巧な模型は、古代の名建築のプロポーションや組物、そこに宿る生きた歴史への親密な扉を開きます。',
      content: 'ミニチュアコレクションにより、建築の幾何学や木組みの細部をあらゆる角度から観察できます。歴史的史料と Web 3D 体験が融合することで、建造物は世界中の人々の心に響く新たな語り部となります。',
      category: 'アトリエ製作録',
      readTime: '4分で読める',
      author: 'Viettoria アトリエ',
    },
  },
};

// -------------------------------------------------------------
// 4. STORY BLOCKS TRANSLATION DICTIONARY
// -------------------------------------------------------------
const STORY_BLOCK_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedStoryBlockFields>>> = {
  'block-1': {
    en: {
      title: 'The Lotus Throne Vision of Winter 1049',
      subtitle: 'Origins of the Ly Dynasty & The Quest for National Peace',
      content: 'One Pillar Pagoda (Dien Huu Pagoda) was established in the winter of 1049 during the reign of King Ly Thai Tong. According to the Complete Annals of Dai Viet, the King dreamt of Bodhisattva Avalokiteshvara seated on a lotus throne, leading him upward. Awakening, royal advisers recommended building a sanctuary atop an upright stone pillar in the square Linh Chieu pond, mirroring a radiant lotus blossom blooming in Thang Long.',
      mediaCaption: 'Dien Huu Pagoda mirrored across Linh Chieu pond in Ba Dinh, Hanoi.',
    },
    fr: {
      title: 'Le Songe du Trône de Lotus de l\'Hiver 1049',
      subtitle: 'Origines de la Dynastie Ly & Aspiration à la Paix Universelle',
      content: 'La Pagode au Pilier Unique (Pagode Dien Huu) a été fondée à l\'hiver 1049 sous le règne du roi Ly Thai Tong. Selon les Annales du Dai Viet, le roi rêva d\'Avalokiteshvara l\'invitant à monter sur un trône de lotus.',
      mediaCaption: 'La Pagode Dien Huu reflétée dans l\'étang Linh Chieu à Ba Dinh, Hanoï.',
    },
    zh: {
      title: '己丑冬莲台入梦（公元 1049 年）',
      subtitle: '李朝肇造与国泰民安的宏愿',
      content: '一柱寺（延祐寺）始建于李太宗己丑年冬。据《大越史记全书》记载，帝梦观音菩萨引其登莲花台。寤后，朝臣共议立寺，以石柱挺立于方池灵沼之中，犹如芙蕖吐艳，香远益清。',
      mediaCaption: '延祐寺倒映于河内市巴亭区灵沼池波光之中。',
    },
    ko: {
      title: '1049년 겨울, 연화대의 신비로운 길몽',
      subtitle: '리 왕조의 태동과 태평성대의 염원',
      content: '일주사(연우사)는 1049년 겨울 리 타이똥 황제의 치세에 창건되었습니다. 《대월사기전서》에 따르면, 황제가 연화대에 앉은 관세음보살이 손을 이끄는 꿈을 꾼 후 영구한 평화를 기원하며 호수 가운데 단일 석주를 세웠습니다.',
      mediaCaption: '하노이 바딘구 린찌에우 연못 위에 비친 연우사의 자태.',
    },
    ja: {
      title: '己丑の冬、蓮華座の吉夢 (1049年)',
      subtitle: '李朝の興隆と天下泰平の祈り',
      content: '一柱寺（延祐寺）は李太宗の御代、1049年冬に創建されました。『大越史記全書』によれば、帝が蓮華座の観音菩薩の夢を見た後、霊沼池の中央に一本の石柱を立てて寺院を建立しました。',
      mediaCaption: 'ハノイ市バーディン区霊沼池の水面に映える延祐寺。',
    },
  },
  'block-2': {
    en: {
      title: 'Unrivaled Architecture: A Single Stone Pillar Supporting the Lotus Shrine',
      subtitle: 'Pinnacle of ancient Vietnamese timber and stone craftsmanship',
      content: 'The entire Lotus Pavilion rests atop a cylindrical monolithic stone pillar 1.2 meters in diameter. Above the pillar sits an array of 8 massive ironwood cantilevers radiating outwards like 8 blooming lotus petals, completely supporting the square sanctuary without any auxiliary columns.',
      highlightBadge: 'World Monolithic Unique',
    },
    fr: {
      title: 'Architecture Inégalée: Un Unique Pilier de Pierre Soutenant le Pavillon',
      subtitle: 'Apogée de l\'artisanat du bois et de la pierre des bâtisseurs vietnamiens',
      content: 'L\'ensemble du Pavillon du Lotus repose sur un pilier monolithique de 1.2 mètre de diamètre. Au sommet, 8 consoles en bois de fer rayonnent comme 8 pétales de lotus épanouis.',
      highlightBadge: 'Chef-d\'œuvre Unique au Monde',
    },
    zh: {
      title: '独步天工：单石立柱承托整座莲台佛殿',
      subtitle: '古代大越工匠木石榫卯结合的旷世技艺',
      content: '整座莲花台殿堂完全安立于一根直径 1.2 米的整块圆柱形青石柱之上。柱首以 8 根大型铁杉木挑梁呈 45 度角向外撑开，形若八瓣怒放之莲花，无须任何辅柱便稳固承托整座方形佛殿。',
      highlightBadge: '世界古建独品',
    },
    ko: {
      title: '독보적인 건축미: 단 하나의 돌기둥이 떠받치는 연화대',
      subtitle: '고대 베트남 목조 및 석조 장인 기술의 결정체',
      content: '연화대 전체는 직경 1.2m의 원통형 단일 석주 위에 안치되어 있습니다. 석주 상단에는 8개의 대형 철목 외팔보가 연꽃잎처럼 사방으로 뻗어 나와 보조 기둥 없이도 완벽한 하중 분산을 이룹니다.',
      highlightBadge: '세계 유일의 단일 구조',
    },
    ja: {
      title: '比類なき構造：一本の石柱が支える蓮台仏堂',
      subtitle: '古代ベトナムの石工と木工技術が到達した最高到達点',
      content: '蓮花台の全構造は直径 1.2m の円柱形一枚石柱の上に鎮座しています。柱頭からは8本の巨大な鉄木片持ち梁が蓮の花びらのように放射状に広がり、補助柱なしで正方形の仏堂を支えています。',
      highlightBadge: '世界唯一の一柱構造',
    },
  },
  'block-4': {
    en: {
      title: 'Ten Centuries Chronicle of Dien Huu Pagoda',
      subtitle: 'Milestones weathered alongside the destiny of the nation',
      content: 'The One Pillar Pagoda has endured numerous restorations and historical trials to remain the immortal symbol of Hanoi.',
      timelineItems: [
        { year: '1049', event: 'Founding of Dien Huu Pagoda', detail: 'King Ly Thai Tong commissioned the shrine following his divine dream.' },
        { year: '1105', event: 'Expansion under King Ly Nhan Tong', detail: 'Bich Tri pond was excavated around the pagoda with carved arched bridges.' },
        { year: '1249', event: 'Tran Dynasty Renovation', detail: 'The Tran Dynasty maintained the shrine and the monthly royal ritual baths.' },
        { year: '1805', event: 'Nguyen Dynasty Restoration', detail: 'Realigned surrounding landscape within the Doi Can - Ba Dinh district.' },
        { year: '1954', event: 'Faithful Reconstruction', detail: 'Ministry of Culture and traditional master craftsmen reconstructed the pagoda to authentic Ly Dynasty architectural standards.' },
        { year: '2026', event: 'Viettoria Phygital Digitalization', detail: 'Project VIETTORIA reimagines the pagoda as a precision 3D physical collectible and sensory digital twin.' },
      ],
    },
    fr: {
      title: 'Chronique de Dix Siècles de la Pagode Dien Huu',
      subtitle: 'Grandes étapes au rythme du destin de la nation',
      content: 'La Pagode au Pilier Unique a traversé les siècles et les restaurations pour devenir le symbole éternel de Hanoï.',
      timelineItems: [
        { year: '1049', event: 'Fondation de la Pagode Dien Huu', detail: 'Le roi Ly Thai Tong ordonne la construction après son songe mystique.' },
        { year: '1105', event: 'Agrandissement sous Ly Nhan Tong', detail: 'Creusement du lac Bich Tri et ajout de ponts arqués ouvragés.' },
        { year: '1249', event: 'Rénovation sous les Tran', detail: 'La dynastie Tran perpétue le culte et les bains rituels mensuels.' },
        { year: '1805', event: 'Restauration des Nguyen', detail: 'Réaménagement du paysage environnant dans le quartier de Ba Dinh.' },
        { year: '1954', event: 'Reconstruction à l\'Identique', detail: 'Les maîtres artisans et le ministère restaurent fidèlement l\'architecture Ly.' },
        { year: '2026', event: 'Numérisation Phygital Viettoria', detail: 'Le projet VIETTORIA recrée le modèle 3D d\'atelier et le jumeau numérique interactif.' },
      ],
    },
    zh: {
      title: '十个世纪的延祐寺编年通志',
      subtitle: '与国家命运同呼吸的沧桑历史节点',
      content: '一柱寺历经岁月沧桑与重修考验，成为河内不朽的文脉象征。',
      timelineItems: [
        { year: '1049', event: '延祐寺始建', detail: '李太宗得观音菩萨神梦后敕命修造。' },
        { year: '1105', event: '李仁宗开凿扩建', detail: '增凿碧池围绕寺周，建雕花彩虹拱桥连通水殿。' },
        { year: '1249', event: '陈朝重修', detail: '陈朝延续香火，维持每月皇家浴佛大典。' },
        { year: '1805', event: '阮朝重整景观', detail: '重新规整河内巴亭队艮古迹群周边格局。' },
        { year: '1954', event: '原貌复建', detail: '文化部门与传统匠师按李朝规制高精度原样重建。' },
        { year: '2026', event: 'Viettoria 实体数字新生', detail: 'VIETTORIA 项目通过 3D 打印微缩实体与数字化平台赋予古迹当代生命。' },
      ],
    },
    ko: {
      title: '연우사의 10세기 역사 연표',
      subtitle: '민족의 운명과 함께 호흡해 온 역사의 주요 순간들',
      content: '일주사는 수많은 중수와 역사의 시련을 이겨내고 하노이의 불멸의 상징으로 자리 잡았습니다.',
      timelineItems: [
        { year: '1049', event: '연우사 창건', detail: '리 타이똥 황제가 길몽을 꾼 후 사원을 창건함.' },
        { year: '1105', event: '리 년똥 황제의 확장', detail: '사원 주변에 빅찌 연못을 조성하고 정교한 홍예교를 가설함.' },
        { year: '1249', event: '쩐 왕조의 중수', detail: '쩐 왕조에서 사원을 보수하고 정기적인 관불 의식을 거행함.' },
        { year: '1805', event: '응우옌 왕조의 조경 정비', detail: '바딘 지역 고적지 주변 경관을 재정비함.' },
        { year: '1954', event: '원형 복원', detail: '수도 해방 후 문화부와 전통 장인들이 리 왕조 양식으로 충실히 복원함.' },
        { year: '2026', event: 'Viettoria 피지컬 디지털화', detail: 'VIETTORIA 프로젝트를 통해 정밀 3D 피지컬 수집품 및 디지털 트윈으로 재탄생.' },
      ],
    },
    ja: {
      title: '延祐寺・十世紀に及ぶ年代記',
      subtitle: '国家の命運とともに歩んできた歴史的節目',
      content: '一柱寺は幾多の試練と修復を経て、ハノイの不滅の文化的象徴となりました。',
      timelineItems: [
        { year: '1049', event: '延祐寺の創建', detail: '李太宗が瑞夢を得て池中に一柱の寺を建立。' },
        { year: '1105', event: '李仁宗による拡張', detail: '周囲に碧池を掘り巡らせ、彫刻を施した太鼓橋を架橋。' },
        { year: '1249', event: '陳朝の修復', detail: '陳朝王室が寺院を補修し、月例の潅仏会を継承。' },
        { year: '1805', event: '阮朝による景観再編', detail: 'バーディン地区周辺の史跡環境を再整備。' },
        { year: '1954', event: '往時の姿に忠実復元', detail: '首都解放後、文化省と伝統名匠により李朝様式で精確に復元。' },
        { year: '2026', event: 'Viettoria フィジカルデジタル化', detail: 'VIETTORIA プロジェクトにより精密 3D 模型およびデジタルツインとして現代に再生。' },
      ],
    },
  },
  'block-5': {
    en: {
      title: 'Buddhist Philosophy & The Aspiration for Eternal Harmony',
      subtitle: 'The lotus rising unstained from mud symbolizes immaculate purity',
      content: 'In Dai Viet Buddhist culture, the lotus embodies purity transcending earthly turmoil. The One Pillar Pagoda floating serenely amidst water is not merely a sacred sanctuary, but an enduring declaration of cultural autonomy, modesty, and ancient wisdom.',
    },
    fr: {
      title: 'Philosophie Bouddhique & Vœu d\'Harmonie Éternelle',
      subtitle: 'Le lotus s\'élevant de la boue symbolise la pureté immaculée',
      content: 'Dans le bouddhisme du Dai Viet, le lotus incarne la pureté au-delà des tourments du monde.',
    },
    zh: {
      title: '佛理哲思与民族长存的崇高祈愿',
      subtitle: '出淤泥而不染的莲花象征无垢清净之境',
      content: '在大越佛教文化中，白莲象征超脱尘世繁扰的无上纯净。一柱寺凌波独立，不仅是一座虔诚的信仰殿堂，更是一千年前先祖对自主文化认同与深沉智慧的庄严宣言。',
    },
    ko: {
      title: '불교 철학과 민족의 영속을 향한 염원',
      subtitle: '진흙 속에서 피어나 물들지 않는 연꽃의 맑고 깨끗한 경지',
      content: '대월 불교 문화에서 연꽃은 세속의 번뇌를 초월한 순수함을 상징합니다. 고요한 호수 한가운데 솟아오른 일주사는 단순한 종교 시설을 넘어, 천년 전 선조들의 자율적인 문화적 정체성과 깊은 지혜를 증명하는 징표입니다.',
    },
    ja: {
      title: '仏教哲学と民族の永続への祈念',
      subtitle: '泥より出づるも染まらざる蓮花が象徴する無垢の清浄',
      content: '大越の仏教文化において、蓮花は現世の迷いを超越した清らかさの象徴です。水面に凛と立つ一柱寺は、単なる信仰の場にとどまらず、千年前の先人たちが掲げた独自の文化的アイデンティティと深遠な知恵の宣言です。',
    },
  },
};

// -------------------------------------------------------------
// 5. ARCHITECTURAL HOTSPOTS TRANSLATION DICTIONARY
// -------------------------------------------------------------
const HOTSPOT_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedHotspotFields>>> = {
  'tru-da': {
    en: {
      title: 'Monolithic Stone Column',
      category: 'CORE LOAD-BEARING STRUCTURE',
      detail: 'Two monolithic blue stones mortised with stone tenons (1.25m diameter, 4m height), standing erect in Linh Chieu pond supporting the entire sanctuary.',
    },
    fr: {
      title: 'Pilier Monolithique en Pierre',
      category: 'STRUCTURE PORTEUSE PRINCIPALE',
      detail: 'Deux blocs monolithiques de pierre bleue assemblés à tenons (diamètre 1.25m, hauteur 4m), dressés au milieu de l\'étang pour soutenir l\'ensemble du sanctuaire.',
    },
    zh: {
      title: '独石青石圆柱',
      category: '核心承重支撑构造',
      detail: '由两方整体青石以石榫严密卯接而成（直径 1.25 米，高 4 米），挺立于灵沼池心，独力承托全寺殿堂。',
    },
    ko: {
      title: '단일 청석 원통 기둥',
      category: '핵심 하중 지지 구조',
      detail: '석재 장부로 빈틈없이 맞물린 두 개의 일체형 청석(직경 1.25m, 높이 4m)으로, 연못 한가운데 우뚝 서서 사원 전체를 지탱합니다.',
    },
    ja: {
      title: '単一青石円柱',
      category: '中核荷重支持構造',
      detail: '石のホゾで強固に結合された2個の一枚青石（直径1.25m、高さ4m）。池の中央に直立し、仏堂の全荷重を一点で支えます。',
    },
  },
  'xa-nach': {
    en: {
      title: '8-Petal Ironwood Cantilever Brackets',
      category: 'DAI VIET TIMBER JOINERY PINNACLE',
      detail: 'Eight ironwood beams angled at 45 degrees mortised into the top of the stone pillar, absorbing seismic shocks and radiating outwards like blooming lotus petals.',
    },
    fr: {
      title: 'Consoles Rayonnantes en Bois de Fer',
      category: 'QUINTESSENCE DU BOIS DU DAI VIET',
      detail: 'Huit poutres en bois de fer inclinées à 45 degrés emboîtées au sommet du pilier, absorbant les secousses et s\'évasant comme des pétales de lotus.',
    },
    zh: {
      title: '八方铁杉木斜撑挑梁',
      category: '大越木构榫卯绝技',
      detail: '八根粗壮铁杉木挑梁呈 45 度角咬合入石柱顶端，抗震拉结，舒展如绽放之八瓣莲台。',
    },
    ko: {
      title: '8방향 철목 경사 외팔보',
      category: '대월 전통 목조 맞춤의 극치',
      detail: '석주 상단에 45도 각도로 맞물린 8개의 철목 캔틸레버 보로, 지진 충격을 흡수하며 연꽃잎처럼 펼쳐져 법당을 받칩니다.',
    },
    ja: {
      title: '八方アイアンウッド斜め持ち送り梁',
      category: '大越木組み継手の精華',
      detail: '石柱上部に45度の角度で噛み合わされた8本の鉄木製持ち送り梁。揺れを分散・吸収し、咲き開く蓮の花弁のように仏堂を受け止めます。',
    },
  },
  'gian-tho': {
    en: {
      title: 'Lotus Pavilion Altar Chamber',
      category: 'SACRED SANCTUARY SPACE',
      detail: 'Housing the golden Avalokiteshvara Bodhisattva seated upon a lacquer lotus throne, honoring the auspicious vision of King Ly Thai Tong in 1049.',
    },
    fr: {
      title: 'Sanctuaire du Pavillon du Lotus',
      category: 'ESPACE SPIRITUEL SACRÉ',
      detail: 'Abrite la statue dorée d\'Avalokiteshvara siégeant sur un trône de lotus laqué, rappelant le songe faste du roi Ly Thai Tong en 1049.',
    },
    zh: {
      title: '莲花台神圣佛龛殿堂',
      category: '崇高神圣信仰空间',
      detail: '内奉漆金观音菩萨端坐于朱漆莲花宝座之上，真实复现李太宗公元 1049 年所得之神圣吉兆。',
    },
    ko: {
      title: '연화대 본당 법당',
      category: '신성한 종교적 영성 공간',
      detail: '옻칠 연화대에 모셔진 금동 관음보살상을 봉안하여 1049년 리 타이똥 황제의 성스러운 꿈을 생생히 재현합니다.',
    },
    ja: {
      title: '蓮花台・本堂内陣',
      category: '神聖なる祈りの空間',
      detail: '漆塗りの蓮台に坐す金色の観音菩薩像を安置し、1049年に李太宗が見た吉兆の瑞夢を今に伝えています。',
    },
  },
  'mai-cong': {
    en: {
      title: 'Curved Eaves & Handcrafted Fish-Scale Tiles',
      category: 'LY DYNASTY ROOF ARTISTRY',
      detail: 'Four gracefully sweeping roof corners clad in artisanal clay fish-scale tiles, ridge decorated with lotus rosettes and Ly Dynasty cloud motifs.',
    },
    fr: {
      title: 'Arêtes Relevées & Tuiles en Écailles',
      category: 'ART DE LA TOITURE DYNASTIE LY',
      detail: 'Quatre arêtes de toiture incurvées avec légèreté, couvertes de tuiles traditionnelles en écaille de poisson avec motifs de lotus et nuages stylisés.',
    },
    zh: {
      title: '飞檐翘角与手工鱼鳞土瓦',
      category: '李朝屋面飞檐雕塑美学',
      detail: '屋面四角翼然飞翘，铺设古法烧造之红泥鱼鳞瓦，正脊堆塑莲花化生与李朝标志性翻卷卷云纹。',
    },
    ko: {
      title: '날렵한 처마 곡선과 수제 어비와',
      category: '리 왕조 지붕 조각 예술',
      detail: '네 모서리가 경쾌하게 솟아오른 지붕선, 수제 어비와(물고기 비늘 기와), 그리고 연꽃과 리 왕조 구름 문양으로 장식된 용마루.',
    },
    ja: {
      title: '反り屋根の軒先と手作りの魚鱗瓦',
      category: '李朝の屋根彫刻美学',
      detail: '軽やかに反り上がった四隅の軒先、伝統的な粘土の魚鱗瓦、蓮華紋と李朝特有の優美な雲紋で飾られた大棟。',
    },
  },
};

// -------------------------------------------------------------
// LOCALIZATION RESOLVER FUNCTIONS
// -------------------------------------------------------------

/**
 * Localizes a single Collection object based on current language
 */
export function getLocalizedCollection<T extends Collection | Partial<Collection>>(
  collection: T,
  language: LanguageCode
): T {
  if (!collection || language === 'vi') return collection;
  const key = collection.slug || collection.code || collection.id || '';
  const tr = COLLECTION_TRANSLATIONS[key]?.[language];
  if (!tr) return collection;

  return {
    ...collection,
    name: tr.name || collection.name,
    description: tr.description || collection.description,
  };
}

/**
 * Localizes a list of Collections
 */
export function getLocalizedCollections(
  collections: Collection[],
  language: LanguageCode
): Collection[] {
  if (language === 'vi') return collections;
  return collections.map((col) => getLocalizedCollection(col, language));
}

/**
 * Localizes a single Product object based on current language
 */
export function getLocalizedProduct<T extends Product | Partial<Product>>(
  product: T,
  language: LanguageCode
): T {
  if (!product || language === 'vi') return product;
  const key = product.slug || product.code || product.id || '';
  const tr = PRODUCT_TRANSLATIONS[key]?.[language];
  if (!tr) return product;

  const updated: T = {
    ...product,
    name: tr.name || product.name,
    subName: tr.subName || product.subName,
    shortDescription: tr.shortDescription || product.shortDescription,
    location: tr.location || product.location,
    epoch: tr.epoch || product.epoch,
  };

  if (product.modelSpecs && (tr.material || tr.finishing)) {
    updated.modelSpecs = {
      ...product.modelSpecs,
      material: tr.material || product.modelSpecs.material,
      finishing: tr.finishing || product.modelSpecs.finishing,
    };
  }

  if (product.audioGuide) {
    const langAudioUrl = product.audioGuide.audioUrls?.[language];
    updated.audioGuide = {
      ...product.audioGuide,
      title: tr.audioGuideTitle || product.audioGuide.title,
      transcript: tr.audioGuideTranscript || product.audioGuide.transcript,
      narrator: tr.audioGuideNarrator || product.audioGuide.narrator,
      duration: tr.audioGuideDuration || product.audioGuide.duration,
      audioUrl: langAudioUrl || product.audioGuide.audioUrl,
    };
  }

  if (product.collection) {
    updated.collection = getLocalizedCollection(product.collection, language);
  }

  if (product.storyBlocks && product.storyBlocks.length > 0) {
    updated.storyBlocks = product.storyBlocks.map((b) => getLocalizedStoryBlock(b, language));
  }

  return updated;
}

/**
 * Localizes a list of Products
 */
export function getLocalizedProducts(
  products: Product[],
  language: LanguageCode
): Product[] {
  if (language === 'vi') return products;
  return products.map((prod) => getLocalizedProduct(prod, language));
}

/**
 * Localizes a single BlogPost object
 */
export function getLocalizedBlog<T extends BlogPost | Partial<BlogPost>>(
  blog: T,
  language: LanguageCode
): T {
  if (!blog || language === 'vi') return blog;
  const key = blog.slug || blog.id || '';
  const tr = BLOG_TRANSLATIONS[key]?.[language];
  if (!tr) return blog;

  return {
    ...blog,
    title: tr.title || blog.title,
    excerpt: tr.excerpt || blog.excerpt,
    content: tr.content || blog.content,
    category: tr.category || blog.category,
    readTime: tr.readTime || blog.readTime,
    author: tr.author || blog.author,
  };
}

/**
 * Localizes a list of BlogPosts
 */
export function getLocalizedBlogs(
  blogs: BlogPost[],
  language: LanguageCode
): BlogPost[] {
  if (language === 'vi') return blogs;
  return blogs.map((blog) => getLocalizedBlog(blog, language));
}

/**
 * Localizes a single StoryBlock object
 */
export function getLocalizedStoryBlock<T extends StoryBlock | Partial<StoryBlock>>(
  block: T,
  language: LanguageCode
): T {
  if (!block || language === 'vi') return block;
  const key = block.id || '';
  const tr = STORY_BLOCK_TRANSLATIONS[key]?.[language];
  if (!tr) return block;

  return {
    ...block,
    title: tr.title || block.title,
    subtitle: tr.subtitle || block.subtitle,
    content: tr.content || block.content,
    mediaCaption: tr.mediaCaption || block.mediaCaption,
    highlightBadge: tr.highlightBadge || block.highlightBadge,
    timelineItems: tr.timelineItems || block.timelineItems,
  };
}

/**
 * Localizes an ArchitecturalHotspot
 */
export function getLocalizedHotspot(
  hotspot: ArchitecturalHotspot,
  language: LanguageCode
): ArchitecturalHotspot {
  if (language === 'vi') return hotspot;
  const tr = HOTSPOT_TRANSLATIONS[hotspot.id]?.[language];
  if (!tr) return hotspot;

  return {
    ...hotspot,
    title: tr.title || hotspot.title,
    shortTitle: tr.shortTitle || tr.title || hotspot.shortTitle || hotspot.title,
    category: tr.category || hotspot.category,
    detail: tr.detail || hotspot.detail,
    shortDesc: tr.shortDesc || hotspot.shortDesc || tr.detail || hotspot.detail,
  };
}

/**
 * Localizes a list of Hotspots
 */
export function getLocalizedHotspots(
  hotspots: ArchitecturalHotspot[],
  language: LanguageCode
): ArchitecturalHotspot[] {
  if (language === 'vi') return hotspots;
  return hotspots.map((h) => getLocalizedHotspot(h, language));
}
