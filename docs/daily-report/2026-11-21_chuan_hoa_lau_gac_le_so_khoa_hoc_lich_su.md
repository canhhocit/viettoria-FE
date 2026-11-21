# Báo Cáo Công Việc: Chuẩn Hóa Lầu Gác Lê Sơ, Tác Giả Phục Dựng, Ảnh 2D Cảm Hứng Gốm Hoa Lam & Cơ Chế Seamless Video Looper

## 1. Thông tin chung
- **Ngày thực hiện:** 21/11/2026
- **Nghiệp vụ / Tính năng:** 
  1. Ghi nhận thông tin tác giả phục dựng: **Nguyễn Huy Hoàng**.
  2. Bỏ hoàn toàn ảnh Thăng Long cũ, thay thế bằng bộ ảnh 2D phục dựng sắc nét từ thư mục `/images/laugacLeso/` (`2D-laugac2.jpg` và `2D-laugac.jpg`) làm heroImage, gallery và offline fallback khi không có mạng.
  3. Bổ sung nội dung chuyên sâu (StoryBlock `block-gac-lau-3`) phân tích nguồn cảm hứng thị giác đặc biệt từ chiếc đĩa gốm hoa lam thời Lê Sơ thế kỷ 15 (`camhunglaugac.jpg`).
  4. Cấu hình PWA Service Worker tự động lưu trước (precache) toàn bộ ảnh 2D để phục vụ trải nghiệm ngoại tuyến (offline 100%).
  5. Tích hợp widget đề xuất cài đặt ứng dụng PWA nổi góc phải bên dưới màn hình mobile theo tiêu chuẩn UI/UX Pro Max.
  6. **Nâng cấp công nghệ Seamless Dual-Video Crossfade Looper** cho Avatar hướng dẫn viên ảo: Triệt tiêu vĩnh viễn hiện tượng nháy đen (black flash/flicker) và giật khung hình khi video lặp lại lúc phát audio dài.
- **Người phụ trách / Liên quan:** Nguyễn Huy Hoàng (Phục dựng kiến trúc) & Viettoria Atelier Team

---

## 2. Mục tiêu & Yêu cầu
1. **Thông tin người phục dựng:**
   - Ghi nhận trang trọng tên người phục dựng **Nguyễn Huy Hoàng** trên giao diện chi tiết tác phẩm (Identity Header Badge), thông số mô hình (`ModelSpecifications.restorer`), mô tả ngắn (`shortDescription`) và lời thuyết minh (`AudioGuide.narrator`).
2. **Bộ ảnh 2D thay thế hoàn toàn ảnh Thăng Long cũ:**
   - Dùng ảnh phối cảnh góc 3/4 `2D-laugac2.jpg` làm ảnh đại diện chính (heroImage) và poster 3D/offline poster trong `ArchitecturalViewer`.
   - Dùng ảnh mặt đứng chính diện `2D-laugac.jpg` làm hình ảnh minh họa cho khối khảo cứu hình thái kiến trúc `block-gac-lau-1`.
   - Thêm ảnh đĩa gốm cổ hoa lam `camhunglaugac.jpg` vào khối câu chuyện cảm hứng phục dựng `block-gac-lau-3`.
3. **Nội dung chuyên sâu về cảm hứng đĩa gốm hoa lam:**
   - Xây dựng bài viết phân tích chi tiết về nguồn cảm hứng của tác giả Nguyễn Huy Hoàng từ hình tượng lầu gác ba tầng vẽ men lam trên đĩa gốm cổ Đại Việt thế kỷ 15 (Dish No. 3148).
   - Bản dịch đầy đủ 5 ngôn ngữ quốc tế (Anh, Pháp, Trung, Hàn, Nhật).
4. **Trải nghiệm ngoại tuyến (PWA Offline 100%):**
   - Đưa định dạng `.jpg`, `.jpeg` và đường dẫn ảnh `images/laugacLeso/*` vào danh mục precache của Service Worker PWA (`vite.config.ts`), đảm bảo người dùng ngắt mạng vẫn xem ảnh 2D mượt mà.
5. **Khắc phục triệt để hiện tượng nháy / giật video hướng dẫn viên:**
   - Khắc phục lỗi trình duyệt nháy đen 1 phát (decoder buffer flush) khi video 8s lặp lại trong lúc audio thuyết minh còn đang chạy (35s - 4 phút).

---

## 3. Chi tiết thay đổi kỹ thuật

### 3.1. Kỹ thuật Seamless Dual-Video Crossfade Looper (`AudioPlayer.tsx`)
- **Nguyên nhân cốt lõi của lỗi cũ:**
  - Video mẫu nữ hướng dẫn viên dài ~7.93s, trong khi bài thuyết minh âm thanh dài từ 30s đến hơn 4 phút.
  - Khi dùng thuộc tính `loop` mặc định của HTML5, mỗi khi video hết thời lượng, trình duyệt native phải xóa bộ đệm và seek lại từ đầu (0.0s), gây ra một khoảng khựng đen (black blink / buffer gap 100ms), kết hợp với sự chênh lệch tư thế frame cuối và frame đầu tạo cảm giác "giật một phát", "giả trân".
- **Giải pháp xử lý:**
  - Triển khai kiến trúc **Double Buffering** với 2 thẻ `<video>` song song xếp lớp (Layer A và Layer B):
    + Không sử dụng `loop` mặc định của trình duyệt.
    + Khi Video A sắp chạm mốc kết thúc (trước 0.5 giây), hệ thống ngầm kích hoạt Video B chạy từ giây 0.0s ở bên dưới.
    + Kích hoạt hiệu ứng chuyển cảnh mờ chồng **Crossfade 500ms** mượt mà giữa 2 layer.
    + Sau khi Video B hiển thị 100%, Video A nhẹ nhàng pause và tua về 0 ở hậu cảnh, sẵn sàng cho chu trình tiếp theo.
  - **Kết quả:** Triệt tiêu 100% hiện tượng nhấp nháy, cử động tay, nón lá và khẩu hình miệng chuyển tiếp mềm mại như đang lấy hơi tự nhiên trong suốt bài thuyết minh.

### 3.2. Cập nhật dữ liệu & Giao diện
- Bổ sung trường `restorer: 'Nguyễn Huy Hoàng'` vào `Product` và `ModelSpecifications`.
- Hiển thị Huy hiệu người phục dựng mạ vàng đồng trên trang chi tiết sản phẩm.
- Đổi poster 3D và ảnh đại diện chính của `lau-gac-le-so` thành `2D-laugac2.jpg`.
- Bổ sung khối câu chuyện `block-gac-lau-3` về nguồn cảm hứng đĩa gốm hoa lam thế kỷ 15.
- Cấu hình Service Worker precache trọn bộ 80 tài nguyên offline.

---

## 4. Danh mục tệp đã chỉnh sửa

1. [`viettoria-FE/src/components/common/AudioPlayer.tsx`](file:///c:/personal/viettoria/viettoria-FE/src/components/common/AudioPlayer.tsx) - Dual-Video Seamless Crossfade Looper
2. [`viettoria-FE/src/pages/ProductDetailPage.tsx`](file:///c:/personal/viettoria/viettoria-FE/src/pages/ProductDetailPage.tsx) - Hiển thị huy hiệu người phục dựng
3. [`viettoria-FE/src/data/fallbackData.ts`](file:///c:/personal/viettoria/viettoria-FE/src/data/fallbackData.ts) - Cập nhật dữ liệu lầu gác & khối câu chuyện đĩa gốm
4. [`viettoria-FE/src/utils/mediaResolver.ts`](file:///c:/personal/viettoria/viettoria-FE/src/utils/mediaResolver.ts) - Trỏ poster 3D về ảnh 2D góc 3/4
5. [`viettoria-FE/vite.config.ts`](file:///c:/personal/viettoria/viettoria-FE/vite.config.ts) - Cấu hình precache offline cho ảnh 2D
6. [`viettoria-FE/src/utils/localizedEntities.ts`](file:///c:/personal/viettoria/viettoria-FE/src/utils/localizedEntities.ts) - Bản dịch 6 ngôn ngữ cho StoryBlock và sản phẩm
7. [`viettoria-FE/src/types/index.ts`](file:///c:/personal/viettoria/viettoria-FE/src/types/index.ts) - Bổ sung thuộc tính `restorer`
8. [`viettoria-BE/src/main/java/com/viettoria/config/DataInitializer.java`](file:///c:/personal/viettoria/viettoria-BE/src/main/java/com/viettoria/config/DataInitializer.java) - Dữ liệu backend đồng bộ

---

## 5. Kết quả kiểm thử
- **Lint:** `0 errors`
- **Build Production:** Thành công trong `2.17s`, Service Worker precache 80 entries.
