import type { TranslationSchema } from './vi';

export const ja: TranslationSchema = {
  // Navigation & Header
  nav: {
    home: 'ホーム',
    collections: 'コレクション',
    products: '遺産作品',
    map: '遺産マップ',
    blogs: '文化探訪',
    about: 'Viettoria について',
    scanQr: 'QR コードスキャン',
    cmsPortal: 'CMS 管理ポータル',
    menu: 'メニュー',
    close: '閉じる',
  },

  // Header & Brand
  header: {
    brandSubtitle: 'ベトナム 3D 建築遺産デジタル再現プラットフォーム',
    scanQrTitle: '模型台座の認証シール用 QR スキャナーを開く',
    openNavigation: 'ナビゲーションメニューを開く',
    selectLanguage: '言語を選択',
  },

  // Common Actions & Labels
  common: {
    viewAll: 'すべて見る',
    exploreNow: '今すぐ体験',
    exploreMonument: '建造物を探訪',
    learnMore: '詳細を見る',
    back: '戻る',
    search: '建築遺産や歴史的建造物を検索...',
    loading: '遺産アーカイブを読み込み中...',
    all: 'すべて',
    north: '北部地域',
    central: '中部地域',
    south: '南部地域',
    monumentCount: '件の作品',
    share: '遺産を共有',
    photoLibrary: '写真ギャラリー',
    dynasty: '歴史的王朝',
    location: '所在地',
    scale: '縮尺',
    material: '鋳造素材',
    parts: '結合パーツ数',
    dimensions: '寸法',
    weight: '重量',
    finishing: '表面仕上げ',
    status: '状態',
  },

  // Home Page
  home: {
    heroTitleLine1: '悠久の文明',
    heroTitleLine2: 'ベトナムの至宝遺産',
    heroSubtitle: '歴史の物語と五感で楽しむ 3D フィジカル・デジタル（Phygital）コレクションを通じて、博物館や古跡、ベトナムの文化的記憶に新たな命を吹き込みます。',
    heroCtaCollection: 'コレクションを探訪',
    heroCtaStory: 'Viettoria の物語',
    heroBadge1: '精密建築模型',
    heroBadge2: '遺産ナラティブ',
    heroBadge3: '3D インタラクティブ体験',
    scrollDown: 'スクロールして探訪',

    // Showcase Section
    scrollyEyebrow: 'ベトナム千年の文化遺産を巡る',
    scrollyHeading: '一つの古建築、息づく歴史の物語',
    scrollyDesc: '高精度にデジタル化された 3D 模型を鑑賞し、東洋の伝統建築の背後にある仕口・継手の木組み技術と美学を探求してください。',
    dragToRotate: '3D 模型 · ドラッグして回転',
    previewVideo: 'プレビュー動画',
    previewPhoto: '実物写真',
    loadingModel: '3D モデルを読み込み中...',
    stopVideo: '動画停止',
    playVideo: '動画再生',
    selectMonument: '鑑賞する建造物を選択',

    // Collections Section
    collectionEyebrow: '歴史の章ごとに厳選',
    collectionHeading: 'ヘリテージ・コレクション',
    exploreCollection: 'このコレクションを探訪',

    // Architectural Map Spotlight
    mapEyebrow: '千年の文憲の歩み',
    mapHeading: 'インタラクティブ遺産マップ',
    mapDesc: 'ベトナム北部・中部・南部に広がる文化的象徴の地理座標、歴代王朝、伝統建築図面を調査できます。',
    mapCta: '遺産マップを開く',

    // Manifesto & Values
    manifestoQuote: '私たちは単に建築を 3D プリントしているのではありません。祖先の魂を呼び覚まし、あらゆる物理的質感とデジタルデータに文化の誇りを刻み込んでいます。',
    manifestoAuthor: 'VIETTORIA アトリエ · フィジカル遺産',
  },

  // Product Detail Page (Heritage Explorer)
  product: {
    code: '作品コード',
    collection: 'コレクション',
    craftingSpecs: '製作技術仕様',
    specHeight: '高さ',
    specWidth: '幅',
    specWeight: '重量',
    specScale: '縮小比率',
    specMaterial: '中核素材',
    specParts: '組み立て部材数',
    specFinishing: '表面仕上げ技法',

    // 3D & Viewer Tabs
    tab3d: '3D インタラクティブモデル',
    tabBlueprint: '2.5D 構造図面',
    tabPhotos: '現地調査写真',
    zoomDetail: '木組み構造を観察',
    fullscreen: '全画面表示',
    loading3d: 'Draco 圧縮 3D モデルを読み込み中...',
    view3dHint: 'マウスや指の操作で 360° 回転させ、屋根瓦や継手のディテールを拡大して観察できます',

    // Audio Guide
    audioTitle: '音声ガイド・歴史解説',
    audioDuration: '再生時間',
    audioNarrator: '解説ナレーター',
    audioTranscript: '解説テキスト全文',
    playAudio: '音声解説を聞く',
    pauseAudio: '一時停止',

    // Story Blocks
    storyHeading: '詳細考証アーカイブ & 歴史年表',
    storySubheading: '歴史の起源、伝統的な木造工法、そして永劫に受け継がれる東洋の象徴性を探求します',
    timelineTitle: '千年の変遷史',
    verifiedHeritage: 'Viettoria フィジカル公式認定',
    certificateId: '作品固有識別 ID',
  },

  // Map Page
  mapPage: {
    title: 'ベトナム建築遺産・地理測位マップ',
    subtitle: '歴史的建造物の座標と歴代王朝を結ぶ空間探索システム',
    searchPlaceholder: '建造物名、地域、王朝名で検索...',
    filterRegion: '地域区分：',
    filterAll: '全国すべての地域',
    selectedMonument: '選択された遺産',
    viewDetails: '詳細を探訪',
    noResults: '条件に一致する建築遺産が見つかりませんでした。',
    mode3D: '3D 傾斜アングル',
    mode2D: '2D 平面マップ',
    pedestal3D: '3D デジタルツイン台座',
    satelliteView: '衛星写真',
    standardView: '標準地図',
    allVietnam: 'ベトナム全土',
    dragToRotate: '360° ドラッグ回転 · スクロール拡大',
    autoRotate: '自動回転',
    minimize: '折りたたむ',
    expand: '展開する',
    exploreMonument3D: '完全 3D 構造観察モードへ',
  },

  // Collections Page
  collectionsPage: {
    title: '時代別ヘリテージ・コレクション',
    subtitle: '歴代の黄金期や王朝文化を象徴する再現建築模型シリーズ',
    worksCount: '件の作品',
  },

  // Blogs & Culture Page
  blogsPage: {
    title: '文化探訪 & 建築考証',
    subtitle: '伝統的な木工継手、石造彫刻、歴史的記憶に迫る専門論考',
    readTime: '分で読める',
    author: '著者',
  },

  // QR Resolver
  qr: {
    resolvingTitle: '遺産認証コードを照合中',
    resolvingSub: 'Viettoria エコシステムに接続しています...',
    inputPlaceholder: 'シールコードを入力（例：VT-HN-001）...',
    btnVerify: '真贋を鑑定する',
    notFound: 'この QR コードは Viettoria システムに登録されていません。',
  },

  // 3D Hotspots & Architectural Inspection
  hotspots: {
    toggleTitle: '構造部材の考証',
    toggleActive: '注目点を非表示',
    toggleInactive: '注目点を表示',
    pointsCount: '箇所の考証ポイント',
    focusCamera: 'フォーカス視点',
    resetCamera: '全景視点に戻す',
    inspectHint: '模型上の金色のマーカーをタップまたはクリックして、独自の建築構法を観察できます',
    close: '詳細を閉じる',
    fullscreenMode: '3D 全景パノラマ観察モード',
  },

  // Footer
  footer: {
    brandDesc: 'ベトナムの建築傑作を高精度 3D プリント模型と多感覚デジタル空間で再現し、国内外のあらゆる世代へ千年の歴史を届けます。',
    monumentsCol: '代表的な遺産作品',
    atelierCol: 'VIETTORIA アトリエ',
    connectCol: 'お問い合わせ',
    contactEmail: 'contact@viettoria.vn',
    locationHanoi: 'ベトナム ハノイ市',
    support247: '24/7 見学者サポート',
    otherMonuments: 'その他の作品',
    copyright: '© 2026 VIETTORIA. 悠久のルーツを胸に — ベトナムの美を世界へ。',
    tagline: 'ミニチュア建築コレクションとベトナム文化遺産の物語',
    languageLabel: '表示言語：',
  },
};
