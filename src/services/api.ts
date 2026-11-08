import type { 
  Collection, 
  Product, 
  StoryBlock, 
  BlogPost, 
  MediaItem, 
  CloudinaryUploadSignature,
  DashboardStats 
} from '../types/index';
import { 
  FALLBACK_COLLECTIONS, 
  FALLBACK_PRODUCTS, 
  FALLBACK_STORY_BLOCKS, 
  FALLBACK_BLOGS,
} from '../data/fallbackData';
import { API_BASE_URL } from '../utils/apiConfig';

const API_BASE = API_BASE_URL;

type AdminLoginResult = {
  token: string;
  user: { id: string; fullName: string; username: string; role: string };
};

const persistAdminSession = (data: AdminLoginResult): AdminLoginResult => {
  localStorage.setItem('viettoria_admin_token', data.token);
  localStorage.setItem('viettoria_admin_user', JSON.stringify(data.user));
  return data;
};

const clearAdminSession = () => {
  localStorage.removeItem('viettoria_admin_token');
  localStorage.removeItem('viettoria_admin_user');
  localStorage.removeItem('viettoria_admin_refresh_token');
};

const notifyAdminSessionExpired = () => {
  clearAdminSession();
  window.dispatchEvent(new Event('viettoria:unauthorized'));
};

const readTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))) as { exp?: number };
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('viettoria_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...init.headers },
  });
  const payload = await response.json().catch(() => null) as {
    data?: T;
    message?: string;
    detail?: string;
    success?: boolean;
  } | null;

  if (!response.ok || payload?.success === false) {
    if (response.status === 401) {
      notifyAdminSessionExpired();
    }
    throw new Error(payload?.message || payload?.detail || `Yêu cầu thất bại (${response.status})`);
  }

  return payload?.data as T;
}

async function adminMultipartRequest<T>(path: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem('viettoria_admin_token');
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const payload = await response.json().catch(() => null) as {
    data?: T;
    message?: string;
    detail?: string;
    success?: boolean;
  } | null;

  if (!response.ok || payload?.success === false) {
    if (response.status === 401) {
      notifyAdminSessionExpired();
    }
    throw new Error(payload?.message || payload?.detail || `Yêu cầu thất bại (${response.status})`);
  }

  return payload?.data as T;
}

// --- PUBLIC API ---
export const publicApi = {
  async getCollections(): Promise<Collection[]> {
    try {
      const res = await fetch(`${API_BASE}/public/collections`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_COLLECTIONS.filter(c => c.status === 'published');
  },

  async getCollectionBySlug(slug: string): Promise<(Collection & { products: Product[] }) | null> {
    try {
      const res = await fetch(`${API_BASE}/public/collections/${slug}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const col = FALLBACK_COLLECTIONS.find(c => c.slug === slug);
    if (!col) return null;
    const prods = FALLBACK_PRODUCTS.filter(p => p.collectionId === col.id && p.status === 'published');
    return { ...col, products: prods };
  },

  async getProducts(params?: { collectionId?: string; search?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.collectionId) query.set('collectionId', params.collectionId);
      if (params?.search) query.set('search', params.search);
      const res = await fetch(`${API_BASE}/public/products?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    let list = FALLBACK_PRODUCTS.filter(p => p.status === 'published');
    if (params?.collectionId) {
      list = list.filter(p => p.collectionId === params.collectionId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.code.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getProductBySlugOrCode(slugOrCode: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/public/products/${slugOrCode}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const lower = slugOrCode.toLowerCase();
    const prod = FALLBACK_PRODUCTS.find(p => 
      p.slug.toLowerCase() === lower || p.code.toLowerCase() === lower
    );
    if (!prod) return null;

    const col = FALLBACK_COLLECTIONS.find(c => c.id === prod.collectionId);
    const storyBlocks = FALLBACK_STORY_BLOCKS.filter(b => b.productId === prod.id && b.status === 'published');
    const relatedProducts = FALLBACK_PRODUCTS.filter(p => p.collectionId === prod.collectionId && p.id !== prod.id).slice(0, 3);

    return {
      ...prod,
      collection: col,
      storyBlocks,
      relatedProducts
    };
  },

  async resolveQR(code: string): Promise<{ targetUrl: string; product: Product } | null> {
    try {
      const res = await fetch(`${API_BASE}/public/qr-resolve?code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const json = await res.json();
        const fullProd = await this.getProductBySlugOrCode(json.data.slug);
        if (fullProd) {
          return { targetUrl: json.data.targetUrl, product: fullProd };
        }
      }
    } catch {
      // Fallback
    }
    const prod = FALLBACK_PRODUCTS.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (!prod) return null;
    return {
      targetUrl: `/products/${prod.slug}?code=${encodeURIComponent(prod.code)}`,
      product: prod
    };
  },

  async getBlogs(): Promise<BlogPost[]> {
    try {
      const res = await fetch(`${API_BASE}/public/blogs`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_BLOGS.filter(b => b.status === 'published');
  },

  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const res = await fetch(`${API_BASE}/public/blogs/${slug}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const blog = FALLBACK_BLOGS.find(b => b.slug === slug);
    return blog || null;
  },

  async getFeatured(): Promise<{
    heroProduct: Product;
    featuredProducts: Product[];
    collections: Collection[];
    latestBlogs: BlogPost[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/public/featured`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const heroProduct = FALLBACK_PRODUCTS.find(p => p.isHeroRelease) || FALLBACK_PRODUCTS[0];
    const featuredProducts = FALLBACK_PRODUCTS.filter(p => p.id !== heroProduct.id).slice(0, 4);
    const collections = FALLBACK_COLLECTIONS.slice(0, 3);
    const latestBlogs = FALLBACK_BLOGS.slice(0, 3);

    return { heroProduct, featuredProducts, collections, latestBlogs };
  }
};

// --- ADMIN CMS API ---
type MediaResourceType = 'image' | 'raw' | 'video';

const describeMediaFile = (file: File): { resourceType: MediaResourceType; extension: string; fileType: string } => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const imageMimeTypes: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif',
  };
  const audioMimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', ogg: 'audio/ogg', flac: 'audio/flac',
  };
  if (imageMimeTypes[extension]) return { resourceType: 'image', extension, fileType: file.type || imageMimeTypes[extension] };
  if (extension === 'glb') return { resourceType: 'raw', extension, fileType: file.type || 'model/gltf-binary' };
  if (audioMimeTypes[extension]) return { resourceType: 'video', extension, fileType: file.type || audioMimeTypes[extension] };
  throw new Error('Tệp chỉ hỗ trợ ảnh, mô hình GLB và audio MP3, WAV, M4A, OGG hoặc FLAC.');
};

type CloudinaryMediaResponse = {
  secure_url?: string;
  public_id?: string;
  bytes?: number;
  error?: { message?: string };
};

export const adminApi = {
  async login(username: string, password: string): Promise<AdminLoginResult> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
    } catch {
      throw new Error('Không kết nối được máy chủ. Kiểm tra backend rồi thử lại.');
    }
    const payload = await response.json().catch(() => null) as {
      data?: AdminLoginResult;
      message?: string;
      detail?: string;
    } | null;
    if (!response.ok || !payload?.data?.token) {
      throw new Error(payload?.message || payload?.detail || (response.ok ? 'Máy chủ không trả token đăng nhập.' : 'Đăng nhập thất bại.'));
    }
    return persistAdminSession(payload.data);
  },

  async loginDemo(): Promise<AdminLoginResult> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/admin/auth/demo`, { method: 'POST' });
    } catch {
      throw new Error('Không kết nối được máy chủ. Kiểm tra backend rồi thử lại.');
    }
    const payload = await response.json().catch(() => null) as {
      data?: AdminLoginResult;
      message?: string;
      detail?: string;
    } | null;
    if (!response.ok || !payload?.data?.token) {
      throw new Error(payload?.message || payload?.detail || 'Chưa thể mở bản demo.');
    }
    return persistAdminSession(payload.data);
  },

  logout(): void {
    clearAdminSession();
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('viettoria_admin_token');
    if (!token) return false;
    const expiresAt = readTokenExpiry(token);
    if (expiresAt !== null && expiresAt <= Date.now()) {
      clearAdminSession();
      return false;
    }
    return true;
  },

  getSessionExpiresAt(): number | null {
    const token = localStorage.getItem('viettoria_admin_token');
    return token ? readTokenExpiry(token) : null;
  },

  isDemoSession(): boolean {
    try {
      const user = localStorage.getItem('viettoria_admin_user');
      return Boolean(user && (JSON.parse(user) as { role?: string }).role === 'DEMO');
    } catch {
      return false;
    }
  },

  async getDashboard(): Promise<{ stats: DashboardStats; recentProducts: Product[]; recentBlogs: BlogPost[] }> {
    return adminRequest('/admin/dashboard');
  },

  async getProducts(): Promise<Product[]> {
    return adminRequest('/admin/products');
  },

  async getProductById(id: string): Promise<Product & { storyBlocks: StoryBlock[] }> {
    return adminRequest(`/admin/products/${encodeURIComponent(id)}`);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return adminRequest('/admin/products', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return adminRequest(`/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteProduct(id: string): Promise<void> {
    await adminRequest(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getStories(productId: string): Promise<StoryBlock[]> {
    return adminRequest(`/admin/products/${encodeURIComponent(productId)}/stories`);
  },

  async createStory(productId: string, data: Partial<StoryBlock>): Promise<StoryBlock> {
    return adminRequest(`/admin/products/${encodeURIComponent(productId)}/stories`, { method: 'POST', body: JSON.stringify(data) });
  },

  async updateStory(id: string, data: Partial<StoryBlock>): Promise<StoryBlock> {
    return adminRequest(`/admin/stories/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteStory(id: string): Promise<void> {
    await adminRequest(`/admin/stories/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async reorderStories(productId: string, blockIds: string[]): Promise<void> {
    await adminRequest(`/admin/products/${encodeURIComponent(productId)}/stories/reorder`, { method: 'PUT', body: JSON.stringify({ blockIds }) });
  },

  async getCollections(): Promise<Collection[]> {
    return adminRequest('/admin/collections');
  },

  async createCollection(data: Partial<Collection>): Promise<Collection> {
    return adminRequest('/admin/collections', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateCollection(id: string, data: Partial<Collection>): Promise<Collection> {
    return adminRequest(`/admin/collections/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteCollection(id: string): Promise<void> {
    await adminRequest(`/admin/collections/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getBlogs(): Promise<BlogPost[]> {
    return adminRequest('/admin/blogs');
  },

  async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
    return adminRequest('/admin/blogs', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return adminRequest(`/admin/blogs/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteBlog(id: string): Promise<void> {
    await adminRequest(`/admin/blogs/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getMedia(): Promise<MediaItem[]> {
    return adminRequest('/admin/media');
  },

  async deleteMedia(id: string): Promise<void> {
    await adminRequest(`/admin/media/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async createMediaUploadSignature(resourceType: MediaResourceType, fileExtension: string): Promise<CloudinaryUploadSignature> {
    return adminRequest('/admin/media/upload-signature', {
      method: 'POST',
      body: JSON.stringify({ resourceType, fileExtension }),
    });
  },

  async saveMedia(data: Omit<MediaItem, 'id' | 'uploadedAt'>): Promise<MediaItem> {
    return adminRequest('/admin/media', { method: 'POST', body: JSON.stringify(data) });
  },

  async uploadMediaFallback(file: File, name: string, altText: string): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('altText', altText);
    return adminMultipartRequest('/admin/media/fallback-upload', formData);
  },

  async uploadMediaAsset(file: File, name: string, altText: string): Promise<{ item: MediaItem; storage: 'cloudinary' | 'backend'; fallbackReason?: string }> {
    const { resourceType, extension, fileType } = describeMediaFile(file);
    let signature: CloudinaryUploadSignature;
    let uploaded: CloudinaryMediaResponse;
    try {
      signature = await this.createMediaUploadSignature(resourceType, extension);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signature.apiKey);
      formData.append('timestamp', String(signature.timestamp));
      formData.append('signature', signature.signature);
      formData.append('folder', signature.folder);
      formData.append('public_id', signature.publicId);
      formData.append('overwrite', String(signature.overwrite));
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/${signature.resourceType}/upload`,
        { method: 'POST', body: formData },
      );
      uploaded = await response.json() as CloudinaryMediaResponse;
      if (!response.ok || !uploaded.secure_url || !uploaded.public_id) {
        throw new Error(uploaded.error?.message || 'Cloudinary không nhận được tệp tải lên.');
      }
    } catch (error) {
      const fallback = await this.uploadMediaFallback(file, name, altText);
      return {
        item: fallback,
        storage: 'backend',
        fallbackReason: error instanceof Error ? error.message : 'Không thể kết nối Cloudinary.',
      };
    }

    const saved = await this.saveMedia({
      name,
      fileName: file.name,
      fileType,
      fileSize: uploaded.bytes ?? file.size,
      url: uploaded.secure_url!,
      publicId: uploaded.public_id!,
      resourceType,
      altText,
    });
    return { item: saved, storage: 'cloudinary' };
  }
};
