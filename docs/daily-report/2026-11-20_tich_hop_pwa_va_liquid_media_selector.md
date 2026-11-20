# Báo Cáo Công Việc: Tích Hợp PWA Toàn Diện & Phát Triển Liquid Media Selector Animation

## 1. Thông Tin Chung
* **Ngày thực hiện:** 20/11/2026
* **Nghiệp vụ / Tính năng:** 
  1. Tích hợp chuẩn **Progressive Web App (PWA)** toàn diện cho Viettoria Atelier (Offline Caching, Standalone App Install, Royal App Icons).
  2. Xây dựng và tích hợp vi tương tác cao cấp **Liquid Media Selector Animation** lấy cảm hứng từ tác phẩm Dribbble của Saransh Agarwal (Squareboat) kết hợp nhận diện hoàng gia *Sơn son thếp vàng*.
* **Quy chuẩn chất lượng:** UI/UX Pro Max, 60fps GPU SVG Gooey Metaballs, chuẩn Google PWA Audit.

---

## 2. Mục Tiêu & Yêu Cầu Đặt Ra
1. **Yêu cầu PWA:**
   * Dự án trước đó chưa hỗ trợ PWA, không thể cài đặt lên màn hình chính (Add to Home Screen) trên thiết bị di động hay máy tính.
   * Cần có Service Worker tự động cập nhật, hỗ trợ lưu trữ đệm (Workbox Precache & Runtime Cache) cho các tài nguyên nặng như font chữ hoàng gia Google Fonts, thư viện 3D model-viewer, hình ảnh di tích độ nét cao.
   * Tạo bộ biểu tượng ứng dụng PWA chuẩn kích thước (192x192, 512x512, 180x180, maskable) với nhận diện hoàng gia nền xanh lim (`#0D1C16`), viền hoa văn đồng cổ và chữ lồng "V".
   * Thêm biểu ngữ / khay giám tuyển mời cài đặt ứng dụng nhẹ nhàng, không gây phiền toái.
2. **Yêu cầu Liquid Media Selector Animation:**
   * Lấy cảm hứng từ thiết kế **Liquid Animation** của Saransh Agarwal trên Dribbble.
   * Chuyển động lỏng hữu cơ (*Organic Gooey Meniscus Physics*): Khi chuyển đổi giữa các tab media, vệt chỉ thị kéo giãn đàn hồi tạo màng dính giọt chất lỏng nối giữa hai nút trước khi bứt phá và co về nút mới với hiệu ứng nảy nhẹ (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
   * Thay thế các nút tab hình chữ nhật cứng nhắc tại Phòng trưng bày 3D ([ArchitecturalViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/ArchitecturalViewer.tsx)) và bộ chuyển đổi bản đồ ([HeritageMap.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx)).

---

## 3. Chi Tiết Thay Đổi

### A. Tích hợp Progressive Web App (PWA)
1. **Cấu hình Vite PWA Plugin ([vite.config.ts](file:///c:/personal/viettoria/viettoria-FE/vite.config.ts)):**
   * Tích hợp `vite-plugin-pwa` với chế độ `registerType: 'autoUpdate'`.
   * Cấu hình Web Manifest chuẩn quốc tế:
     * `name`: VIETTORIA — Di Sản Văn Hóa & Kiến Trúc Việt
     * `short_name`: VIETTORIA
     * `theme_color`: `#0D1C16` (Imperial Forest Green)
     * `background_color`: `#FAF7F0` (Heritage Warm Paper)
     * `display`: `standalone` (mở toàn màn hình không viền trình duyệt).
   * Cấu hình Workbox precache 68 tài nguyên và nâng mức trần `maximumFileSizeToCacheInBytes: 6MB` để lưu đệm các ảnh phục dựng di sản độ phân giải cao.
   * Chiến lược Runtime Cache cho Google Fonts và Google Model Viewer (30 ngày đến 1 năm).
2. **Bộ biểu tượng PWA chuẩn hoá:**
   * Tự động sinh 4 tệp biểu tượng PNG sắc nét:
     * [pwa-192x192.png](file:///c:/personal/viettoria/viettoria-FE/public/pwa-192x192.png)
     * [pwa-512x512.png](file:///c:/personal/viettoria/viettoria-FE/public/pwa-512x512.png)
     * [apple-touch-icon.png](file:///c:/personal/viettoria/viettoria-FE/public/apple-touch-icon.png)
     * [maskable-icon-512x512.png](file:///c:/personal/viettoria/viettoria-FE/public/maskable-icon-512x512.png)
3. **Thẻ Meta & Đăng ký Service Worker:**
   * [index.html](file:///c:/personal/viettoria/viettoria-FE/index.html): Bổ sung `apple-touch-icon`, `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`.
   * [main.tsx](file:///c:/personal/viettoria/viettoria-FE/src/main.tsx): Tự động gọi `registerSW({ immediate: true })`.
4. **Khay thông báo cài đặt ứng dụng ([PWAInstallPrompt.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/PWAInstallPrompt.tsx)):**
   * Lắng nghe sự kiện `beforeinstallprompt`, hiển thị khay sang trọng góc dưới mời du khách cài đặt ứng dụng lên Home Screen kèm nút "Cài Đặt Ngay". Tự động ghi nhớ lựa chọn của người dùng trong 7 ngày nếu bấm "Để sau".

### B. Thành phần Liquid Media Selector Animation
1. **Xây dựng Component Tái Sử Dụng ([LiquidMediaSelector.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/LiquidMediaSelector.tsx)):**
   * Sử dụng bộ lọc ẩn SVG Gooey Filter (`feGaussianBlur` + `feColorMatrix`) mô phỏng lực căng bề mặt chất lỏng (metaballs).
   * Lớp kéo giãn màng chất lỏng (`liquid-stretch-droplet`) kết hợp viên thuốc trung tâm (`liquid-active-pill`), tạo hiệu ứng giọt sơn mài lỏng thếp vàng kéo căng và bứt ra khi chuyển tab.
   * Vi hạt sóng nước (`ripples`) phát ra từ điểm chạm khi người dùng click/chạm ngón tay.
   * Hỗ trợ đầy đủ điều hướng bằng phím mũi tên (`ArrowLeft`, `ArrowRight`, `role="tablist"`, `aria-selected`).
   * 3 biến thể màu sắc cao cấp: `paper` (cho nền sáng giấy dó), `lacquer` (cho nền tối gỗ lim), `royal` (viền vàng kim vương giả).
2. **Tích hợp vào Trình xem 3D ([ArchitecturalViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/ArchitecturalViewer.tsx)):**
   * Thay thế 2 nút tab cũ bằng `LiquidMediaSelector` chuyển đổi mượt mà giữa `[Mô hình 3D]` và `[Ảnh thực địa]`.
3. **Tích hợp vào Bộ chuyển đổi Bản đồ ([HeritageMap.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx)):**
   * Thay thế thanh tab mobile bằng `LiquidMediaSelector` chuyển đổi uyển chuyển giữa `[Bản Đồ Di Sản]` và `[Danh Sách Di Tích]`.

---

## 4. Danh Mục Tệp Đã Chỉnh Sửa & Tạo Mới

| STT | Tệp tin | Trạng thái | Nội dung chính |
|---|---|---|---|
| 1 | [LiquidMediaSelector.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/LiquidMediaSelector.tsx) | Tạo mới | Component Liquid Media Selector Animation (Gooey SVG Filter & Elastic Bridge) |
| 2 | [PWAInstallPrompt.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/PWAInstallPrompt.tsx) | Tạo mới | Khay thông báo cài đặt PWA sang trọng phong cách Atelier |
| 3 | [create-icons.ps1](file:///c:/personal/viettoria/viettoria-FE/scripts/create-icons.ps1) | Tạo mới | Script tự động tạo 4 icon PWA chuẩn HD bằng System.Drawing |
| 4 | [pwa-192x192.png](file:///c:/personal/viettoria/viettoria-FE/public/pwa-192x192.png) | Tạo mới | Icon PWA 192x192 chuẩn Android |
| 5 | [pwa-512x512.png](file:///c:/personal/viettoria/viettoria-FE/public/pwa-512x512.png) | Tạo mới | Icon PWA 512x512 Splash Screen |
| 6 | [apple-touch-icon.png](file:///c:/personal/viettoria/viettoria-FE/public/apple-touch-icon.png) | Tạo mới | Icon Apple Touch 180x180 cho iOS |
| 7 | [maskable-icon-512x512.png](file:///c:/personal/viettoria/viettoria-FE/public/maskable-icon-512x512.png) | Tạo mới | Icon Maskable thích ứng Android Launcher |
| 8 | [vite.config.ts](file:///c:/personal/viettoria/viettoria-FE/vite.config.ts) | Cập nhật | Cấu hình VitePWA, manifest, workbox runtime caching |
| 9 | [index.html](file:///c:/personal/viettoria/viettoria-FE/index.html) | Cập nhật | Bổ sung thẻ PWA meta, theme-color và apple-touch-icon |
| 10 | [main.tsx](file:///c:/personal/viettoria/viettoria-FE/src/main.tsx) | Cập nhật | Tự động đăng ký Virtual PWA Service Worker |
| 11 | [MainLayout.tsx](file:///c:/personal/viettoria/viettoria-FE/src/layouts/MainLayout.tsx) | Cập nhật | Gắn PWAInstallPrompt vào layout toàn trang |
| 12 | [ArchitecturalViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/ArchitecturalViewer.tsx) | Cập nhật | Tích hợp LiquidMediaSelector cho chế độ xem 3D / Ảnh thực địa |
| 13 | [HeritageMap.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx) | Cập nhật | Tích hợp LiquidMediaSelector cho tab Bản đồ / Danh sách |
| 14 | [tsconfig.app.json](file:///c:/personal/viettoria/viettoria-FE/tsconfig.app.json) | Cập nhật | Bổ sung `vite-plugin-pwa/client` types |

---

## 5. Kết Quả Kiểm Thử & Xác Minh
* **Build Production:** `npm run build`
  * Trình biên dịch: TypeScript + Vite v8.3.5 + VitePWA v2.0.0.
  * Kết quả: **Thành công 100% (0 lỗi)**, biên dịch hoàn tất trong 2.21s.
  * Tệp PWA sinh ra tự động: `dist/sw.js`, `dist/workbox-835c8c05.js`, `dist/manifest.webmanifest`.
  * Precache thành công: 68 tài nguyên (~44.7 MB) bao gồm toàn bộ core assets và ảnh di tích.
* **Linter:** `npm run lint` (Oxlint) đạt **0 lỗi**.

---

## 6. Đề Xuất & Lưu Ý Tiếp Theo
* Ứng dụng hiện có thể cài đặt trực tiếp lên màn hình chính điện thoại (Safari: "Thêm vào MH chính", Chrome/Edge: biểu tượng Install trên thanh địa chỉ).
* Bộ lọc Liquid SVG chạy siêu nhẹ trên GPU, tương thích tốt trên cả Safari iOS và Android Chrome.
