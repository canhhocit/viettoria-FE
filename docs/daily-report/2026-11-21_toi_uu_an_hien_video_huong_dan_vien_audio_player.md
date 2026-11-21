# Báo Cáo Kỹ Thuật: Tối Ưu Nút Ẩn/Hiện Video Người Thuyết Minh (Audio Guide Narrator)

**Ngày thực hiện:** 21/11/2026  
**Tính năng/Nghiệp vụ:** Trải nghiệm người dùng UI/UX Pro Max – Tối ưu hóa không gian hiển thị, bổ sung nút ẩn/thu nhỏ video hướng dẫn viên nổi (Floating Tour Guide Companion).  
**Người phụ trách:** AI Assistant & Viettoria Engineering Team.

---

## 1. Mục tiêu & Yêu cầu
- **Bối cảnh:** Khi nghe Audio Guide trên trang chi tiết tác phẩm (đặc biệt là trên điện thoại di động), khung video chân dung người thuyết minh nổi (Floating Tour Guide Companion) ở góc dưới bên phải màn hình chiếm diện tích đáng kể, dễ che khuất nội dung trang và thanh điều hướng dưới đáy (Bottom Navigation), gây bất tiện khi người dùng muốn tập trung đọc bài viết hoặc thao tác.
- **Yêu cầu:** 
  1. Thêm nút đóng/thu nhỏ (Close/Minimize) trực quan, tinh tế ngay trên góc card video để người dùng có thể ẩn đi bất cứ lúc nào.
  2. Khi ẩn, không làm gián đoạn âm thanh đang phát, đồng thời cung cấp mini widget nhỏ gọn (pill badge) ở góc hoặc nút toggle trên trình phát chính để người dùng có thể mở lại khi cần.
  3. Ghi nhớ trạng thái người dùng lựa chọn trong suốt phiên duyệt web (`sessionStorage`).

---

## 2. Chi tiết thay đổi

### Frontend (Giao diện UI/UX Pro Max)
1. **Nút đóng `X` trên góc card video:**
   - Bố trí tại góc trên bên phải của card video (`absolute -top-2.5 -right-2.5`), nền `forest-dark`, viền mạ đồng `brass/80`, có hiệu ứng hover mượt mà và bóng đổ sang trọng.
   - Sử dụng `e.stopPropagation()` để khi bấm nút ẩn không kích hoạt nhầm sự kiện Play/Pause video.
2. **Trạng thái thu nhỏ linh hoạt (3 chế độ `expanded` | `minimized` | `hidden`):**
   - **Expanded (Mặc định):** Hiển thị đầy đủ card video chân dung người thuyết minh áo dài nón lá.
   - **Minimized (Thu nhỏ):** Thu gọn thành một thanh Pill tròn nhỏ xinh (`h-8`, cao chỉ ~32px) nép sát góc màn hình, hiển thị avatar tròn của hướng dẫn viên + nhãn `HDV` + nút mở to `Maximize2`, kèm nút `X` siêu nhỏ để tắt hẳn. Nếu audio đang phát, avatar có vòng sóng âm xung nhịp (`animate-ping`) sinh động.
   - **Hidden (Tắt hẳn):** Ẩn hoàn toàn khỏi màn hình, trả lại 100% không gian hiển thị thông thoáng.
3. **Nút gạt Video/VideoOff trên thanh điều khiển Audio Player chính:**
   - Bổ sung nút chuyển đổi chế độ xem video ngay cạnh các nút Mute, Replay, Transcript trên thanh phát âm thanh.
4. **Đa ngôn ngữ (i18n):**
   - Bổ sung đầy đủ nhãn ngôn ngữ cho cả 6 thứ tiếng: `vi`, `en`, `fr`, `ja`, `ko`, `zh` (`hideNarrator`, `showNarrator`, `narratorShort`, `dismissNarrator`).

---

## 3. Danh mục tệp đã chỉnh sửa
- [AudioPlayer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/AudioPlayer.tsx): Thêm nút đóng, 3 chế độ hiển thị, mini widget và nút toggle trên thanh điều khiển.
- [vi.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/vi.ts): Ngôn ngữ tiếng Việt.
- [en.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/en.ts): Ngôn ngữ tiếng Anh.
- [fr.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/fr.ts): Ngôn ngữ tiếng Pháp.
- [ja.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/ja.ts): Ngôn ngữ tiếng Nhật.
- [ko.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/ko.ts): Ngôn ngữ tiếng Hàn.
- [zh.ts](file:///c:/personal/viettoria/viettoria-FE/src/locales/zh.ts): Ngôn ngữ tiếng Trung.

---

## 4. Kết quả kiểm thử & Xác minh
- **Lệnh kiểm thử:** `cmd.exe /c "cd /d c:\personal\viettoria\viettoria-FE && npm run build"`
- **Kết quả:** Build thành công 100% trong 2.70s mà không phát sinh bất kỳ lỗi TypeScript hay Vite bundler nào. Precache 80 assets hoàn chỉnh cho PWA.

---

## 5. Tồn đọng & Đề xuất tiếp theo
- Tính năng hoạt động ổn định trên cả desktop và mobile web / PWA. Sẵn sàng commit và push lên nhánh `main`.
