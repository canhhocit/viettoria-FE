# Báo Cáo Kỹ Thuật: Canh Chỉnh Hiển Thị Trọn Vẹn Ảnh Lầu Gác Lê Sơ Trên Thẻ Tác Phẩm

**Ngày thực hiện:** 23/11/2026  
**Tính năng/Nghiệp vụ:** Tối ưu hóa hiển thị hình ảnh trên thẻ sản phẩm (Product Card Image Framing) – Ngăn chặn cắt cụt phần chóp mái và chân đế của mô hình lầu gác ba tầng.  
**Người phụ trách:** AI Assistant & Viettoria Engineering Team.

---

## 1. Mục tiêu & Yêu cầu
- **Bối cảnh:** Trên danh mục tác phẩm (`/products`, `/collections/:slug`, và mục tác phẩm liên quan tại `/products/:slug`), thẻ tác phẩm **Lầu Gác Lê Sơ** sử dụng khung hình ngang tỉ lệ 16:10 với thuộc tính `object-cover`.
- **Vấn đề phát sinh:** Ảnh mô hình `2D-laugac2.jpg` có tỉ lệ dọc (1080x1350, chiều cao lớn hơn chiều rộng). Khi đặt thuộc tính `object-cover` trong khung ngang 16:10, ảnh bị phóng to theo chiều ngang, khiến đỉnh mái tầng 3 và chân đế cột tầng 1 bị cắt cụt (cropped off).
- **Yêu cầu:** Tinh chỉnh để ảnh hiển thị thu nhỏ vừa vặn, thấy được toàn bộ kết cấu từ chóp mái tới chân đế của lầu gác mà không bị cắt góc.

---

## 2. Chi tiết thay đổi
- Chuyển chế độ hiển thị từ `object-cover` sang `object-contain p-2` kết hợp nền trắng `bg-white` đồng bộ màu nền ảnh gốc cho tác phẩm Lầu Gác Lê Sơ trên tất cả các trang:
  1. [ProductsPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/ProductsPage.tsx): Danh mục tất cả tác phẩm.
  2. [CollectionDetailPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/CollectionDetailPage.tsx): Trang chi tiết bộ sưu tập.
  3. [ProductDetailPage.tsx](file:///c:/personal/viettoria/viettoria-FE/src/pages/ProductDetailPage.tsx): Khu vực gợi ý tác phẩm cùng thời kỳ.

---

## 3. Kết quả kiểm thử & Triển khai
- **Kiểm thử build:** `npm run build` hoàn tất thành công, không có lỗi.
- **Git Push:** Đã commit và push trực tiếp lên nhánh `main` của repo Frontend (`b03d5c5`).
