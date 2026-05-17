# 🎬 MovieApp - Hướng Dẫn Dành Cho Lập Trình Viên (Developer Guide)

Dưới đây là cẩm nang bỏ túi từ Tech Lead để giúp các bạn (đặc biệt là các thành viên mới tiếp cận framework) dễ dàng làm quen với dự án, thiết lập môi trường và hiểu rõ quy chuẩn code của team. Đọc kỹ nhé!

---

## 🛠️ 1. Tổng quan Tech Stack

Dự án của chúng ta được chia làm 2 phần chính với các công nghệ siêu hiện đại và phổ biến:

**🎨 Frontend (Phần giao diện - `client/`)**
- **React 19 (kết hợp Vite):** Trái tim của giao diện, giúp tạo ra các website mượt mà (SPA). Vite giúp app khởi chạy cực kỳ nhanh.
- **Tailwind CSS v4:** Thư viện giúp chúng ta style trực tiếp trong thẻ HTML thông qua `className` mà không cần phải viết file `.css` dài dòng.
- **lucide-react:** Thư viện chứa hàng ngàn icon thiết kế siêu đẹp, dễ dàng sử dụng như một React component.
- **ESLint:** kiểm tra lỗi chính tả và format code.

**⚙️ Backend (Phần máy chủ - `server/`)**
- **Node.js (>=20) & Express 5:** Môi trường và framework để xây dựng các API xử lý logic và cung cấp dữ liệu cho Frontend.

---

## 💻 2. Cài đặt Môi trường & Extension (VS Code)

Để code trôi chảy, có nhắc lệnh và tránh sai sót, các bạn **BẮT BUỘC** cài các extension này vào Visual Studio Code nhé:

1. **[Tailwind CSS IntelliSense]**: Vũ khí bí mật! Nó tự động gợi ý tên class Tailwind, báo lỗi khi bạn gõ sai class, và hiển thị trước màu sắc bạn chọn.
2. **[ESLint]**: Sẽ hiển thị gạch chân màu đỏ ngay lập tức khi bạn code sai chuẩn hoặc sai logic cơ bản.
3. **[Prettier - Code formatter]**: Giúp tự động căn lề, thụt đầu dòng gọn gàng mỗi khi bạn lưu file (Ctrl+S / Cmd+S).
4. **[ES7+ React/Redux/React-Native snippets]**: Cài cái này để không phải gõ tay boilerplate dài dòng. Chỉ cần gõ `rfce` và nhấn `Tab`, nó sẽ tự tạo sẵn một khung Component React cho bạn!

*(💡 Mẹo: Cài xong nhớ khởi động lại VS Code để các tính năng nhận diện đầy đủ nhé!)*

---

## 🔍 3. Hướng dẫn tra cứu tài liệu (Phao Cứu Sinh)

Khi không biết code như thế nào, đừng hoảng! Hãy làm theo cách sau:

**1. Bí Style giao diện (Tailwind CSS):**
- Truy cập: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cách dùng:** Gõ từ khóa bạn muốn làm vào ô tìm kiếm. 
  - *Ví dụ:* Bạn muốn làm chữ to ra? Gõ "font size" -> Tài liệu sẽ chỉ bạn dùng class `text-lg` hoặc `text-xl`. Bạn muốn màu nền đỏ? Gõ "background color" -> dùng class `bg-red-500`.

**2. Tìm Icon (lucide-react):**
- Truy cập: [lucide.dev/icons](https://lucide.dev/icons)
- **Cách dùng:** Gõ tìm theo chức năng bằng tiếng Anh (VD: "search", "user", "home"). Click vào icon bạn ưng ý, copy tên của nó (VD: `PlayCircle`), sau đó import vào file React.

---

## 📂 4. Quy chuẩn thư mục và Kiến trúc

Để dự án không biến thành một "nồi lẩu thập cẩm", mọi người tuân thủ quy tắc chia thư mục như sau:

### 🖥️ Client (Giao diện React - `client/src/`)
- `pages/`: Định nghĩa các trang lớn. **Chỉ chứa bố cục giao diện (View)**. (VD: Trang Chủ, Trang Chi Tiết Phim).
- `components/`: Nơi chứa các mảnh ghép giao diện nhỏ có thể dùng lại nhiều lần (VD: Nút bấm, Thanh điều hướng, Thẻ phim).
- `customHooks/` & `utils/`: **Nơi đặt Logic!** Những hàm tính toán phức tạp, hàm format thời gian, gọi API... phải tách ra đây. Giao diện (View) không được chứa logic quá dài.
- `apis/`: Nơi khai báo các hàm gọi lên Server.

### 🗄️ Server (Máy chủ Node.js - `server/src/`)
Kiến trúc ở đây theo mô hình 3 lớp (3-layer architecture):
- `routes/`: Cô tiếp tân - Nhận URL request từ Client và chỉ đường xem sẽ đưa cho ai xử lý.
- `controllers/`: Nhân viên phòng ban - Nhận yêu cầu từ route, lấy dữ liệu (req.body), gọi vào service và trả về kết quả (res.json).
- `services/`: - **Nơi xử lý mọi Logic nghiệp vụ cốt lõi**, kết nối với Database.

---

## 💡 5. Ví dụ Code mẫu (Snippet)

Dưới đây là một ví dụ về một Component chuẩn trong dự án của chúng ta, có kết hợp giao diện Tailwind và sử dụng icon:

```jsx
// 1. Khai báo React
import React from 'react';
// 2. Import Icon từ thư viện lucide-react (phải viết hoa chữ cái đầu)
import { PlayCircle, Star } from 'lucide-react';

const MovieCard = ({ title, genre, rating }) => {
  return (
    // 3. Sử dụng Tailwind: flexbox, background tối, bo góc (rounded-xl), padding (p-4), hiệu ứng hover
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer">
      
      {/* 4. Dùng icon như một Component con, chỉnh màu bằng class của Tailwind */}
      <PlayCircle size={36} className="text-blue-500" />
      
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{genre}</p>
      </div>

      <div className="flex flex-col items-center">
        <Star size={20} className="text-yellow-400" />
        <span className="text-white font-semibold">{rating}</span>
      </div>
      
    </div>
  );
};

export default MovieCard;
```

---

## 🚀 6. Các lệnh khởi chạy cơ bản

Vào đầu ngày làm việc, hãy mở Terminal (trên VS Code bấm `` Ctrl + ` ``) và chạy server + client lên nhé:

**Khởi chạy Client (Giao diện web):**
```bash
cd client
npm install   # Lệnh này cài đặt thư viện (chỉ cần chạy lần đầu tiên hoặc khi có ai đó add thư viện mới)
npm run dev   # Khởi động dự án React
```
Sau đó bấm vào đường link `http://localhost:5173` để xem thành quả.

**Khởi chạy Server (Máy chủ API):**
*(Mở thêm một tab Terminal mới (+))*
```bash
cd server
npm install   # (chỉ chạy lần đầu)
npm run dev   # Khởi động máy chủ Node.js (cài nodemon sẽ tự restart khi code thay đổi)
```

