# MovieApp Admin Panel

Giao diện quản trị cho MovieApp: Dashboard, phim, người dùng, khuyến mãi, thống kê.

## Chạy nhanh

1. Khởi động PostgreSQL (`database/docker compose up -d`)
2. Backend: `cd server` → `npm run dev`
3. Seed (lần đầu): `npm run db:seed`
4. Admin: `cd admin` → copy `.env.example` → `.env` → `npm install` → `npm run dev`

## Đăng nhập

- Email: `admin@cinevibe.com`
- Mật khẩu: `admin123`

## Các trang

| Route | Chức năng |
|-------|-----------|
| `/admin/dashboard` | Tổng quan, biểu đồ |
| `/admin/movies` | CRUD phim nội bộ |
| `/admin/users` | CRUD tài khoản |
| `/admin/promotions` | CRUD mã khuyến mãi |
| `/admin/stats` | Báo cáo, xuất CSV |

`VITE_SERVER_URL` phải trùng port backend (mặc định trong repo: `http://localhost:3000`).
