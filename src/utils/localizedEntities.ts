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
  category: string;
  detail: string;
}

// -------------------------------------------------------------
// 1. COLLECTIONS TRANSLATION DICTIONARY (EN & FR)
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
  },
};

// -------------------------------------------------------------
// 2. PRODUCTS TRANSLATION DICTIONARY (EN & FR)
// -------------------------------------------------------------
const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedProductFields>>> = {
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
      audioGuideTitle: 'Gloire de la Tour du Drapeau de Thang Long',
      audioGuideNarrator: 'Narrateur Viettoria Atelier',
      audioGuideTranscript: 'Érigée en 1812, la Tour du Drapeau est l\'un des rares édifices préservés intacts au sein de la Cité impériale, immortalisant le moment solennel de la libération de la capitale le 10 octobre 1954.',
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
      audioGuideTitle: 'Harmonies Royales au Bord de la Rivière des Parfums',
      audioGuideNarrator: 'Narrateur Cité Impériale Viettoria',
      audioGuideTranscript: 'Orientée plein sud selon la géomancie, la Porte du Midi est le point de rencontre de la lumière et du pouvoir royal. Au sommet, le Belvédère des Cinq Phénix a accueilli les grandes cérémonies impériales et l\'abdication historique de 1945.',
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
      audioGuideTitle: 'Chant Épique sur les Quais de Saigon',
      audioGuideNarrator: 'Narrateur Viettoria Atelier',
      audioGuideTranscript: 'Le 5 juin 1911, le paquebot Amiral Latouche-Tréville quitta le port de Saigon, emportant l\'aspiration ardente de liberté du jeune Nguyen Tat Thanh âgé de 21 ans.',
    },
  },
};

// -------------------------------------------------------------
// 3. BLOG POSTS TRANSLATION DICTIONARY (EN & FR)
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
  },
};

// -------------------------------------------------------------
// 4. STORY BLOCKS TRANSLATION DICTIONARY (EN & FR)
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
      content: 'La Pagode au Pilier Unique (Pagode Dien Huu) a été fondée à l\'hiver 1049 sous le règne du roi Ly Thai Tong. Selon les Annales du Dai Viet, le roi rêva d\'Avalokiteshvara l\'invitant à monter sur un trône de lotus. Les érudits de la cour proposèrent d\'ériger un sanctuaire sur un pilier de pierre au milieu de l\'étang Linh Chieu, évoquant un lotus immaculé au cœur de la capitale.',
      mediaCaption: 'La Pagode Dien Huu reflétée dans l\'étang Linh Chieu à Ba Dinh, Hanoï.',
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
      content: 'L\'ensemble du Pavillon du Lotus repose sur un pilier monolithique de 1.2 mètre de diamètre. Au sommet, 8 consoles en bois de fer rayonnent comme 8 pétales de lotus épanouis, portant l\'édifice sans aucun pilier secondaire.',
      highlightBadge: 'Chef-d\'œuvre Unique au Monde',
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
      content: 'Dans le bouddhisme du Dai Viet, le lotus incarne la pureté au-delà des tourments du monde. Dressée au milieu de l\'eau, la pagode est un manifeste d\'autonomie culturelle et de sagesse millénaire.',
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

  if (product.audioGuide && (tr.audioGuideTitle || tr.audioGuideTranscript || tr.audioGuideNarrator)) {
    updated.audioGuide = {
      ...product.audioGuide,
      title: tr.audioGuideTitle || product.audioGuide.title,
      transcript: tr.audioGuideTranscript || product.audioGuide.transcript,
      narrator: tr.audioGuideNarrator || product.audioGuide.narrator,
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
    category: tr.category || hotspot.category,
    detail: tr.detail || hotspot.detail,
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
