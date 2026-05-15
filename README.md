# 🎬 MovieApp – Hệ thống xem phim trực tuyến

Chào mừng các bạn đến với đồ án môn **Software Engineering (SE)**. Repo này chứa toàn bộ mã nguồn frontend và backend của ứng dụng MovieApp, được tổ chức theo mô hình **MVC** cho backend và **component-based** cho frontend.

---

## 🚀 Công nghệ sử dụng

| Phần          | Công nghệ                                    |
|---------------|----------------------------------------------|
| Frontend      | ReactJS (Vite), TanStack Query, Tailwind CSS |
| Backend       | Node.js, ExpressJS (mô hình MVC)            |
| Database      | PostgreSQL                                   |
| Quản lý code  | Git & GitHub                                 |

---

## 📂 Cấu trúc thư mục tổng quan

```text
MovieApp/
├── client/                # Frontend ReactJS
│   ├── public/
│   ├── src/
│   │   ├── components/    # Các component dùng chung
│   │   ├── pages/         # Các trang (Home, MovieDetail, ...)
│   │   ├── services/      # Hàm gọi API từ backend
│   │   └── App.jsx
│   ├── .env.example       # Mẫu biến môi trường cho frontend
│   └── package.json
├── server/                # Backend Node.js + Express (MVC)
│   ├── src/
│   │   ├── models/        # Model – truy vấn PostgreSQL
│   │   ├── controllers/   # Controller – xử lý logic, trả JSON
│   │   ├── routes/        # Route – định tuyến URL
│   │   ├── middleware/    # Middleware (auth, xác thực, lỗi)
│   │   ├── config/        # Cấu hình database, môi trường
│   │   └── app.js         # Khởi tạo ứng dụng Express
│   ├── .env.example       # Mẫu biến môi trường cho backend
│   └── package.json
├── database/              # File SQL, schema, migration, seed
│   ├── schema.sql
│   └── seeds/
├── .gitignore
└── README.md
```

## 🧠 Lưu ý về mô hình MVC (dành cho backend)

- **Model** – Tương tác trực tiếp với PostgreSQL (dùng thư viện `pg` hoặc ORM như Sequelize/Prisma).
- **View** – Trong REST API, View chính là JSON response được Controller trả về.
- **Controller** – Nhận request, gọi Model, xử lý logic nghiệp vụ và trả dữ liệu JSON cho client.

> Khi các bạn làm backend, hãy đặt file đúng thư mục theo cấu trúc trên để team dễ quản lý.

---

## 🛠 Hướng dẫn setup cho thành viên mới (newbie friendly)

Tất cả thành viên đều phải làm theo các bước dưới đây **theo đúng thứ tự**.

## 1️⃣ Yêu cầu máy tính
- **Node.js** phiên bản 18 trở lên (tải tại [nodejs.org](https://nodejs.org))
- **PostgreSQL** đã cài đặt (có thể dùng Docker, pgAdmin, hoặc cài trực tiếp)
- **Git** và tài khoản GitHub

## 2️⃣ Clone dự án về máy
```bash
git clone git@github.com:LoiTang1710/MovieApp.git
cd MovieApp
```
## 3️⃣ Cài đặt dependencies

Sau khi clone project, bạn cần cài dependencies cho cả:

- ⚙️ Backend (`server`)
- 🎨 Frontend (`client`)

---

### ⚙️ Cài đặt Backend

```bash
cd server
npm install
```
### ⚙️ Cài đặt Frontend
```bash
cd ../client
npm install
```

### Quay về thư mục gốc
```bash
cd ..
```
## 4️⃣ Cấu hình biến môi trường (file .env)
#### ⚠️ Quan trọng: File .env chứa thông tin nhạy cảm (mật khẩu database, secret key...). _Chúng ta KHÔNG BAO GIỜ push file .env lên GitHub._

**a. Tạo file .env từ file mẫu**
Trong thư mục server/ và client/, bạn sẽ thấy file .env.example. Hãy copy nó thành .env:

Windows:
```bash
cmd
copy .env.example .env
```
Mac/Linux:
```bash
cp .env.example .env
```
**b. Điền thông tin vào file .env**
Mở file .env vừa tạo bằng trình soạn thảo code, điền các giá trị phù hợp với máy của bạn.

***📦 server/.env***

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/movie_db
JWT_SECRET=your_jwt_secret_key_here
```

***🎨 client/.env***

```env
VITE_API_URL=http://localhost:5000/api
```
📌 Nếu bạn chưa có database, xem bước 5 để tạo.

## 5️⃣ Thiết lập Database (PostgreSQL)
Đảm bảo PostgreSQL đang chạy (kiểm tra Services trên Windows hoặc sudo service postgresql status trên Linux).

Mở pgAdmin (hoặc dùng dòng lệnh psql) và tạo database mới tên movie_db.

Chạy file schema để tạo bảng:

```bash
psql -U username -d movie_db -f database/schema.sql
```
(Thay username bằng tài khoản PostgreSQL của bạn, nhập mật khẩu khi được hỏi)

Nếu nhóm sử dụng migration tự động (Sequelize, Prisma), làm theo hướng dẫn riêng trong code (sẽ có script chạy migration).

### 💻 Lệnh vận hành
Sau khi cài đặt xong, bạn mở hai terminal riêng biệt:

Chạy Backend (server)
```bash
cd server
npm run dev
```
Server sẽ chạy tại http://localhost:5000 (hoặc port bạn đã đặt trong .env).
Nodemon sẽ tự động restart khi code thay đổi.

Chạy Frontend (client)
Mở terminal khác:

```bash
cd client
npm run dev
```
Frontend mặc định chạy tại http://localhost:5173. Vite sẽ tự động hot-reload.

## 🌿 Quy trình làm việc nhóm với Git (BẮT BUỘC ĐỌC KỸ)
Team mình toàn newbie nên cần tuân thủ nghiêm ngặt để tránh mất code.

### 🔄 Mỗi ngày trước khi code
```bash
git checkout main
git pull origin main
```
Luôn lấy code mới nhất từ GitHub về.

### 🌱 Tạo nhánh riêng để làm tính năng
TUYỆT ĐỐI KHÔNG CODE TRỰC TIẾP TRÊN MAIN

```bash
git checkout -b feature/ten-cua-ban-va-tinh-nang
```
Ví dụ:

```bash
git checkout -b feature/an-nguyen-login-page
```
#### 📤 Sau khi code xong một phần (test ổn ở local)
```bash
git add .
git commit -m "feat: viết mô tả ngắn gọn"
git push origin ten-nhanh-cua-ban
```
**Ví dụ commit message tốt:**
### ✅ Ví dụ commit message tốt

#### ✨ Thêm tính năng mới (`feat`)

```bash
git commit -m "feat: thêm trang đăng nhập và validate form"
```

#### 🐛 Sửa lỗi (fix)

```bash
git commit -m "fix: sửa lỗi crash khi load danh sách phim"
```

#### 🎨 Chỉnh giao diện (style)

```bash
git commit -m "style: chỉnh CSS cho thanh navbar"
```
#### ♻️ Refactor code (refactor)

```bash
git commit -m "refactor: tách component MovieCard riêng"
```
#### 📝 Cập nhật tài liệu (docs)

```bash
git commit -m "docs: cập nhật hướng dẫn setup README"
```
### 🚀 Tối ưu hiệu năng (perf)

```bash
git commit -m "perf: tối ưu tốc độ render danh sách phim"
```

### 🔀 Tạo Pull Request (PR)
Truy cập repo trên GitHub.

Nhấn **"Compare & pull request"** cho nhánh vừa push.

Viết **mô tả ngắn** những gì bạn đã làm.

_****Nhờ ít nhất một thành viên khác review trước khi merge vào main.****_

### 🚨 Khi gặp conflict
*Đừng tự ý xóa code của người khác.*

Báo ngay cho team lead hoặc người có kinh nghiệm hơn để cùng giải quyết.

Có thể dùng công cụ trực quan của VSCode để resolve conflict.

### 🔒 Những điều tuyệt đối không được làm
| ❌ Hành động cấm | ✅ Nên làm thay thế |
|---|---|
| Push file `.env` lên GitHub | Chỉ push `.env.example` |
| Push thư mục `node_modules` | Đã có trong `.gitignore`, không cần push |
| Code trực tiếp trên nhánh `main` | Luôn tạo branch riêng cho mỗi tính năng |
| Commit với message vô nghĩa như `update`, `sửa`, `abc` | Viết rõ ràng như: `fix: sửa lỗi đường dẫn ảnh` |
| Tự ý merge khi chưa được review | Chờ team lead hoặc đồng đội review trước |
### 🧹 Clean code & Format
Trước khi commit, hãy định dạng code bằng Prettier (đã được cài trong project).

Trong VSCode, nhấn Shift + Alt + F để format file hiện tại.

Tuân thủ cấu trúc thư mục, đặt tên biến dễ hiểu, viết comment khi cần.

### ❓ Hỏi đáp nhanh (FAQ)
1. Tôi không biết PostgreSQL là gì?
PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ. Các bạn sẽ được hướng dẫn cài đặt trong buổi học hoặc có thể xem video YouTube. Nếu gặp khó khăn, hãy hỏi team lead.

2. Tôi chạy npm install bị lỗi?
Kiểm tra phiên bản Node.js bằng node -v. Nên dùng Node 18+. Xóa thư mục node_modules và file package-lock.json rồi chạy lại.

3. Backend không kết nối được database?
Kiểm tra file .env đã có đúng DATABASE_URL chưa. Thử kết nối bằng pgAdmin trước. Đảm bảo PostgreSQL đang chạy.

4. Tôi sợ sai khi dùng Git thì sao?
Làm từ từ, đọc kỹ hướng dẫn. Nếu lỡ xóa file, Git vẫn lưu lịch sử, có thể khôi phục. Hãy hỏi team lead nếu lo lắng.

🎯 Mục tiêu
Xây dựng thành công ứng dụng MovieApp hoàn chỉnh, mỗi thành viên đều thành thạo quy trình làm việc nhóm chuyên nghiệp với Git, MVC, REST API và React.

Chúc team chúng ta code vui vẻ, học được nhiều điều mới, và đạt điểm cao! 🚀