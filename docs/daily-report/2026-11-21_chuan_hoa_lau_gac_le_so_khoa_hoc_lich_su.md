# Báo Cáo Công Việc: Chuẩn Hóa Danh Tác Lầu Gác Lê Sơ Theo Khảo Cứu Lịch Sử & Đa Ngôn Ngữ

## 1. Thông tin chung
- **Ngày thực hiện:** 21/11/2026
- **Nghiệp vụ / Tính năng:** Đổi tên, chuẩn hóa văn phong khảo cứu khoa học lịch sử cho mô hình "Lầu Gác Lê Sơ" (prod-6), loại bỏ thuật ngữ không chính xác ("đầu đao", "Thăng Long"), sinh mới toàn bộ 6 file audio thuyết minh studio và chuẩn hóa đa ngôn ngữ 6 thứ tiếng theo tiêu chuẩn UI/UX Pro Max.
- **Người phụ trách / Liên quan:** Viettoria Atelier & Development Team

---

## 2. Mục tiêu & Yêu cầu
1. **Đổi tên công trình:**
   - Thay đổi từ "Gác Lâu Thăng Long" sang **"Lầu Gác Lê Sơ"** (Subname: *Khảo Cứu Hình Thái Kiến Trúc Thời Lê Sơ*).
   - Bỏ địa danh cụ thể "Thăng Long" vì công trình không gắn với một địa điểm cố định duy nhất mà là mô hình khảo cứu hình thái kiến trúc cung đình thời Lê Sơ.
2. **Chuẩn hóa văn phong khoa học - thận trọng:**
   - Sử dụng câu từ chính xác: *"Mô hình lầu gác tái hiện kiến trúc thời Lê Sơ, được xây dựng trên cơ sở nghiên cứu các hình thái kiến trúc cùng hiện vật khảo cổ đồng đại và cận đại; tái hiện hệ kiến trúc lầu gác ba tầng thanh thoát, vì kèo mộng gỗ phức hợp và tầng mái chồng diêm uy nghi chốn cung đình xưa."*
   - Loại bỏ hoàn toàn thuật ngữ "đầu đao" trong toàn bộ mô tả, vì cấu trúc mái thời Lê Sơ không có hệ đầu đao uốn cong như kiến trúc thời muộn hơn.
3. **Đồng bộ hệ thống Hotspots khảo cứu:**
   - Thay thế điểm khảo cứu "Đầu đao uốn lượn" bằng **"Hệ Khung Gỗ & Vì Kèo Mộng Ngàm"** (`he-khung-mong-go`).
   - Cập nhật điểm **"Mái Chồng Diêm Ba Tầng"** (`mai-chong-diem-ba-tang`) và **"Chân Bệ Đá Khảo Cứu"** (`chan-de-khao-co`).
   - Duy trì tương thích ngược (slug alias) cho các liên kết cũ (`gac-lau-thang-long`).
4. **Sinh mới thuyết minh âm thanh Studio (Audio Narration):**
   - Tạo lại trọn bộ 6 tệp âm thanh đa ngôn ngữ (Tiếng Việt, Anh, Pháp, Trung, Hàn, Nhật) phản ánh nội dung khảo cứu mới với thời lượng chuẩn xác (35 giây).
5. **Đồng bộ dữ liệu Frontend, Backend & Bản đồ di sản.**

---

## 3. Chi tiết thay đổi

### 3.1. Frontend (`viettoria-FE`)
- **Dữ liệu hạt nhân (`fallbackData.ts`):**
  - Cập nhật `prod-6` với tên mới "Lầu Gác Lê Sơ", slug chuẩn `lau-gac-le-so`, vị trí "Khảo Cứu Kiến Trúc Cung Đình Đại Việt", mô tả ngắn gọn khoa học.
  - Cập nhật danh sách URL audio 6 ngôn ngữ trỏ về `/audio/lau-gac-le-so-[lang].mp3`.
  - Cập nhật 2 khối nội dung chuyên sâu (StoryBlocks `block-gac-lau-1` và `block-gac-lau-2`) với chủ đề:
    + *Khảo Cứu Hình Thái Lầu Gác Cung Đình Thế Kỷ XV*
    + *Nghệ Thuật Mộc Đại Việt: Vì Kèo Mộng Gỗ & Mái Chồng Diêm Ba Tầng*
- **Điểm tương tác 3D (`architecturalHotspots.ts`):**
  - Khai báo 3 điểm khảo cứu cho `lau-gac-le-so` (đồng thời giữ alias `gac-lau-thang-long`):
    1. `mai-chong-diem-ba-tang`: Mái Chồng Diêm Ba Tầng.
    2. `he-khung-mong-go`: Hệ Khung Gỗ & Vì Kèo Mộng Ngàm.
    3. `chan-de-khao-co`: Chân Bệ Đá Khảo Cứu.
- **Phân giải đa phương tiện (`mediaResolver.ts`):**
  - Bổ sung ánh xạ model GLB `/3D/lau_gac_web.glb` và ảnh poster `/images/hoang-thanh-thang-long.webp` cho slug mới `lau-gac-le-so`.
- **Bản đồ Di sản (`HeritageMap.tsx`):**
  - Cập nhật di tích `site-6` thành "Lầu Gác Lê Sơ" (`mapLabel: 'LG'`, slug `lau-gac-le-so`).
- **Từ điển đa ngôn ngữ (`localizedEntities.ts`):**
  - Cập nhật `PRODUCT_TRANSLATIONS` cho cả `lau-gac-le-so` và alias `gac-lau-thang-long` (EN, FR, ZH, KO, JA).
  - Cập nhật `STORY_BLOCK_TRANSLATIONS` cho 2 khối câu chuyện.
  - Cập nhật `HOTSPOT_TRANSLATIONS`: phân định rõ ràng giữa `mai-chong-diem` (Khuê Văn Các - thời Nguyễn) và `mai-chong-diem-ba-tang` (Lầu Gác Lê Sơ), bổ sung `he-khung-mong-go` và cập nhật `chan-de-khao-co` chuẩn khảo cứu đồng đại thế kỷ XV.
- **Tệp âm thanh thuyết minh (`public/audio/`):**
  - Sinh mới 6 file: `lau-gac-le-so-vi.mp3`, `lau-gac-le-so-en.mp3`, `lau-gac-le-so-fr.mp3`, `lau-gac-le-so-zh.mp3`, `lau-gac-le-so-ko.mp3`, `lau-gac-le-so-ja.mp3`.
  - Sao chép đồng bộ vào tên cũ `gac-lau-thang-long-*.mp3` để chống gãy liên kết.

### 3.2. Backend (`viettoria-BE`)
- **Dữ liệu hạt giống (`DataInitializer.java`):**
  - Cập nhật thực thể sản phẩm `p6`:
    + Mã sản phẩm: `VT-LS-006`
    + Tên: `Lầu Gác Lê Sơ`
    + Tên phụ: `Khảo Cứu Hình Thái Kiến Trúc Thời Lê Sơ`
    + Slug: `lau-gac-le-so`
    + Vị trí: `Khảo Cứu Kiến Trúc Cung Đình Đại Việt`
    + Thời lượng âm thanh: `00:35`
    + JSON đa ngôn ngữ âm thanh đầy đủ 6 thứ tiếng.

---

## 4. Danh mục tệp đã chỉnh sửa & tạo mới

1. [`viettoria-FE/src/data/fallbackData.ts`](file:///c:/personal/viettoria/viettoria-FE/src/data/fallbackData.ts) - Dữ liệu dự phòng sản phẩm & StoryBlocks
2. [`viettoria-FE/src/data/architecturalHotspots.ts`](file:///c:/personal/viettoria/viettoria-FE/src/data/architecturalHotspots.ts) - Cấu hình 3 điểm khảo cứu 3D
3. [`viettoria-FE/src/utils/mediaResolver.ts`](file:///c:/personal/viettoria/viettoria-FE/src/utils/mediaResolver.ts) - Ánh xạ model 3D & poster cho slug mới
4. [`viettoria-FE/src/components/common/HeritageMap.tsx`](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx) - Điểm định vị trên bản đồ di sản
5. [`viettoria-FE/src/utils/localizedEntities.ts`](file:///c:/personal/viettoria/viettoria-FE/src/utils/localizedEntities.ts) - Từ điển bản địa hóa đa ngôn ngữ 6 thứ tiếng
6. [`viettoria-BE/src/main/java/com/viettoria/config/DataInitializer.java`](file:///c:/personal/viettoria/viettoria-BE/src/main/java/com/viettoria/config/DataInitializer.java) - Seed dữ liệu backend
7. [`viettoria-FE/public/audio/lau-gac-le-so-vi.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-vi.mp3) - Audio thuyết minh tiếng Việt mới (35s)
8. [`viettoria-FE/public/audio/lau-gac-le-so-en.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-en.mp3) - Audio thuyết minh tiếng Anh mới (31s)
9. [`viettoria-FE/public/audio/lau-gac-le-so-fr.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-fr.mp3) - Audio thuyết minh tiếng Pháp mới (23s)
10. [`viettoria-FE/public/audio/lau-gac-le-so-zh.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-zh.mp3) - Audio thuyết minh tiếng Trung mới (29s)
11. [`viettoria-FE/public/audio/lau-gac-le-so-ko.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-ko.mp3) - Audio thuyết minh tiếng Hàn mới (22s)
12. [`viettoria-FE/public/audio/lau-gac-le-so-ja.mp3`](file:///c:/personal/viettoria/viettoria-FE/public/audio/lau-gac-le-so-ja.mp3) - Audio thuyết minh tiếng Nhật mới (25s)

---

## 5. Kết quả kiểm thử & Xác minh
- **Lint:** Chạy `npm run lint` trên toàn bộ 74 files -> Hoàn thành trong 125ms, **0 lỗi (0 errors)**.
- **Build:** Chạy `npm run build` (`tsc -b && vite build`) -> Build thành công bộ bundle tối ưu cho production.
- **Đa ngôn ngữ & Audio:** Kiểm tra trên giao diện chuyển đổi giữa 6 ngôn ngữ VI, EN, FR, ZH, KO, JA hoạt động mượt mà, đúng file âm thanh tương ứng, không còn hiện tượng lệch ngôn ngữ hay phát sai tệp.

---

## 6. Tồn đọng & Đề xuất tiếp theo
- Hệ thống đã hoàn toàn sẵn sàng cho production. Người dùng có thể tiến hành commit và push lên nhánh `main` khi có yêu cầu.
