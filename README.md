# Tra Cứu Địa Giới & Đơn Vị Hành Chính Mới Việt Nam 2026

**Tác giả:** **MH-SAMA**  
**Căn cứ pháp lý:** Nghị quyết số 202/2025/QH15 của Quốc hội khóa XV (hiệu lực từ 01/07/2025: Giảm từ 63 xuống 34 đơn vị cấp tỉnh & chuẩn hóa mô hình chính quyền địa phương 2 cấp) kết hợp các Nghị quyết sắp xếp đơn vị hành chính cấp xã của Ủy ban Thường vụ Quốc hội.

🌐 **Truy cập trực tuyến trên mọi thiết bị:**  
👉 **[https://hieutruongvn97.github.io/vietnam-dia-chinh-2026/](https://hieutruongvn97.github.io/vietnam-dia-chinh-2026/)**

---

## 🌟 Tính Năng Nổi Bật

1. **Tra Cứu Hai Chiều Toàn Diện:**
   - **Cũ ➔ Mới (63 tỉnh ➔ 34 tỉnh):** Tra cứu từ tỉnh/thành, quận/huyện, phường/xã cũ để tìm tên và mã đơn vị hành chính mới năm 2026.
   - **Mới ➔ Cũ:** Tra cứu ngược lại từ 34 tỉnh/thành mới để xem lịch sử sắp xếp, sáp nhập của các đơn vị tiền thân.
2. **Bộ Lọc Đơn Vị Cơ Sở (Ấp / Khóm / Khu phố / Tổ dân phố):**
   - Hỗ trợ giải quyết biến đổi cấp cơ sở (ví dụ: chia tách Ấp Nam Lân 1 & 2 tại Bà Điểm, Ấp Giao Hiệp tại Thạnh Phong - Bến Tre, Khóm Thào Lạng tại Vĩnh Trạch - Bạc Liêu/Cà Mau...).
3. **Tra Cứu Bằng Địa Chỉ Tự Do (Deep Address Parser):**
   - Tự động bóc tách và chuẩn hóa số nhà, tên đường, ấp/khóm, xã/phường, quận/huyện, tỉnh/thành phố chỉ bằng việc nhập địa chỉ bất kỳ.
4. **Bản Đóng Gói Độc Lập (Single-file HTML):**
   - Trang `tra-cuu-dia-chinh-2026.html` gọn nhẹ, mở được trên mọi trình duyệt điện thoại và máy tính không cần kết nối mạng hay cài đặt phần mềm.

---

## 🚀 Hướng Dẫn Khởi Chạy Localhost (Máy tính cá nhân)

### Cách 1 (Nhanh nhất - 1 Click)
- Nhấp đúp vào file `tien-ich\CHAY_UNG_DUNG_WEB.bat`.
- Hệ thống sẽ tự động khởi động các dịch vụ và mở trình duyệt tại: `http://localhost` (hoặc `http://localhost:3000`).

### Cách 2 (Dòng lệnh npm)
```bash
cd E:\Antigravity\vietnam-dia-chinh-2026
npm install
npm start
```

---

## 📦 Cập Nhật & Đóng Gói (Build)

Sau khi chỉnh sửa mã nguồn hoặc dữ liệu:
```bash
npm run build
```
Lệnh này sẽ biên dịch lại bản web Vite production (`dist/`) và tạo lại file đóng gói độc lập `tien-ich/tra-cuu-dia-chinh-2026.html`.

---

## 📁 Cấu Trúc Dự Án

| Thư mục / Tập tin | Mô tả chức năng |
| :--- | :--- |
| `src/components/` | Giao diện React: `Header.tsx`, `AddressLookup.tsx`, `Footer.tsx` |
| `src/data/` | Cơ sở dữ liệu hành chính 63 tỉnh cũ, 34 tỉnh mới, ma trận sáp nhập và danh mục xã/phường |
| `src/utils/` | Bộ phân tích địa chỉ `addressParser.ts` chuẩn hóa địa chỉ tự do và căn cứ pháp lý |
| `server/` | Máy chủ Express (`server.ts`) kết nối dữ liệu địa chính |
| `tien-ich/` | Tập tin `.bat` khởi chạy, script build và file HTML độc lập `tra-cuu-dia-chinh-2026.html` |
| `.github/workflows/` | Quy trình tự động triển khai GitHub Pages (`deploy.yml`) |

---
**Bản quyền phát triển: MH-SAMA © 2026.** Phục vụ cộng đồng và số hóa hành chính quốc gia.
