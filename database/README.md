# PostgreSQL Local

Thư mục này chứa cấu hình PostgreSQL chạy local cho dự án MovieApp.

## Khởi động database

Tạo file môi trường local từ `.env.example`, sau đó khởi động PostgreSQL:

```powershell

docker compose up -d
```

Chuỗi kết nối dành cho môi trường development trong `server/.env` là:

```env
DATABASE_URL="postgresql://movieapp:movieapp_dev_password@127.0.0.1:5433/movieapp?schema=public"
```

## Tắt database

```powershell
docker compose down
```

Không thêm tùy chọn `-v` trừ khi bạn thực sự muốn xóa dữ liệu database local.

## Áp dụng migration Prisma

Từ thư mục `server`, cài đặt dependencies, áp dụng migration hiện có và tạo dữ liệu gói premium mặc định:

**Chạy lệnh sau npm install**
```bash
npx prisma generate
```

```powershell
npm install
npm run db:migrate
npm run db:seed
```

Các lệnh Prisma thường dùng:

```powershell
npm run db:validate
npm run db:generate
npm run db:studio
```

File `schema.prisma` được quản lý trong `server/prisma/`. Khi chủ động thay đổi
cấu trúc database trong file này, hãy tạo migration mới:

```powershell
npm run db:migrate -- --name describe_your_change
```
