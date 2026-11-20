# Báo Cáo Công Việc: Chuẩn Hóa Đa Ngôn Ngữ & Khắc Phục Audio Thuyết Minh Gác Lâu Thăng Long (Lê Sơ)

## 1. Thông Tin Chung
- **Ngày thực hiện:** 20/11/2026
- **Tính năng / Nghiệp vụ:** Khắc phục lỗi audio thuyết minh phát tiếng Anh khi giao diện Tiếng Việt; Chuẩn hóa toàn diện dữ liệu đa ngôn ngữ (6 ngôn ngữ: VI, EN, FR, ZH, KO, JA) cho tác phẩm **Gác Lâu Thăng Long** (Thời Lê Sơ).
- **Người thực hiện:** Antigravity AI Assistant

---

## 2. Mục Tiêu & Yêu Cầu Đặt Ra
1. **Khắc phục lỗi phát tiếng Anh khi giao diện Tiếng Việt:**
   - Tại trang chi tiết tác phẩm Gác Lâu Thăng Long (`/products/gac-lau-thang-long`), giao diện đang chọn ngôn ngữ tiếng Việt (VI) và nội dung văn bản là tiếng Việt ("Âm Vang Lầu Gác Cung Điện Lê Sơ"), nhưng khi bấm nút phát audio thì trình duyệt lại đọc bằng giọng tiếng Anh.
   - Nguyên nhân gốc rễ: `prod-6` (`gac-lau-thang-long`) trước đó chưa có file thu âm audio thực tế (`audioUrl: ''`), khiến component `AudioPlayer` tự động kích hoạt Web Speech API (TTS). Tuy nhiên, trên hệ điều hành Windows/Chrome mặc định không cài sẵn gói giọng tiếng Việt (`vi-VN`), hàm tìm giọng `findBestVoice` trả về `null`. Khi đó `SpeechSynthesis` của trình duyệt tự động dùng giọng mặc định của hệ điều hành (Microsoft David / Zira - tiếng Anh) để đọc từng chữ cái tiếng Việt, tạo ra hiện tượng phát âm tiếng Anh kỳ quặc.
2. **Kiểm tra và chuẩn hóa đa ngôn ngữ cho Gác Lâu Thăng Long (Thời Lê Sơ):**
   - Đảm bảo toàn bộ thông tin tác phẩm (Tên, Tên phụ, Mô tả, Niên đại, Địa điểm, Chất liệu, Hoàn thiện) chuẩn hóa 6 ngôn ngữ (VI, EN, FR, ZH, KO, JA).
   - Bổ sung bản dịch đa ngôn ngữ cho toàn bộ **Điểm khảo cứu kiến trúc (Hotspots 3D)**: Mái chồng diêm ba tầng (`mai-chong-diem`), Đầu đao chạm rồng (`dau-dao-uon-luon`), Bệ đá khảo cổ (`chan-de-khao-co`).
   - Bổ sung 2 khối câu chuyện lịch sử chuyên sâu (**StoryBlocks**) về khảo cổ Hoàng thành Thăng Long và nghệ thuật kiến trúc Lê Sơ kèm đầy đủ bản dịch 6 thứ tiếng.
   - Tạo bộ 6 file audio thuyết minh phòng thu chất lượng cao (Microsoft Neural Voices) cho 6 ngôn ngữ để phát trực tiếp file thu âm chuẩn xác, không bị phụ thuộc vào giọng đọc máy của hệ điều hành người dùng.

---

## 3. Chi Tiết Thay Đổi

### Frontend (`viettoria-FE`)
1. **Component `AudioPlayer.tsx`:**
   - Thêm cơ chế phòng vệ chống phát âm sai ngôn ngữ: Nếu `language === 'vi'` và thiết bị của người dùng không có gói giọng tiếng Việt trong `SpeechSynthesisVoice`, hệ thống tự động chuyển sang phát file âm thanh di sản mẫu chuẩn tiếng Việt (`SAMPLE_AUDIO_URL`), tuyệt đối không để giọng tiếng Anh của máy đọc văn bản tiếng Việt.
   - Đồng bộ hóa logic chọn nguồn âm thanh ngôn ngữ: Ưu tiên `audioGuide.audioUrls[language]` tương ứng với ngôn ngữ đang chọn trước khi dùng TTS.
2. **Dữ liệu `fallbackData.ts`:**
   - Cập nhật `prod-6` với đường dẫn file audio chuẩn studio cho cả 6 ngôn ngữ (`/audio/gac-lau-thang-long-{lang}.mp3`).
   - Thêm 2 khối câu chuyện di sản (`block-gac-lau-1`, `block-gac-lau-2`) phục dựng từ khảo cổ Hoàng thành Thăng Long 18 Hoàng Diệu.
3. **Từ điển đa ngôn ngữ `localizedEntities.ts`:**
   - Cập nhật thời lượng chuẩn cho audio thuyết minh theo từng ngôn ngữ: VI (23s), EN (24s), FR (18s), ZH (16s), KO (16s), JA (21s).
   - Bổ sung bản dịch đầy đủ 5 ngôn ngữ (EN, FR, ZH, KO, JA) cho 2 khối câu chuyện `block-gac-lau-1` và `block-gac-lau-2` trong `STORY_BLOCK_TRANSLATIONS`.
   - Bổ sung bản dịch chi tiết 5 ngôn ngữ cho cả 3 điểm khảo cứu 3D (`mai-chong-diem`, `dau-dao-uon-luon`, `chan-de-khao-co`) trong `HOTSPOT_TRANSLATIONS`.
4. **Bộ sinh audio thuyết minh di sản (Microsoft Azure Neural TTS):**
   - Đã sinh và đóng gói 6 tệp MP3 chuẩn phòng thu vào thư mục `public/audio/`:
     - `gac-lau-thang-long-vi.mp3` (Giọng nữ truyền cảm `vi-VN-HoaiMyNeural`)
     - `gac-lau-thang-long-en.mp3` (Giọng kể chuyện tự nhiên `en-US-JennyNeural`)
     - `gac-lau-thang-long-fr.mp3` (Giọng chuẩn Pháp `fr-FR-DeniseNeural`)
     - `gac-lau-thang-long-zh.mp3` (Giọng chuẩn Trung `zh-CN-XiaoxiaoNeural`)
     - `gac-lau-thang-long-ko.mp3` (Giọng chuẩn Hàn `ko-KR-SunHiNeural`)
     - `gac-lau-thang-long-ja.mp3` (Giọng chuẩn Nhật `ja-JP-NanamiNeural`)

### Backend (`viettoria-BE`)
1. **File `DataInitializer.java`:**
   - Cập nhật `p6` (`VT-HN-006`): Bổ sung `audioUrl` mặc định và JSON `audioUrlsJson` chứa đủ 6 ngôn ngữ để đồng bộ hoàn toàn giữa Database và Frontend.

---

## 4. Danh Mục Tệp Đã Chỉnh Sửa & Tạo Mới

### Files chỉnh sửa
- [AudioPlayer.tsx](file:///c:/personal/viettoria/viettoria-FE/src/components/common/AudioPlayer.tsx)
- [fallbackData.ts](file:///c:/personal/viettoria/viettoria-FE/src/data/fallbackData.ts)
- [localizedEntities.ts](file:///c:/personal/viettoria/viettoria-FE/src/utils/localizedEntities.ts)
- [DataInitializer.java](file:///c:/personal/viettoria/viettoria-BE/src/main/java/com/viettoria/config/DataInitializer.java)

### Files tạo mới (Audio thuyết minh 6 ngôn ngữ)
- [gac-lau-thang-long-vi.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-vi.mp3)
- [gac-lau-thang-long-en.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-en.mp3)
- [gac-lau-thang-long-fr.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-fr.mp3)
- [gac-lau-thang-long-zh.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-zh.mp3)
- [gac-lau-thang-long-ko.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-ko.mp3)
- [gac-lau-thang-long-ja.mp3](file:///c:/personal/viettoria/viettoria-FE/public/audio/gac-lau-thang-long-ja.mp3)

---

## 5. Kết Quả Kiểm Thử & Xác Minh
- **Linter (`oxlint`):** `Finished in 96ms on 74 files with 116 rules - 0 errors`.
- **TypeScript build & Vite bundle:**
  ```bash
  tsc -b && vite build
  ✓ 2146 modules transformed.
  dist/assets/index-YMLJeVj8.js   1,051.28 kB │ gzip: 317.57 kB
  ✓ built in 8.12s
  PWA v2.0.0: precache 68 entries (44732.43 KiB)
  ```
- **Kiểm thử logic Audio:** Khi người dùng ở tiếng Việt, trình phát trực tiếp audio `gac-lau-thang-long-vi.mp3`. Khi đổi sang bất kỳ ngôn ngữ nào (EN, FR, ZH, KO, JA), audio tự động phát đúng tệp tiếng bản địa tương ứng, không còn tình trạng giọng tiếng Anh đọc sai chữ tiếng Việt.

---

## 6. Tồn Đọng & Đề Xuất Tiếp Theo
- Toàn bộ 6 tác phẩm di sản hiện tại đều đã sở hữu đầy đủ bộ tệp âm thanh thuyết minh đa ngữ chuẩn mực.
- Sẵn sàng push lên branch `main` khi có yêu cầu.
