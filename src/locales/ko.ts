import type { TranslationSchema } from './vi';

export const ko: TranslationSchema = {
  // Navigation & Header
  nav: {
    home: '홈',
    collections: '컬렉션',
    products: '유산 작품',
    map: '유산 지도',
    blogs: '문화 인사이트',
    about: 'Viettoria 소개',
    scanQr: 'QR 코드 스캔',
    cmsPortal: 'CMS 관리자 포털',
    menu: '메뉴',
    close: '닫기',
  },

  // Header & Brand
  header: {
    brandSubtitle: '베트남 3D 건축 유산 디지털 재현 플랫폼',
    scanQrTitle: '모델 베이스 인증 씰의 QR 스캐너 열기',
    openNavigation: '내비게이션 메뉴 열기',
    selectLanguage: '언어 선택',
  },

  // Common Actions & Labels
  common: {
    viewAll: '전체 보기',
    exploreNow: '지금 탐험하기',
    exploreMonument: '건축물 살펴보기',
    learnMore: '상세 정보',
    back: '돌아가기',
    search: '건축 유산, 역사적 명소 검색...',
    loading: '유산 아카이브 로딩 중...',
    all: '전체',
    north: '북부 지역',
    central: '중부 지역',
    south: '남부 지역',
    monumentCount: '개 작품',
    share: '유산 공유하기',
    photoLibrary: '사진 갤러리',
    dynasty: '역사 왕조',
    location: '위치',
    scale: '축척',
    material: '주조 소재',
    parts: '부품 개수',
    dimensions: '규격 치수',
    weight: '무게',
    finishing: '표면 마감',
    status: '상태',
  },

  // Home Page
  home: {
    heroTitleLine1: '문명의 숨결',
    heroTitleLine2: '베트남의 문화유산',
    heroSubtitle: '역사적 내러티브와 다감각 3D 피지컬-디지털(Phygital) 수집품을 통해 베트남의 박물관, 유적지, 문화적 기억에 새로운 생명을 불어넣습니다.',
    heroCtaCollection: '컬렉션 탐색',
    heroCtaStory: 'Viettoria 이야기',
    heroBadge1: '정밀 건축 모형',
    heroBadge2: '문화유산 이야기',
    heroBadge3: '3D 인터랙티브 체험',
    scrollDown: '스크롤하여 탐색하기',

    // Showcase Section
    scrollyEyebrow: '베트남 천년 문화유산으로의 여정',
    scrollyHeading: '하나의 건축물, 살아 숨 쉬는 역사',
    scrollyDesc: '정밀하게 디지털화된 3D 모형을 감상하고, 각 전통 건축 랜드마크에 담긴 짜맞춤 목구조와 역사적 예술성을 만나보세요.',
    dragToRotate: '3D 모형 · 드래그하여 회전',
    previewVideo: '미리보기 영상',
    previewPhoto: '실물 사진',
    loadingModel: '3D 모형 불러오는 중...',
    stopVideo: '영상 정지',
    playVideo: '모션 재생',
    selectMonument: '살펴볼 건축물 선택',

    // Collections Section
    collectionEyebrow: '역사적 챕터별 엄선',
    collectionHeading: '헤리티지 컬렉션',
    exploreCollection: '컬렉션 탐색',

    // Architectural Map Spotlight
    mapEyebrow: '천년 문헌의 발자취',
    mapHeading: '인터랙티브 유산 지도',
    mapDesc: '베트남 북부, 중부, 남부를 아우르는 문화적 상징들의 지리적 좌표, 왕조 역사 및 건축 도면을 조사해보세요.',
    mapCta: '유산 지도 열기',

    // Manifesto & Values
    manifestoQuote: '우리는 단순히 건축 형태를 3D 프린팅하는 데 그치지 않습니다. 조상의 얼을 되살리고, 모든 물리적 질감과 디지털 데이터에 문화적 자긍심을 새깁니다.',
    manifestoAuthor: 'VIETTORIA 아틀리에 · 피지컬 헤리티지',
  },

  // Product Detail Page (Heritage Explorer)
  product: {
    code: '작품 코드',
    collection: '컬렉션',
    craftingSpecs: '제작 기술 사양',
    specHeight: '높이',
    specWidth: '너비',
    specWeight: '무게',
    specScale: '축소 비율',
    specMaterial: '핵심 소재',
    specParts: '결합 부재 수',
    specFinishing: '표면 처리 기법',

    // 3D & Viewer Tabs
    tab3d: '3D 인터랙티브 모형',
    tabBlueprint: '2.5D 기술 도면',
    tabPhotos: '현장 실사 사진',
    zoomDetail: '구조 부재 정밀 조사',
    fullscreen: '전체 화면',
    loading3d: 'Draco 압축 3D 모형 로딩 중...',
    view3dHint: '마우스나 터치 제스처를 사용하여 360° 회전하고 전통 기와와 결구 디테일을 확대해 보세요',

    // Audio Guide
    audioTitle: '오디오 가이드 및 역사 해설',
    audioDuration: '재생 시간',
    audioNarrator: '해설자',
    audioTranscript: '해설 전문 텍스트',
    playAudio: '오디오 해설 듣기',
    pauseAudio: '일시정지',

    // Story Blocks
    storyHeading: '심층 고증 아카이브 & 역사 연표',
    storySubheading: '역사적 기원, 전통 결구법, 영구한 동양 문화의 상징성을 탐구합니다',
    timelineTitle: '천년의 변천사',
    verifiedHeritage: 'Viettoria 피지컬 공식 인증',
    certificateId: '고유 에디션 넘버',
  },

  // Map Page
  mapPage: {
    title: '베트남 건축 유산 지리정보 지도',
    subtitle: '고대 전통 건축 걸작들의 좌표와 역사를 연결하는 탐색 시스템',
    searchPlaceholder: '건축물 명칭, 지역 또는 왕조 검색...',
    filterRegion: '지역 구분:',
    filterAll: '전국 모든 지역',
    selectedMonument: '선택된 유산',
    viewDetails: '정밀 탐색',
    noResults: '조건에 부합하는 건축 유산이 없습니다.',
    mode3D: '3D 틸트 원근각',
    mode2D: '2D 평면 지도',
    pedestal3D: '3D 디지털 트윈',
    satelliteView: '위성 지도',
    standardView: '일반 지도',
    allVietnam: '베트남 전역',
    dragToRotate: '360° 드래그 회전 · 스크롤 확대',
    autoRotate: '자동 회전',
    minimize: '축소',
    expand: '확대',
    exploreMonument3D: '전체 3D 부재 고증 모드 진입',
  },

  // Collections Page
  collectionsPage: {
    title: '역사 시대별 컬렉션',
    subtitle: '찬란했던 왕조와 문화적 시대를 대표하도록 복원된 건축 모형 시리즈',
    worksCount: '개 작품',
  },

  // Blogs & Culture Page
  blogsPage: {
    title: '문화적 시각 & 건축 고증',
    subtitle: '전통 목수 결구법, 석조 조각 및 역사적 기억에 대한 심층 에세이',
    readTime: '분 분량',
    author: '작성자',
  },

  // QR Resolver
  qr: {
    resolvingTitle: '유산 코드 진위 인증 중',
    resolvingSub: 'Viettoria 피지컬 생태계 연결 중...',
    inputPlaceholder: '라벨 씰 코드 입력 (예: VT-HN-001)...',
    btnVerify: '작품 인증하기',
    notFound: 'Viettoria 시스템에 등록되지 않은 QR 코드입니다.',
  },

  // 3D Hotspots & Architectural Inspection
  hotspots: {
    toggleTitle: '구조 부재 고증',
    toggleActive: '고증 포인트 숨기기',
    toggleInactive: '고증 포인트 보기',
    pointsCount: '개 고증 포인트',
    focusCamera: '포커스 뷰',
    resetCamera: '전체 뷰 복귀',
    inspectHint: '모형 위의 황금 마커를 탭하거나 클릭하여 독창적인 건축 결구와 부재를 관찰하세요',
    close: '디테일 닫기',
    fullscreenMode: '3D 전체 파노라마 관찰 모드',
  },

  // Footer
  footer: {
    brandDesc: '베트남의 건축 명작을 정밀 3D 프린팅 수집품과 다감각 디지털 플랫폼으로 재현하여, 국내외 모든 세대에게 찬란한 역사를 전합니다.',
    monumentsCol: '대표 유산 작품',
    atelierCol: 'VIETTORIA',
    connectCol: '문의하기',
    contactEmail: 'contact@viettoria.vn',
    locationHanoi: '베트남 하노이',
    support247: '24/7 방문자 지원',
    otherMonuments: '기타 작품',
    copyright: '© 2026 VIETTORIA. 뿌리를 기리며 — 베트남의 아름다움을 세계로.',
    tagline: '미니어처 건축 수집품과 베트남 문화유산 서사',
    languageLabel: '표시 언어:',
  },
};
