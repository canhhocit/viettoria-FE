/**
 * VIETTORIA MEDIA RESOLVER & THREE-TIER FALLBACK UTILITY
 * 
 * Kiến trúc fallback 3 tầng linh hoạt:
 *   1. Tầng 1 (Ưu tiên): Cloudinary / External CDN (hỗ trợ scale và CDN toàn cầu)
 *   2. Tầng 2 (Dự phòng): Spring Boot Backend API (/uploads/ hoặc /media/)
 *   3. Tầng 3 (Local Fallback): Assets cục bộ đã tối ưu hóa:
 *      - Mô hình 3D (.glb, .stl) lưu tại: /3D/
 *      - Hình ảnh, avatar và tư liệu web lưu tại: /viettoria_img/ hoặc /images/
 */

import { BACKEND_HOST } from './apiConfig';

const CLOUDINARY_BASE_URL = (import.meta.env.VITE_CLOUDINARY_BASE_URL as string) || '';
const CLOUDINARY_CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || '';

const BACKEND_UPLOADS_URL = (import.meta.env.VITE_BACKEND_UPLOADS_URL as string) || `${BACKEND_HOST}/uploads`;

/**
 * Bản đồ ánh xạ slug mô hình sang file .glb nội bộ tại /3D/
 */
const KNOWN_3D_MODELS: Record<string, string> = {
  'chua-mot-cot': '/3D/chua-mot-cot.glb',
  'VT-HN-001': '/3D/chua-mot-cot.glb',
  'khue-van-cac': '/3D/khue-van-cac.glb',
  'VT-HN-002': '/3D/khue-van-cac.glb',
  'cot-co-ha-noi': '/3D/cot-co-ha-noi.glb',
  'VT-HN-003': '/3D/cot-co-ha-noi.glb',
  'ngo-mon-hue': '/3D/ngo-mon-hue.glb',
  'VT-HUE-004': '/3D/ngo-mon-hue.glb',
  'ben-nha-rong': '/3D/ben-nha-rong.glb',
  'VT-SG-005': '/3D/ben-nha-rong.glb',
  'gac-lau-thang-long': '/3D/lau_gac_web.glb',
  'lau-gac': '/3D/lau_gac_web.glb',
  'VT-HN-006': '/3D/lau_gac_web.glb',
  'default': '/3D/chua-mot-cot.glb',
};

const KNOWN_3D_PREVIEWS: Record<string, { poster: string; turntable: string }> = {
  'chua-mot-cot': { poster: '/3D/chua-mot-cot-poster.webp', turntable: '/3D/chua-mot-cot-card.webm' },
  'khue-van-cac': { poster: '/3D/khue-van-cac-poster.webp', turntable: '/3D/khue-van-cac-card.webm' },
  'cot-co-ha-noi': { poster: '/3D/cot-co-ha-noi-poster.webp', turntable: '/3D/cot-co-ha-noi-card.webm' },
  'ngo-mon-hue': { poster: '/3D/ngo-mon-hue-poster.webp', turntable: '/3D/ngo-mon-hue-card.webm' },
  'ben-nha-rong': { poster: '/3D/ben-nha-rong-poster.webp', turntable: '/3D/ben-nha-rong-card.webm' },
  'gac-lau-thang-long': { poster: '/3D/lau-gac-poster.webp', turntable: '' },
  'lau-gac': { poster: '/3D/lau-gac-poster.webp', turntable: '' },
};

export function resolve3DPreview(slug?: string | null) {
  return slug ? KNOWN_3D_PREVIEWS[slug] || null : null;
}

/**
 * Danh sách hình ảnh mẫu trong /viettoria_img/
 */
export const VIETTORIA_IMAGES = {
  avatarDefault: '/viettoria_img/IMG_5791.PNG',
  avatarSecondary: '/viettoria_img/IMG_5878.PNG',
  productHighlight: '/viettoria_img/curated-chua-mot-cot.png',
  atelierShowcase1: '/viettoria_img/curated-ngo-mon.png',
  atelierShowcase2: '/viettoria_img/curated-khue-van-cac.png',
  monumentDetail1: '/viettoria_img/curated-chua-mot-cot.png',
  monumentDetail2: '/viettoria_img/curated-khue-van-cac.png',
  monumentDetail3: '/viettoria_img/curated-ngo-mon.png',
  monumentDetail4: '/viettoria_img/IMG_6364.PNG',
  monumentDetail5: '/viettoria_img/IMG_6365.PNG',
  packagingBox: '/viettoria_img/curated-boxes-panorama.png',
  certificateCard: '/viettoria_img/curated-assembly-mong.png',
  qrCardPresentation: '/viettoria_img/curated-ngo-mon.png',
  standeeDisplay: '/viettoria_img/curated-assembly-mong.png',
  curatedChuaMotCot: '/viettoria_img/curated-chua-mot-cot.png',
  curatedNgoMon: '/viettoria_img/curated-ngo-mon.png',
  curatedKhueVanCac: '/viettoria_img/curated-khue-van-cac.png',
  curatedAssemblyMong: '/viettoria_img/curated-assembly-mong.png',
  curatedBoxesPanorama: '/viettoria_img/curated-boxes-panorama.png',
};

/**
 * Phân giải đường dẫn mô hình 3D (.glb, .gltf)
 * 
 * Thứ tự ưu tiên:
 * 1. Cloudinary (URL đầy đủ hoặc tiền tố CDN)
 * 2. Backend URL (nếu có tiền tố backend hoặc được chỉ định)
 * 3. Local Fallback tại /3D/{filename}
 */
export function resolve3DModelUrl(pathOrIdentifier?: string | null): string {
  if (!pathOrIdentifier || pathOrIdentifier.trim() === '') {
    return KNOWN_3D_MODELS['default'];
  }

  const clean = pathOrIdentifier.trim();

  // 1. Kiểm tra nếu là URL Cloudinary hoặc tuyệt đối
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // 2. Kiểm tra nếu là Cloudinary public ID và có CLOUDINARY_BASE_URL
  if (CLOUDINARY_BASE_URL && clean.startsWith('cloudinary:')) {
    const publicId = clean.replace(/^cloudinary:/, '');
    return `${CLOUDINARY_BASE_URL}/raw/upload/${publicId}`;
  }

  // 3. Kiểm tra ánh xạ slug chuẩn
  const slugKey = clean.toLowerCase().replace(/^(vt-|col-)/, '').replace(/\.(glb|gltf|stl)$/, '');
  if (KNOWN_3D_MODELS[clean] || KNOWN_3D_MODELS[slugKey]) {
    return KNOWN_3D_MODELS[clean] || KNOWN_3D_MODELS[slugKey];
  }

  // 4. Nếu đường dẫn đã bắt đầu bằng /3D/
  if (clean.startsWith('/3D/') || clean.startsWith('3D/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  // 5. Nếu là file tải lên từ backend (/uploads/...)
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const sub = clean.startsWith('/') ? clean : `/${clean}`;
    return `${BACKEND_HOST}${sub}`;
  }

  // 6. Fallback về file trong thư mục /3D/
  const fileName = clean.split('/').pop() || clean;
  return `/3D/${fileName}`;
}

/**
 * Phân giải đường dẫn hình ảnh (Ảnh tác phẩm, tin tức, tư liệu)
 * 
 * Thứ tự ưu tiên:
 * 1. Cloudinary (URL https://res.cloudinary.com/... hoặc Cloudinary CDN)
 * 2. Backend Spring Boot (/uploads/...)
 * 3. Local Public Fallback (/viettoria_img/... hoặc /images/...)
 */
export function resolveImageUrl(
  imagePathOrName?: string | null,
  fallbackImage: string = VIETTORIA_IMAGES.productHighlight
): string {
  if (!imagePathOrName || imagePathOrName.trim() === '') {
    return fallbackImage;
  }

  const clean = imagePathOrName.trim();

  // 1. URL tuyệt đối (Cloudinary, S3, hoặc CDN ngoài)
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }

  // 2. Cloudinary Public ID
  if (CLOUDINARY_BASE_URL && clean.startsWith('cloudinary:')) {
    const publicId = clean.replace(/^cloudinary:/, '');
    return `${CLOUDINARY_BASE_URL}/image/upload/${publicId}`;
  } else if (CLOUDINARY_CLOUD_NAME && clean.startsWith('cl_img/')) {
    const publicId = clean.replace(/^cl_img\//, '');
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
  }

  // 3. Nếu là đường dẫn trong backend /uploads/
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const sub = clean.startsWith('/') ? clean : `/${clean}`;
    return `${BACKEND_HOST}${sub}`;
  }

  // 4. Nếu là ảnh trong thư mục /viettoria_img/
  if (clean.startsWith('/viettoria_img/') || clean.startsWith('viettoria_img/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  // 5. Nếu là tên file IMG_xxxx.PNG
  if (/^IMG_\d+\.PNG$/i.test(clean)) {
    return `/viettoria_img/${clean.toUpperCase()}`;
  }

  // 6. Nếu là ảnh trong /images/
  if (clean.startsWith('/images/') || clean.startsWith('images/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  // 7. Mặc định fallback
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/** Resolve audio URLs from Cloudinary, backend uploads, or local public assets. */
export function resolveAudioUrl(audioPath?: string | null): string {
  if (!audioPath || audioPath.trim() === '') return '';
  const clean = audioPath.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:')) return clean;
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const sub = clean.startsWith('/') ? clean : `/${clean}`;
    return `${BACKEND_HOST}${sub}`;
  }
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/**
 * Phân giải đường dẫn Avatar người dùng hoặc nghệ nhân
 * Fallback mặc định về /viettoria_img/IMG_5791.PNG
 */
export function resolveAvatarUrl(avatarPathOrName?: string | null): string {
  if (!avatarPathOrName || avatarPathOrName.trim() === '') {
    return VIETTORIA_IMAGES.avatarDefault;
  }
  return resolveImageUrl(avatarPathOrName, VIETTORIA_IMAGES.avatarDefault);
}

/**
 * Trình xử lý sự kiện onError cho thẻ <img>:
 * Tự động chuyển đổi mượt mà từ Cloudinary -> Backend -> Local Fallback khi mạng lỗi hoặc link hỏng
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = VIETTORIA_IMAGES.productHighlight
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Nếu đã thử fallback rồi mà vẫn lỗi thì dừng để tránh lặp vô tận
  if (target.dataset.fallbackTried === 'tier-3') {
    return;
  }

  // Nếu đang dùng Cloudinary mà bị lỗi -> Thử fallback về Backend
  if (currentSrc.includes('res.cloudinary.com') || (CLOUDINARY_BASE_URL && currentSrc.includes(CLOUDINARY_BASE_URL))) {
    target.dataset.fallbackTried = 'tier-2';
    const filename = currentSrc.split('/').pop() || '';
    target.src = `${BACKEND_UPLOADS_URL}/${filename}`;
    return;
  }

  // Nếu đang dùng Backend mà lỗi -> Fallback về Local Asset
  target.dataset.fallbackTried = 'tier-3';
  target.src = fallbackSrc;
}

