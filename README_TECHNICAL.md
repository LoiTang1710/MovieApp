# README_TECHNICAL.md

## Tổng quan (Overview)
Tài liệu này tóm tắt các quyết định kỹ thuật, cấu trúc thư mục, và luồng dữ liệu của các tính năng vừa được hoàn thiện. Trọng tâm của phiên làm việc này bao gồm:
1. **Tìm kiếm Nâng cao (Advanced Search):** Hoàn thiện chức năng tìm kiếm tại AppBar, tích hợp Debounce để tối ưu API call, thiết kế giao diện kết quả dropdown ngay dưới thanh tìm kiếm (không làm xê dịch layout), và điều hướng đến trang kết quả chi tiết với bộ lọc nâng cao.
2. **Yêu thích Phim (Favourite Management):** Sửa lỗi crash khi nhấn yêu thích tại trang Detail/Player. Tích hợp kiểm tra Auth (yêu cầu đăng nhập trước khi thêm). Khắc phục tình trạng mất state trên Home Banner khi quay lại từ danh sách My List thông qua việc tận dụng triệt để Cache của TanStack Query.
3. **Cổng nội dung Premium (Premium Content Gate):** Tái cấu trúc và tích hợp logic khóa nội dung trả phí tại trang Player. 
4. **Quản lý Tài khoản (Account/Profile Management):** Refactor lại các file của teammate. Di chuyển cấu trúc từ `src/profile/Profiles` về `src/pages/Profile` để đồng bộ chuẩn thư mục của dự án (pages-based architecture). Cập nhật giao diện thành Glassmorphism, bỏ các inline style hardcode, đồng bộ thiết kế với toàn hệ thống.

---

## Tác vụ đã thực hiện (Agent Actions)

- **`client/src/components/common/AppBar/AppBar.jsx`**: 
  - Thay đổi thanh Search tĩnh thành Dynamic Input với hiệu ứng Glassmorphism. Cố định vị trí Absolute cho dropdown để không đẩy các thẻ NavLinks sang bên trái.
  - Cập nhật đúng đường dẫn `navigate('/profiles')` cho menu Quản lý tài khoản.
- **`client/src/hooks/useDebounce.jsx`**: 
  - Tạo mới Custom Hook `useDebounce` để delay (500ms) API call khi người dùng gõ phím tìm kiếm, giảm tải cho server.
- **`client/src/pages/Search/Search.jsx` & `SearchProvider.jsx`**: 
  - Tạo mới trang Tìm Kiếm nâng cao, kết hợp bộ lọc động (năm, thể loại) và phân trang tự động.
- **`client/src/components/common/ActionButton/FavouriteButton/FavouriteButton.jsx`**: 
  - Thêm luồng kiểm tra Auth: Nếu chưa đăng nhập, hiển thị `<RequireLoginModal />`.
  - Fix lỗi crash bằng cách bắt trường hợp `movie.id` (TMDB id) không tồn tại. Tối ưu useMemo so sánh type ID (ép kiểu về Number) để state `isLoved` không bị rớt khi chuyển đổi giữa `Home` và `MyList`.
- **`client/src/components/common/Modals/RequireLoginModal.jsx`**: 
  - Tạo mới Component hiển thị Modal yêu cầu đăng nhập/đăng ký cho các luồng tương tác bảo mật.
- **`client/src/pages/Profile/*`**: 
  - **Refactor cấu trúc**: Xóa bỏ các thư mục trùng lặp như `src/profile/ProfileManage`, `src/profile/ProfileSelection` và chuyển toàn bộ file hợp lệ sang `src/pages/Profile/`.
  - **Refactor UI**: Xóa toàn bộ inline style `background: radial-gradient(...)` cũ, thay thế bằng background class của hệ thống (`bg-bg-default`) và thêm các lớp glow/backdrop blur chuẩn Glassmorphism.

---

## Cấu trúc thư mục (File Structure)

Các tệp liên quan đến luồng chức năng được tổ chức lại theo mô hình sau:

```text
client/src/
├── components/
│   ├── common/
│   │   ├── AppBar/
│   │   │   └── AppBar.jsx           # Tích hợp Search input debounce & Dropdown
│   │   ├── ActionButton/
│   │   │   └── FavouriteButton.jsx  # Xử lý Favorite, gọi RequireLoginModal
│   │   ├── Modals/
│   │   │   └── RequireLoginModal.jsx # Modal tái sử dụng cho luồng cần Auth
│   │   └── PremiumContentGate/      # Component bọc Video Player yêu cầu gói Premium
├── hooks/
│   └── useDebounce.jsx              # Custom Hook delay state (debounce)
├── pages/
│   ├── Search/
│   │   ├── Search.jsx               # Trang kết quả search với filters
│   │   └── SearchSkeleton.jsx       # Hiệu ứng loading cho trang Search
│   └── Profile/                     # (MỚI CHUYỂN TỪ src/profile/)
│       ├── ProfileSelection.jsx     # Trang chọn Profile (Glassmorphism)
│       ├── ProfileManage.jsx        # Trang danh sách quản lý Profile
│       └── ProfileForm.jsx          # Form thêm/sửa Profile
└── contexts/
    └── SearchContext.jsx            # State management cho tính năng Tìm kiếm
```

**Giải thích:** Việc gom nhóm tính năng vào `pages` giúp phân định rạch ròi giữa UI độc lập của các trang và UI tái sử dụng (trong `components`). Chuyển `profile` vào `pages/Profile` tuân thủ nguyên tắc *Domain-Driven Directory* đang được áp dụng một phần trong dự án.

---

## Kiến trúc & Quyết định kỹ thuật (Architecture & Technical Decisions)

### 1. Luồng Dữ Liệu (Data Flow) & State Management
- Tận dụng sức mạnh của **TanStack Query (`@tanstack/react-query`)**: 
  - Thay vì lưu trữ thủ công `isLoved` state thông qua `useState`, hệ thống tính toán (derive) trạng thái này trực tiếp bằng `useMemo` dựa trên Cache của `['collections']`. 
  - Khi thêm/xóa thành công ở API, ta chỉ cần gọi `queryClient.invalidateQueries(['collections'])`, TanStack Query tự động re-fetch background, giúp các Component `FavouriteButton` ở bất kì đâu (Home banner, Detail, MyList) đều tự cập nhật UI, không cần truyền props rườm rà hay xài Global Context.

### 2. Tối ưu Hiệu Năng bằng Debounce
- Việc gọi API Search khi user gõ liên tục gây lãng phí tài nguyên backend và có thể dính Rate Limit của TMDB. Pattern áp dụng: Gắn State thực của Input vào `useState`, sau đó cho state này chạy qua `useDebounce` hook để lấy ra `debouncedValue`. `useQuery` chỉ trigger fetch khi `debouncedValue` thay đổi.

### 3. Nguyên Tắc Thiết Kế Giao Diện (Glassmorphism UI)
- Tránh sử dụng Inline-styles (`style={{...}}`) cho Layout. Việc cứng hóa màu sắc `radial-gradient` ở code của teammate phá vỡ khả năng quản lý màu tập trung. 
- Refactor bằng các Utility classes của Tailwind CSS: `bg-black/40 backdrop-blur-xl border border-white/10`. Cấu trúc glow sáng được tách thành các thẻ `div` rỗng nằm absolute phía dưới để tạo hiệu ứng khối nổi (ambient lighting).

### 4. Route Protection & Interceptors
- **RequireLoginModal**: Component tái sử dụng cao. Nó giúp không phải hard-redirect người dùng đến trang Login làm gãy UX hiện tại, mà hiện pop-up ngay trên màn hình hiện tại.

---

## Thư viện & Cấu hình (Dependencies & Setup)

**Các thư viện chủ chốt được sử dụng:**
- **`lucide-react`**: Cho các icon giao diện.
- **`@tanstack/react-query`**: Quản lý Server State, Invalidations, Cache.
- **`react-router-dom`**: Xử lý Route, State transfer qua `location.state`.
- **`react-toastify`**: Xử lý thông báo (toast).

**Môi trường chạy & Kiểm thử:**
Các thay đổi đều tuân thủ kiến trúc hiện tại của dự án. Không cần cài thêm dependencies mới.
- Khởi động Server: `cd server && npm run dev`
- Khởi động Client: `cd client && npm run dev`
- Để kiểm tra phần Search: gõ vào Header (đợi ~500ms sẽ thấy kết quả thả xuống), nhấn Enter để chuyển đến trang kết quả lọc `/search`.
- Để kiểm tra Yêu thích: Vào Home, click tim trên Banner; chuyển tới trang Chi tiết, click Tim; chuyển lại ra Home.
- Để kiểm tra Profile: Click nút Settings > "Quản lý tài khoản" trong User Menu trên Header.