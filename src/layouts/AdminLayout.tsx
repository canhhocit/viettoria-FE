import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Box, 
  Layers, 
  FileText, 
  Image, 
  LogOut, 
  ExternalLink, 
  Shield, 
  Menu, 
  X,
  Eye,
  Headphones
} from 'lucide-react';
import { adminApi } from '../services/api';
import { resolveAvatarUrl } from '../utils/mediaResolver';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; username: string; role?: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    if (!adminApi.isAuthenticated()) {
      navigate('/admin/login', { replace: true, state: { from: location } });
    } else {
      try {
        const storedUser = localStorage.getItem('viettoria_admin_user');
        const parsedUser = storedUser ? JSON.parse(storedUser) as { fullName?: string; username?: string; role?: string } : null;
        setUser({ fullName: parsedUser?.fullName || 'Quản Trị Viên', username: parsedUser?.username || '', role: parsedUser?.role, avatarUrl: resolveAvatarUrl() });
      } catch {
        setUser({ fullName: 'Quản Trị Viên', username: '', avatarUrl: resolveAvatarUrl() });
      }
    }
    const handleUnauthorized = () => {
      adminApi.logout();
      navigate('/admin/login', { replace: true, state: { from: location } });
    };
    const expiresAt = adminApi.getSessionExpiresAt();
    const expireIfNeeded = () => {
      if (expiresAt !== null && Date.now() >= expiresAt) handleUnauthorized();
    };
    const expiryTimer = expiresAt === null
      ? undefined
      : window.setTimeout(expireIfNeeded, Math.max(0, expiresAt - Date.now()));
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') expireIfNeeded();
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'viettoria_admin_token' && !event.newValue) handleUnauthorized();
    };

    window.addEventListener('viettoria:unauthorized', handleUnauthorized);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (expiryTimer !== undefined) window.clearTimeout(expiryTimer);
      window.removeEventListener('viettoria:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, location]);

  const handleLogout = () => {
    adminApi.logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tổng Quan' },
    { to: '/admin/products', icon: Box, label: 'Mô Hình & Stories' },
    { to: '/admin/audio-guides', icon: Headphones, label: 'Hướng Dẫn Viên Audio' },
    { to: '/admin/collections', icon: Layers, label: 'Bộ Sưu Tập' },
    { to: '/admin/blogs', icon: FileText, label: 'Góc Văn Hóa' },
    { to: '/admin/media', icon: Image, label: 'Thư Viện Media' },
  ];

  return (
    <div className="admin-layout min-h-screen bg-paper-warm text-charcoal flex flex-col md:flex-row font-serif">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-forest text-paper px-4 py-3 flex items-center justify-between border-b border-brass/30">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brass" />
          <span className="font-serif font-bold text-lg tracking-wider text-white">VIETTORIA CMS</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 border border-white/20 text-white rounded-[2px]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && <button type="button" aria-label="Đóng menu" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-forest text-white flex flex-col justify-between border-r border-brass/25 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex flex-col gap-2">
              <img
                src="/viettoria-noback.svg"
                alt="Viettoria"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <p className="text-[10px] font-mono text-brass uppercase tracking-widest mt-1">Heritage CMS Studio</p>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 font-mono text-xs uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-[2px] transition-colors ${
                      isActive
                        ? 'bg-brass text-forest font-bold shadow-sm'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-forest-dark space-y-3 font-mono text-xs">
          <div className="flex items-center gap-3 px-2 py-1.5">
            
            <div className="min-w-0">
              <p className="text-white font-medium text-xs truncate">{user?.fullName || 'Ban Quản Trị'}</p>
              <p className="text-[10px] text-brass uppercase tracking-widest">{user?.role === 'DEMO' ? 'Bản xem thử' : 'Administrator'}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 text-white/85 hover:text-brass transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Website Công Khai</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-1.5 text-terracotta hover:text-white hover:bg-terracotta/20 transition-colors text-left rounded-[2px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-paper border-b border-paper-border shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted uppercase tracking-wider">
            <span>Khu vực quản lý và điều hành di sản kiến trúc</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {user?.role === 'DEMO' && (
            <div role="status" className="mb-5 flex items-start gap-2 border border-brass/40 bg-paper-warm px-4 py-3 text-xs leading-relaxed text-forest">
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              <p><strong className="font-mono uppercase tracking-wider">Chế độ xem thử</strong><span className="ml-2">Bạn có thể duyệt các mục trong CMS; thao tác tạo, sửa, xóa và tải tệp đã được khóa.</span></p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
