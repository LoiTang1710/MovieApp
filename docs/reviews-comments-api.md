# API Đánh giá & Bình luận

Base URL: `http://localhost:3000` (hoặc `VITE_SERVER_URL`)

## Dev auth (khi login chưa xong)

```http
POST /api/dev/token
Content-Type: application/json

{ "email": "user@test.com" }
```

Response: `{ "token": "..." }` → lưu `localStorage.setItem('token', token)`

Cần `ALLOW_DEV_AUTH=true` và `JWT_SECRET` trong `server/.env`.

## Đánh giá

| Method | Path | Auth | Body/Query |
|--------|------|------|------------|
| GET | `/api/reviews/:tmdbId/summary?mediaType=movie` | Optional | - |
| PUT | `/api/reviews/:tmdbId` | Required | `{ "mediaType": "movie", "stars": 5 }` |

## Bình luận

| Method | Path | Auth | Body/Query |
|--------|------|------|------------|
| GET | `/api/comments?tmdbId=550&mediaType=movie&page=1` | Optional | - |
| POST | `/api/comments` | Required | `{ "tmdbId": 550, "mediaType": "movie", "content": "..." }` |
| POST | `/api/comments/:parentId/replies` | Required | `{ "content": "..." }` |
| POST | `/api/comments/:id/like` | Required | - |

## Admin

```http
DELETE /api/admin/comments/:id
Authorization: Bearer <admin_token>
```

## Kiểm duyệt

- Từ thô tục → `400 PROFANITY`
- Spam tốc độ → `429 RATE_LIMIT`
- Trùng nội dung → `400 DUPLICATE`

## Database

Sau khi pull code, chạy migration (hoặc `npx prisma db push` nếu DB dev đã có sẵn bảng):

```bash
cd server
npm run db:migrate
npm run db:seed
```

## Frontend (dev)

- Chưa login: dùng banner **User** / **Admin** trong mục Cộng đồng.
- Admin đăng nhập dev sẽ thấy nút **Xóa** trên từng bình luận (gọi `DELETE /api/admin/comments/:id`).
