# Báo Cáo Công Việc: Tối Ưu Hóa & Redesign Toàn Diện Giao Diện Mobile Theo Chuẩn UI/UX Pro Max

## 1. Thông Tin Chung
* **Ngày thực hiện:** 18/11/2026
* **Nghiệp vụ / Tính năng:** Redesign giao diện Mobile Responsive cho nền tảng Viettoria Atelier (Phygital Heritage Collectibles)
* **Quy chuẩn thiết kế:** Tích hợp bộ tiêu chuẩn **UI/UX Pro Max** với nhận diện thương hiệu **Heritage Atelier / Luxury Editorial** (Anti-AI-Slop, chống bo góc tròn đại trà, chống màu neon, dùng chất liệu thực Giấy dó - Gỗ lim then - Vàng lá - Đá phiến - Mộng khớp kiến trúc cổ).

---

## 2. Mục Tiêu & Yêu Cầu
1. Khắc phục triệt để các hạn chế của giao diện di động trước đây:
   * Menu di động đơn điệu, thiếu phân cấp thị giác và điểm chạm xúc giác.
   * Thiếu thanh điều hướng dưới ngón tay cái (Thumb-friendly Bottom Dock).
   * Hero section trên màn hình nhỏ bị chèn ép chữ, các nút hành động bị lệch hoặc đẩy ra khỏi màn hình đầu tiên (above-the-fold).
   * Băng chuyền 3D (Carousel) tải đồng thời 15 WebGL model-viewers gây tràn bộ nhớ GPU, giật lag trên smartphone.
   * Khung đối sánh 1900 ↔ 2026 bị xung đột cuộn trang dọc khi kéo ngang, và ảnh quá khứ bị méo tỉ lệ khi cắt lát.
   * Trình xem 3D trên mobile hiển thị 5 thẻ chú thích trôi nổi (callout cards) che khuất toàn bộ công trình, cản trở thao tác xoay lật 360°.
   * Bản đồ di sản bị chia cột dọc dồn toàn bộ bảng thông tin lên trên bản đồ khiến người dùng phải cuộn rất dài mới thấy bản đồ.
2. Nâng cấp trải nghiệm đạt chuẩn bảo tàng số cao cấp, mang lại hiệu ứng thị giác "Thật WOW", vừa vặn với kích thước màn hình smartphone từ 360px đến 428px+.

---

## 3. Chi Tiết Thay Đổi

### A. Giao Diện & Trải Nghiệm Mobile (UI/UX Pro Max)
1. **Thanh Điều Hướng Đáy Di Động Đẳng Cấp Hoàng Gia ([MobileBottomNav.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/MobileBottomNav.tsx)):**
   * Thiết kế kính mờ sơn then cổ (`bg-[#0D1C16]/96 backdrop-blur-lg border-t border-brass/35`).
   * 4 điểm chạm chính: Khám Phá (Home), Tác Phẩm (3D Models), Bộ Sưu Tập (Collections), Bản Đồ (Map).
   * Tâm điểm nút tròn vàng thếp nhô cao: Quét Tem QR với hiệu ứng tỏa sóng (radar pulse) hỗ trợ tra cứu trực tiếp tem phygital trên mô hình vật lý.
   * Hỗ trợ chuẩn safe-area cho iOS / Android gesture navigation.

2. **Tủ Điều Hướng Thư Viện Chuyên Sâu ([Header.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/Header.tsx)):**
   * Ngăn kéo di động phong cách tủ trưng bày giám tuyển (Curatorial Cabinet), nền giấy dó dập vân, viền kim loại đồng cổ.
   * Mỗi danh mục có biểu tượng SVG chuyên biệt và chú thích bối cảnh lịch sử, huy hiệu trạng thái "Đang xem".
   * Tích hợp bảng chuyển đổi nhanh đa ngữ (6 quốc gia) và trình phát không gian âm thanh chuông chùa / âm vang di sản.

3. **Hero Section Cô Đọng & Tinh Tế ([HomePage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/HomePage.tsx)):**
   * Typography `clamp` linh hoạt, bảo đảm không bị rớt dòng ngắt dấu tiếng Việt trên màn hình nhỏ.
   * Bổ sung nhãn giám tuyển: `✦ DI SẢN KIẾN TRÚC VIỆT · TỶ LỆ 1:120`.
   * Cụm nút bấm kép kích thước chuẩn ngón tay cái (min-height 48px) kèm vệt sáng vàng lá (gold glint).
   * Mũi tên chỉ dẫn cuộn trang chuyển động nhịp nhàng (bouncing brass chevron).

4. **Băng Chuyền Mô Hình 3D Vòng Lặp Vô Tận ([HeritageModelCarousel.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/HeritageModelCarousel.tsx)):**
   * Cơ chế Hybrid Mobile 3D: hiển thị poster độ nét cao kèm nút "Chạm để xoay 3D", kích hoạt WebGL theo nhu cầu (On-demand WebGL), loại bỏ hoàn toàn nguy cơ sập context GPU trên Safari/Chrome mobile.
   * Hỗ trợ vuốt chạm bắt dính (`snap-x snap-mandatory snap-center`).
   * Thanh chỉ thị số lượng tác phẩm và hướng dẫn cử chỉ trực quan.

5. **Khảo Cứu Xuyên Thế Kỷ 1900 ↔ 2026 ([TimeTravelComparison.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/TimeTravelComparison.tsx)):**
   * Sử dụng thuật toán CSS `clip-path: inset(...)` bảo đảm ảnh cổ 1896 và ảnh phục dựng 2026 đồng nhất tỉ lệ 1:1 từng điểm ảnh khi kéo thanh trượt.
   * Khắc phục xung đột cảm ứng: trang bị `touch-none` và các sự kiện `onTouchStart`, `onTouchMove`, `onTouchEnd` giúp kéo thanh trượt mượt mà, không bị nhảy trang.
   * Thanh chọn di tích dạng cuộn ngang vuốt êm ái.

6. **Bóc Tách Cấu Kiện Mộng Gỗ ([ExplodedJoineryViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/ExplodedJoineryViewer.tsx)):**
   * Tối ưu tỉ lệ khung nhìn bản vẽ bóc tách trên mobile (`aspect-square` / `aspect-[4/3]`).
   * Cụm nút chọn cấu kiện tầng Mái - Thân gác - Bệ đá dạng thẻ xúc giác dễ bấm.
   * Thông tin chi tiết mộng khớp cổ truyền hiển thị rõ ràng, khoa học.

7. **Trình Trưng Bày 3D Chuyên Nghiệp ([ArchitecturalViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/ArchitecturalViewer.tsx)):**
   * Đột phá trải nghiệm: Thay vì chồng chất 5 bảng chữ che kín màn hình di động, hệ thống sử dụng **Khay Giám Tuyển Đáy Di Động (Curatorial Bottom Sheet)**.
   * Trên bề mặt mô hình 3D chỉ giữ các điểm phát sáng radar; người dùng chạm vào điểm bất kỳ sẽ mở khay thông tin phía đáy với nút "Trước / Tiếp theo" để máy quay tự động lướt đến từng chi tiết kiến trúc.
   * Thao tác 1 ngón tay xoay 360°, 2 ngón tay thu phóng tự do không bị cản trở.

8. **Bản Đồ Di Sản Phân Tầng Di Động ([HeritageMap.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx)):**
   * Bổ sung thanh chuyển đổi linh hoạt: `[Bản Đồ Di Sản] | [Danh Sách Di Tích]`.
   * Ở chế độ Bản đồ: Bản đồ Leaflet mở rộng toàn màn hình, chạm vào điểm ghim sẽ trượt lên thẻ tóm tắt di sản ở góc đáy, kèm nút bấm trực tiếp vào phòng trưng bày 3D.
   * Tự động gọi `map.invalidateSize()` khi chuyển tab để đảm bảo bản đồ không bị lỗi tọa độ hay xé hình.

9. **Danh Mục & Bộ Lọc Tác Phẩm ([ProductsPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/ProductsPage.tsx) & [CollectionsPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/CollectionsPage.tsx)):**
   * Bộ lọc thời đại dạng thanh trượt ngang không xuống hàng lộn xộn.
   * Ô tìm kiếm có nút xóa nhanh ký tự (Clear search).
   * Thẻ tác phẩm thu gọn khoảng đệm phù hợp màn hình nhỏ, nổi bật thông số tỷ lệ 1:120 và niên đại.

---

## 4. Danh Mục Tệp Đã Chỉnh Sửa & Tạo Mới

| STT | Tệp tin | Trạng thái | Nội dung chính |
|---|---|---|---|
| 1 | [MobileBottomNav.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/MobileBottomNav.tsx) | Tạo mới | Thanh điều hướng đáy di động phong cách Atelier cao cấp |
| 2 | [MainLayout.tsx](file:///c:/personal/viettoria/viettoria-FE/src/layouts/MainLayout.tsx) | Cập nhật | Tích hợp MobileBottomNav và bù khoảng đệm an toàn `pb-16 md:pb-0` |
| 3 | [Header.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/Header.tsx) | Cập nhật | Tủ điều hướng di động cao cấp, bổ sung biểu tượng và chú thích |
| 4 | [HomePage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/HomePage.tsx) | Cập nhật | Tối ưu Hero responsive, nút bấm ngón tay cái, nhãn giám tuyển |
| 5 | [HeritageModelCarousel.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/HeritageModelCarousel.tsx) | Cập nhật | Chế độ tải 3D theo yêu cầu, bắt dính cảm ứng, gợi ý vuốt ngang |
| 6 | [TimeTravelComparison.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/TimeTravelComparison.tsx) | Cập nhật | Khớp ảnh 1:1 qua clipPath, chống trượt dọc khi kéo, thanh tab cuộn |
| 7 | [ExplodedJoineryViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/heritage/ExplodedJoineryViewer.tsx) | Cập nhật | Tối ưu khung bóc tách tỉ lệ vàng, tab cấu kiện xúc giác |
| 8 | [ArchitecturalViewer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/ArchitecturalViewer.tsx) | Cập nhật | Khay giám tuyển đáy di động (Bottom Sheet), bảo vệ vùng xoay 3D |
| 9 | [ProductsPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/ProductsPage.tsx) | Cập nhật | Thanh lọc cuộn ngang, nút xóa nhanh tìm kiếm, thẻ sản phẩm gọn gàng |
| 10 | [CollectionsPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/CollectionsPage.tsx) | Cập nhật | Tối ưu biên niên sử và danh sách bộ sưu tập trên mobile |
| 11 | [HeritageTimeline.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageTimeline.tsx) | Cập nhật | Trục thời gian cuộn ngang 1049-1863, thẻ spotlight phản hồi nhạy |
| 12 | [HeritageMap.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/HeritageMap.tsx) | Cập nhật | Bộ chuyển đổi tab Bản đồ / Danh sách, thẻ nổi xem nhanh di tích |
| 13 | [Footer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/Footer.tsx) | Cập nhật | Bù khoảng đệm `pb-24 md:py-12` tránh bị che khuất bởi Bottom Nav |
| 14 | [QRScanModal.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/QRScanModal.tsx) | Cập nhật | Nút bấm và kiểu dáng sơn then cổ đồng bộ |
| 15 | [index.css](file:///c:/personal/viettoria/viettoria-FE/src/index.css) | Cập nhật | Thêm utilities `.no-scrollbar`, `.pb-safe`, `.pt-safe`, `.animate-spin-slow` |

---

## 5. Kết Quả Kiểm Thử & Xác Minh
* **Build kiểm tra:** `npm run build`
  * Trình biên dịch: TypeScript + Vite v8.3.5.
  * Kết quả: **Thành công (0 lỗi)**, hoàn tất trong 2.05s.
* **Linter kiểm tra:** `npm run lint` (Oxlint)
  * Kết quả: **0 lỗi** trên 72 tệp nguồn.
* **Xác thực thực tế:** Chạy Vite Dev Server trên `http://127.0.0.1:5173/`, kiểm thử kích thước viewport mobile chuẩn (390x844 - iPhone / Android cao cấp).

---

## 6. Đề Xuất & Lưu Ý Tiếp Theo
* Mô hình 3D trên mobile tải mượt và tiết kiệm pin nhờ cơ chế on-demand WebGL.
* Các hiệu ứng âm thanh chuông và nhạc nền di sản tự động thích ứng với chính sách user-gesture của trình duyệt di động.
