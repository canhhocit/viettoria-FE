import type { TranslationSchema } from './vi';

export const fr: TranslationSchema = {
  // Navigation & Header
  nav: {
    home: 'Accueil',
    collections: 'Collections',
    products: 'Œuvres du Patrimoine',
    map: 'Carte du Patrimoine',
    blogs: 'Perspectives',
    about: 'À propos',
    scanQr: 'Scanner QR',
    cmsPortal: 'Portail CMS',
    menu: 'Menu',
    close: 'Fermer',
  },

  // Header & Brand
  header: {
    brandSubtitle: 'Plateforme de Digitalisation du Patrimoine Architectural 3D',
    scanQrTitle: 'Ouvrir le lecteur QR du sceau de la maquette',
    openNavigation: 'Ouvrir le menu de navigation',
    selectLanguage: 'Choisir la langue',
  },

  // Common Actions & Labels
  common: {
    viewAll: 'Voir tout',
    exploreNow: 'Découvrir',
    exploreMonument: 'Explorer le monument',
    learnMore: 'En savoir plus',
    back: 'Retour',
    search: 'Rechercher...',
    loading: 'Chargement des archives...',
    all: 'Tous',
    north: 'Région du Nord',
    central: 'Région du Centre',
    south: 'Région du Sud',
    monumentCount: 'œuvres',
    share: 'Partager le patrimoine',
    photoLibrary: 'Galerie photos',
    dynasty: 'Dynastie / Époque',
    location: 'Emplacement',
    scale: 'Échelle',
    material: 'Matériau',
    parts: 'Composants',
    dimensions: 'Dimensions',
    weight: 'Poids',
    finishing: 'Finition',
    status: 'Statut',
  },

  // Home Page
  home: {
    heroTitleLine1: 'Civilisation du',
    heroTitleLine2: 'Patrimoine Vietnamien',
    heroSubtitle: 'Un voyage numérique insufflant vie aux musées, monuments et mémoires culturelles du Vietnam à travers des récits historiques et des modèles 3D.',
    heroCtaCollection: 'Explorer les collections',
    heroCtaStory: "L'histoire de Viettoria",
    heroBadge1: 'Maquettes architecturales',
    heroBadge2: 'Récits du patrimoine',
    heroBadge3: 'Expérience 3D',
    scrollDown: 'Faites défiler pour explorer',

    // Scrollytelling Section
    scrollyEyebrow: 'Un tour du patrimoine vietnamien',
    scrollyHeading: 'Chaque édifice, une histoire vivante',
    scrollyDesc: 'Faites défiler pour admirer les modèles 3D interactifs et percer les secrets de l’architecture ancestrale.',
    dragToRotate: 'Modèle 3D · Glisser pour pivoter',
    previewVideo: 'Vidéo aperçu',
    previewPhoto: 'Photo aperçu',
    loadingModel: 'Chargement du modèle 3D...',
    stopVideo: 'Arrêter la vidéo',
    playVideo: 'Lancer l’animation',
    selectMonument: 'Sélectionner l’édifice',

    // Collections Section
    collectionEyebrow: 'Sélectionné selon les chapitres d’histoire',
    collectionHeading: 'Collections du Patrimoine',
    exploreCollection: 'Explorer la collection',

    // Architectural Map Spotlight
    mapEyebrow: 'Mille ans d’histoire et d’art',
    mapHeading: 'Carte Interactive du Patrimoine',
    mapDesc: 'Explorez les coordonnées géographiques, les dynasties et les plans architecturaux à travers le Nord, le Centre et le Sud du Vietnam.',
    mapCta: 'Ouvrir la Carte du Patrimoine',

    // Manifesto & Values
    manifestoQuote: 'Nous n’imprimons pas de simples volumes en 3D; nous ravivons l’âme ancestrale, gravant la fierté culturelle dans chaque texture physique et donnée numérisée.',
    manifestoAuthor: 'ATELIER VIETTORIA · PATRIMOINE PHYGITAL',
  },

  // Product Detail Page (Heritage Explorer)
  product: {
    code: 'Code de catalogue',
    collection: 'Collection',
    craftingSpecs: 'Spécifications de Fabrication',
    specHeight: 'Hauteur',
    specWidth: 'Largeur',
    specWeight: 'Poids',
    specScale: 'Échelle miniature',
    specMaterial: 'Matériau de fonte',
    specParts: 'Nombre de pièces',
    specFinishing: 'Traitement de surface',

    // 3D & Viewer Tabs
    tab3d: 'Modèle 3D Interactif',
    tabBlueprint: 'Plan Technique 2.5D',
    tabPhotos: 'Photographies de Terrain',
    zoomDetail: 'Inspecter les Détails',
    fullscreen: 'Plein écran',
    loading3d: 'Chargement du modèle 3D Draco...',
    view3dHint: 'Utilisez la souris ou les doigts pour pivoter à 360° et zoomer sur les détails architecturaux',

    // Audio Guide
    audioTitle: 'Guide Narratif Audio',
    audioDuration: 'Durée',
    audioNarrator: 'Narrateur',
    audioTranscript: 'Transcription du Récit',
    playAudio: 'Écouter le récit audio',
    pauseAudio: 'Mettre en pause',

    // Story Blocks
    storyHeading: 'Dossier de Recherche & Chronologie',
    storySubheading: 'Découvrez les origines historiques, l’assemblage traditionnel et le symbolisme culturel intemporel',
    timelineTitle: 'Métamorphoses millénaires',
    verifiedHeritage: 'Certificat Phygital Viettoria Vérifié',
    certificateId: 'Identifiant Unique de la Pièce',
  },

  // Map Page
  mapPage: {
    title: 'Carte du Patrimoine Architectural du Vietnam',
    subtitle: 'Système de coordonnées géographiques répertoriant les chefs-d’œuvre architecturaux anciens',
    searchPlaceholder: 'Rechercher par monument, région ou dynastie...',
    filterRegion: 'Région :',
    filterAll: 'Toutes les régions',
    selectedMonument: 'Édifice sélectionné',
    viewDetails: 'Explorer l’édifice',
    noResults: 'Aucun monument ne correspond à vos filtres.',
  },

  // Collections Page
  collectionsPage: {
    title: 'Collections du Patrimoine',
    subtitle: 'Séries de pièces de collection représentatives des grandes époques historiques',
    worksCount: 'œuvres',
  },

  // Blogs & Culture Page
  blogsPage: {
    title: 'Perspectives Culturelles & Recherches',
    subtitle: 'Articles approfondis sur les techniques de charpente traditionnelle et l’histoire',
    readTime: 'min de lecture',
    author: 'Auteur',
  },

  // QR Resolver
  qr: {
    resolvingTitle: 'Vérification du Code Patrimonial',
    resolvingSub: 'Connexion à l’écosystème Phygital Viettoria...',
    inputPlaceholder: 'Entrez le code sceau (ex. VT-HN-001)...',
    btnVerify: 'Vérifier la Pièce',
    notFound: 'Le code sceau QR est introuvable dans l’écosystème Viettoria.',
  },

  // 3D Hotspots & Architectural Inspection
  hotspots: {
    toggleTitle: 'Détails Architecturaux',
    toggleActive: 'Masquer les points',
    toggleInactive: 'Afficher les points',
    pointsCount: 'points d\'inspection',
    focusCamera: 'Centrer la vue',
    resetCamera: 'Réinitialiser la vue',
    inspectHint: 'Appuyez ou cliquez sur les repères pour explorer les éléments architecturaux uniques',
    close: 'Fermer',
    fullscreenMode: 'Mode Inspection Plein Écran 3D',
  },

  // Footer
  footer: {
    brandDesc: 'Sublimer les chefs-d’œuvre architecturaux vietnamiens sous forme de maquettes d’art 3D associées à des plateformes numériques sensorielles, rapprochant l’histoire ancestrale des voyageurs du monde entier.',
    monumentsCol: 'ÉDIFICES DU PATRIMOINE',
    atelierCol: 'VIETTORIA',
    connectCol: 'CONNEXION',
    contactEmail: 'contact@viettoria.vn',
    locationHanoi: 'Hanoï, Vietnam',
    support247: 'Assistance visiteurs 24/7',
    otherMonuments: 'Autres œuvres',
    copyright: '© 2026 VIETTORIA. Honorer les racines ancestrales — Rayonner l’âme du Vietnam.',
    tagline: 'Maquettes architecturales et récits du patrimoine vietnamien',
    languageLabel: 'Langue d’affichage :',
  },
};

