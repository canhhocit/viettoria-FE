import type { TranslationSchema } from './vi';

export const zh: TranslationSchema = {
  // Navigation & Header
  nav: {
    home: '首页',
    collections: '典藏系列',
    products: '遗产作品',
    map: '文化地图',
    blogs: '学术视角',
    about: '关于 Viettoria',
    scanQr: '扫描 QR 码',
    cmsPortal: 'CMS 管理后台',
    menu: '菜单',
    close: '关闭',
  },

  // Header & Brand
  header: {
    brandSubtitle: '越南三维建筑遗产数字化平台',
    scanQrTitle: '扫描模型底座的防伪认证 QR 码',
    openNavigation: '打开导航菜单',
    selectLanguage: '选择语言',
  },

  // Common Actions & Labels
  common: {
    viewAll: '查看全部',
    exploreNow: '立即探索',
    exploreMonument: '探索古迹',
    learnMore: '了解详情',
    back: '返回',
    search: '搜索古迹、历史地标...',
    loading: '正在载入遗产档案...',
    all: '全部',
    north: '北部地区',
    central: '中部地区',
    south: '南部地区',
    monumentCount: '件作品',
    share: '分享遗产',
    photoLibrary: '图片档案',
    dynasty: '历史朝代',
    location: '地理位置',
    scale: '缩放比例',
    material: '铸造材质',
    parts: '构件数量',
    dimensions: '规格尺寸',
    weight: '重量',
    finishing: '表面工艺',
    status: '状态',
  },

  // Home Page
  home: {
    heroTitleLine1: '越境文明',
    heroTitleLine2: '越南珍萃遗产',
    heroSubtitle: '融合历史故事叙述与多感官三维物理数字藏品，让博物馆、名胜古迹与越南文化记忆焕发生机。',
    heroCtaCollection: '探索典藏系列',
    heroCtaStory: 'Viettoria 的故事',
    heroBadge1: '微缩建筑模型',
    heroBadge2: '文化遗产叙事',
    heroBadge3: '3D 互动体验',
    scrollDown: '向下滚动以探索',

    // Showcase Section
    scrollyEyebrow: '漫游越南千年文化遗产',
    scrollyHeading: '一处古建，一段流芳历史',
    scrollyDesc: '鉴赏高精度数字化 3D 模型，揭示每座东方文宪地标背后的榫卯构造与建筑哲思。',
    dragToRotate: '3D 模型 · 拖拽以旋转',
    previewVideo: '视频预览',
    previewPhoto: '实拍预览',
    loadingModel: '正在载入 3D 模型...',
    stopVideo: '停止播放',
    playVideo: '观看动态预览',
    selectMonument: '选择当前查看的古迹',

    // Collections Section
    collectionEyebrow: '按历史篇章探寻',
    collectionHeading: '文化遗产典藏系列',
    exploreCollection: '探索此系列',

    // Architectural Map Spotlight
    mapEyebrow: '千载文宪历程',
    mapHeading: '交互式建筑遗产地图',
    mapDesc: '查阅贯穿越南北中南三地的地理坐标、历史朝代与古建筑形制。',
    mapCta: '打开遗产地图',

    // Manifesto & Values
    manifestoQuote: '我们不仅是 3D 打印建筑构件；我们是在唤醒河山之灵，将千年文明的自豪铭刻于每一寸物理质感与数字脉络之中。',
    manifestoAuthor: 'VIETTORIA 艺术工坊 · 实体数字遗产',
  },

  // Product Detail Page (Heritage Explorer)
  product: {
    code: '作品编号',
    collection: '所属系列',
    craftingSpecs: '工艺参数规范',
    specHeight: '高度',
    specWidth: '宽度',
    specWeight: '净重',
    specScale: '雕刻比例',
    specMaterial: '核心材料',
    specParts: '拼装榫卯件数',
    specFinishing: '表面精饰工艺',

    // 3D & Viewer Tabs
    tab3d: '3D 交互模型',
    tabBlueprint: '2.5D 结构透视图',
    tabPhotos: '实地考证图像',
    zoomDetail: '检视榫卯构件',
    fullscreen: '全屏模式',
    loading3d: '正在加载 Draco 压缩 3D 模型...',
    view3dHint: '使用鼠标或手指触控 360° 旋转，滚轮放大观察斗拱与榫卯细节',

    // Audio Guide
    audioTitle: '语音导览与历史解说',
    audioDuration: '时长',
    audioNarrator: '讲述者',
    audioTranscript: '导览解说词文本',
    playAudio: '聆听历史解说',
    pauseAudio: '暂停',

    // Story Blocks
    storyHeading: '考证档案与千年历史沿革',
    storySubheading: '探索历史发端、传统木构技艺与历久弥新的东方文化意蕴',
    timelineTitle: '沧桑演变历程',
    verifiedHeritage: 'Viettoria 实体数字官方认证',
    certificateId: '藏品独有标识符',
  },

  // Map Page
  mapPage: {
    title: '越南建筑遗产地理定位系统',
    subtitle: '古迹空间分布与历史朝代全景三维标定系统',
    searchPlaceholder: '输入古建名称、地域或朝代进行搜索...',
    filterRegion: '地理大区：',
    filterAll: '全国各大区',
    selectedMonument: '当前选中古迹',
    viewDetails: '深入考证',
    noResults: '未找到符合筛选条件的建筑遗产。',
    mode3D: '3D 倾斜视角',
    mode2D: '2D 平面地图',
    pedestal3D: '3D 孪生展台',
    satelliteView: '真实卫星',
    standardView: '矢量地图',
    allVietnam: '全境总览',
    dragToRotate: '拖拽旋转 360° · 滚轮缩放',
    autoRotate: '自动旋转',
    minimize: '收起',
    expand: '展开',
    exploreMonument3D: '进入完整 3D 构件考察模式',
  },

  // Collections Page
  collectionsPage: {
    title: '历史时期典藏系列',
    subtitle: '按文化朝代与历史断代精心重构的建筑模型系列',
    worksCount: '件作品',
  },

  // Blogs & Culture Page
  blogsPage: {
    title: '遗产学思与营造考证',
    subtitle: '传统木构榫卯、石雕艺术与建筑保护的深度学术札记',
    readTime: '分钟阅读',
    author: '作者',
  },

  // QR Resolver
  qr: {
    resolvingTitle: '正在鉴真遗产防伪标码',
    resolvingSub: '正在接入 Viettoria 实体数字生态...',
    inputPlaceholder: '输入防伪标签码（如 VT-HN-001）...',
    btnVerify: '认证藏品真伪',
    notFound: '在 Viettoria 遗产系统中未检索到该二维码记录。',
  },

  // 3D Hotspots & Architectural Inspection
  hotspots: {
    toggleTitle: '构件考证',
    toggleActive: '隐藏考证点',
    toggleInactive: '显示考证点',
    pointsCount: '个考证节点',
    focusCamera: '特写视角',
    resetCamera: '全景视角',
    inspectHint: '轻触或点击模型上的金色标记点，即可深入剖析独特的营造法式与细部构件',
    close: '关闭详情',
    fullscreenMode: '3D 全景研学模式',
  },

  // Footer
  footer: {
    brandDesc: '以精工 3D 打印微缩模型结合多感官数字化互动，重构越南代表性建筑经典，让千年文宪走进全球游客与文化爱好者的生活。',
    monumentsCol: '遗产代表作',
    atelierCol: 'VIETTORIA 工坊',
    connectCol: '联络我们',
    contactEmail: 'contact@viettoria.vn',
    locationHanoi: '越南河内市',
    support247: '24/7 全天候研学支持',
    otherMonuments: '其他作品',
    copyright: '© 2026 VIETTORIA. 铭记文脉之根 — 弘扬越南珍萃。',
    tagline: '微缩建筑典藏与越南文化遗产叙事',
    languageLabel: '显示语言：',
  },
};
