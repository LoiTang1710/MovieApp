

1. 🏛️ TỔNG QUAN KIẾN TRÚC HỆ THỐNG:

- Phân tích mô hình kiến trúc Client-Server hiện tại của dự án (Client React, Backend Express, DB PostgreSQL qua Prisma).

- Giải thích cách tổ chức thư mục (tại sao code lại chia thành 3 cụm độc lập: client, server, admin?).



2. 🚀 BÓC TÁCH CÁC TÍNH NĂNG CỐT LÕI (CORE FEATURES):

Đọc sâu vào code để chỉ rõ cách team đã làm, tại sao làm thế và điểm ấn tượng kỹ thuật của:

- Hệ thống Auth / Session & Middleware bảo mật ở backend.

- Cơ chế Caching và tối ưu hiệu năng bằng TanStack Query (staleTime, gcTime).

- Hệ thống Tìm kiếm & Bộ lọc phim nâng cao (Advanced URL-driven filtering).

- Tính năng Comment phân tầng (Nested Comments/Threading) và Watchlist.

- Mô hình đăng ký gói Premium Subscription & Xử lý thanh toán.



3. 💾 CƠ SỞ DỮ LIỆU & THỰC THỂ (DATABASE SCHEMA):

- Liệt kê các bảng chính từ Prisma schema (User, Profile, Movie, Comment, Payment, Subscription...) và mối quan hệ giữa chúng để tôi giải thích phần sơ đồ ERD.



4. 🎤 KỊCH BẢN THUYẾT TRÌNH & THỦ ĐOẠN "GHI ĐIỂM":

- Chia kịch bản slide thành các bước dẫn dắt từ Đặt vấn đề -> Kiến trúc -> Demo -> Tính năng ấn tượng.

- Gợi ý các câu hỏi hóc búa mà Hội đồng phản biện có thể hỏi (ví dụ: về bảo mật, về lỗi import lồng nhau, về xử lý bất đồng bộ) và cách trả lời lấp liếm khôn khéo nhất.



--------------------------------------------------

DƯỚI ĐÂY LÀ TOÀN BỘ MÃ NGUỒN REPOMIX:

Your markdown file is ready
Biểu tượng MD
 PRESENTATION_GUIDE 
 MD 

Tài liệu PRESENTATION_GUIDE.md đã được tạo dựa trên phân tích chuyên sâu về mã nguồn dự án MovieApp của team. Tài liệu này đóng vai trò như một cẩm nang từ Tech Lead, bao gồm các ý chính sau:

Tổng quan Kiến trúc: Giải thích chi tiết về việc ứng dụng React, Express và Prisma cũng như tư duy phân tách 3 lớp client, server, và admin để tối ưu kích thước bundle, tăng tính bảo mật.

Bóc tách Tính năng Cốt lõi: Nhấn mạnh các thiết kế thông minh như áp dụng TanStack Query cho việc Caching với staleTime, và kỹ thuật URL-driven state qua useSearchParams để chia sẻ link bộ lọc dễ dàng.

Database Schema (Lược đồ DB): Điểm qua từng bảng chính với thiết kế tinh gọn qua PostgreSQL, giúp bạn dễ dàng vẽ và giải thích ERD.

Kịch bản & Q&A Phản biện: Chia sẵn luồng trình bày theo 4 bước đi kèm những câu trả lời chuẩn "điểm 10" cho các vấn đề mà Hội đồng cực kỳ hay vặn vẹo như tốc độ phản hồi API, bảo mật SQL Injection hay lỗi Circular Import.

Chúc team có một buổi bảo vệ đồ án thành công rực rỡ và ghi điểm tuyệt đối với Hội đồng phản biện! Nếu bạn cần đi sâu thêm vào bất kỳ endpoint nào để biểu diễn code, hãy cho tôi biết nhé.

Kích thước tệp tải lên có thể quá lớn, gây ảnh hưởng đến việc cho kết quả tốt nhất. Tìm hiểu thêmMở trong cửa sổ mới



Gemini là AI và có thể mắc sai sót.

# 🎬 TÀI LIỆU HƯỚNG DẪN THUYẾT TRÌNH - DỰ ÁN MOVIEAPP
**Vai trò:** Tech Lead / Giảng viên hướng dẫn
**Mục tiêu:** Cung cấp kịch bản, phân tích kỹ thuật chuyên sâu và "vũ khí" để team tự tin đối đáp trước hội đồng phản biện.

---

## 1. 🏛️ TỔNG QUAN KIẾN TRÚC HỆ THỐNG

### Mô hình Kiến trúc Client - Server
Dự án được xây dựng dựa trên mô hình **Client-Server** kết nối qua RESTful API.
* **Frontend (Client):** Xây dựng bằng **React 19** kết hợp **Vite** mang lại tốc độ build cực nhanh. UI được thiết kế bằng **Tailwind CSS v4**.
* **Backend (Server):** Sử dụng **Node.js** và **Express.js (v5)**, tổ chức theo mô hình **MVC** (Model-View-Controller) và 3-layer architecture (Routes - Controllers - Services).
* **Database:** Sử dụng **PostgreSQL** kết hợp với ORM **Prisma**, giúp thao tác với cơ sở dữ liệu qua các object JavaScript thay vì viết câu lệnh SQL thuần, đồng thời có cơ chế Migration cực kỳ mạnh mẽ.

### Tại sao tổ chức code thành 3 cụm độc lập: `client`, `server`, và `admin`?
Điểm sáng của dự án là việc tách biệt hoàn toàn 3 khối này:
1.  **Phân tách trách nhiệm (Separation of Concerns):** `client` phục vụ người dùng cuối (User) cần giao diện bắt mắt, tối ưu SEO, dung lượng nhẹ. `admin` phục vụ Ban quản trị, chứa nhiều thư viện biểu đồ nặng (như Recharts/SVG thao tác phức tạp) và logic quản lý nhạy cảm. Việc tách ra giúp User không bao giờ tải nhầm code của Admin, tối ưu **Bundle Size**.
2.  **Bảo mật:** Cô lập môi trường Admin. Tin tặc không thể tìm thấy các route UI của trang quản trị trên app Client, hạn chế nguy cơ tấn công bề mặt (Attack Surface).
3.  **Khả năng mở rộng (Scalability):** Backend (`server`) đứng độc lập cung cấp API. Nếu tương lai team muốn làm thêm app Mobile (React Native / Flutter), chỉ cần gọi vào `server` mà không cần đập đi xây lại.

---

## 2. 🚀 BÓC TÁCH CÁC TÍNH NĂNG CỐT LÕI (CORE FEATURES)

### 🔐 Hệ thống Auth / Session & Middleware bảo mật
* **Cách team làm:** Sử dụng **JWT (JSON Web Token)** kết hợp với **Express-Session** và `cookie-parser`.
* **Điểm ấn tượng:** Middleware được phân lớp rất rõ ràng (`verifyUserSession`, `optionalVerifyUserSession`, `authorizeRoles`). Việc có `optionalVerifyUserSession` cho phép người dùng vãng lai (chưa đăng nhập) vẫn xem được phim và bình luận chung, nhưng nếu đã đăng nhập sẽ được định danh. Passwords được mã hóa một chiều bằng `bcryptjs` trước khi lưu xuống DB.

### ⚡ Cơ chế Caching & Tối ưu hiệu năng bằng TanStack Query
* **Cách team làm:** Thay vì dùng `useEffect` kết hợp `useState` dài dòng và dễ sinh lỗi re-render, team áp dụng **TanStack Query** (React Query) quản lý state của server.
* **Điểm ấn tượng:** * Cấu hình `staleTime: 1000 * 60 * 5` (5 phút) tại `useAdminStats` và `useMedias`. Nghĩa là nếu người dùng quay lại trang chủ trong vòng 5 phút, React Query sẽ lấy data từ Cache thay vì gọi lại API. Điều này giảm tải cực lớn cho Backend và tiết kiệm băng thông.
    * Sử dụng cơ chế `gcTime` (Garbage Collection) tự động dọn rác bộ nhớ khi data không còn được sử dụng.

### 🔍 Hệ thống Tìm kiếm & Bộ lọc nâng cao (URL-driven filtering)
* **Cách team làm:** Dùng URLSearchParams lưu trạng thái filter. Custom hook `useMediaFilters` sẽ bóc tách các tham số (`year`, `genres`, `minRating`, `page`) trực tiếp từ URL.
* **Điểm ấn tượng:** Đây là "URL-driven state management". Việc lưu trạng thái vào URL giúp người dùng có thể **copy link gửi cho bạn bè** (ví dụ link tìm phim hành động năm 2023), và khi bạn bè mở link, họ sẽ thấy kết quả y hệt. Nếu chỉ lưu bằng `useState` thông thường, khi F5 (refresh) sẽ bị mất bộ lọc.

### 💬 Tính năng Comment phân tầng & Watchlist
* **Cách team làm:** Bảng `Comment` kết nối với `User` và `Movie`. Bảng `Collection` và `CollectionItem` lưu trữ danh sách phim (Watchlist).
* **Điểm ấn tượng:** * **Watchlist:** Hỗ trợ nhiều bộ sưu tập (Collection) khác nhau cho 1 user (Phim yêu thích, Phim chờ xem...). Default list tự động được tạo nếu user chưa có.
    * **Comment:** Backend có `moderation.service.js` kiểm duyệt từ ngữ nhạy cảm (Profanity check bằng regex RegExp) và chống spam (giới hạn số lượng comment trong 1 phút).

### 💳 Mô hình Đăng ký Premium & Xử lý thanh toán
* **Cách team làm:** Thiết kế các table `PremiumPlan`, `Subscription` và `Payment`.
* **Điểm ấn tượng:** Transaction thanh toán tuân thủ chuẩn thực tế: Trạng thái `PENDING` -> User thanh toán -> `SUCCEEDED`. Quản lý hạn sử dụng Premium qua mốc thời gian (`startAt`, `endAt`). Controller tách bạch `createPendingSubscription` và webhook để xử lý callback.

---

## 3. 💾 CƠ SỞ DỮ LIỆU & THỰC THỂ (DATABASE SCHEMA)

Sơ đồ ERD (Entity Relationship Diagram) được thiết kế xoay quanh các bảng chính:

1.  **Hệ người dùng:**
    * `User`: Bảng gốc chứa thông tin đăng nhập (email, password, role: USER/ADMIN).
    * `Profile`: 1 User có thể tạo nhiều Profile (VD: Netflix - Profile cho Bố Mẹ, Profile cho Trẻ em `ProfileType: KID/ADULT`). Mối quan hệ **1-N** (1 User - Nhiều Profiles).
2.  **Hệ Phim ảnh:**
    * `Movie`: Chứa thông tin phim (title, duration, views, rating, URLs).
    * `Genre`: Thể loại. Quan hệ **N-N** (Nhiều Phim - Nhiều Thể loại) thông qua bảng trung gian ngầm của Prisma `_GenreToMovie`.
3.  **Hệ Tương tác:**
    * `Comment` & `CommentLike`: Lưu đánh giá và lượt thả tim của User cho Comment.
    * `Collection` & `CollectionItem`: Hệ thống Watchlist của User.
4.  **Hệ Thanh toán (Premium):**
    * `PremiumPlan`: Các gói cước (Tháng, Năm).
    * `Subscription`: Quản lý tình trạng gói cước của User (Active, Expired...). Quan hệ **1-N** với Plan.
    * `Payment`: Lịch sử giao dịch (Momo, VNPay...), quan hệ **1-N** với Subscription và User.

---

## 4. 🎤 KỊCH BẢN THUYẾT TRÌNH & THỦ ĐOẠN "GHI ĐIỂM"

### 🎬 Các bước dẫn dắt Slide:
* **Bước 1 - Đặt vấn đề (Mở đầu cuốn hút):** "Thưa hội đồng, thị trường VOD (Video on Demand) đang bùng nổ, nhưng các giải pháp hiện tại thường giật lag hoặc UI/UX kém. Team chúng em xây dựng MovieApp không chỉ là một web xem phim, mà là một hệ thống có kiến trúc chịu tải, tối ưu trải nghiệm và cá nhân hóa sâu sắc."
* **Bước 2 - Demo (Show off):** Demo trực tiếp! Đi từ luồng khách (Guest) -> Đăng nhập -> Thêm phim vào Watchlist -> Thao tác comment/đánh giá -> Thanh toán Premium. Chuyển qua trang Admin xem dashboard biểu đồ nhảy số.
* **Bước 3 - Kiến trúc & Công nghệ (Core value):** Mở slide sơ đồ Kiến trúc 3-layer. Nhấn mạnh việc tách rời Client-Admin-Server và sử dụng Prisma ORM.
* **Bước 4 - Tính năng ấn tượng (Chốt hạ):** Khoe TanStack Query (cơ chế Cache), URL-driven filters, và bộ lọc kiểm duyệt comment tự động.

### 🛡️ Gợi ý Trả lời "Phản biện hóc búa" từ Hội đồng:

**Câu hỏi 1: Hệ thống gọi API liên tục như vậy có sợ sập Backend không? Team tối ưu thế nào?**
> **Trả lời:** *"Dạ team đã lường trước điều này. Ở Frontend, chúng em áp dụng **TanStack Query** với cơ chế Caching (`staleTime: 5 phút`). Nghĩa là với 1000 lượt load lại trang trong 5 phút, Frontend chỉ gọi Backend đúng 1 lần duy nhất, lấy data từ Cache cho 999 lần còn lại. Ở Backend, với các tác vụ fetch dữ liệu từ nguồn thứ 3, team sử dụng `Promise.all()` (như ở `tmdbFetchAll` trong `media.service.js`) để gọi song song các API, giảm thời gian chờ xuống phân nửa so với gọi tuần tự bằng await thông thường."*

**Câu hỏi 2: Tại sao lại tách riêng thư mục `client` và `admin`? Chẳng phải code chung sẽ dễ hơn sao?**
> **Trả lời:** *"Dạ tách riêng là một quyết định kiến trúc có chủ đích. Thứ nhất, nó tối ưu dung lượng (Bundle Size) – người dùng xem phim sẽ không phải tải các thư viện biểu đồ hay data grid nặng nề của Admin. Thứ hai, nó bảo mật hơn. Mã nguồn Admin được cô lập hoàn toàn, tránh việc hacker dịch ngược code (reverse engineering) từ Client để tìm các endpoint quản trị ẩn."*

**Câu hỏi 3: Nếu nhập URL chứa ký tự lạ (SQL Injection) vào thanh tìm kiếm thì có lỗi không?**
> **Trả lời:** *"Dạ hoàn toàn an toàn. Backend của chúng em sử dụng **Prisma ORM**, công cụ này tự động tham số hóa (parameterized) tất cả các câu truy vấn trước khi đẩy xuống PostgreSQL, giúp chặn đứng 100% tấn công SQL Injection. Ngoài ra, team có module `moderation.service.js` dùng Regex để chặn spam từ hoặc link độc hại ở phần bình luận."*

**Câu hỏi 4: Về lỗi Import lồng nhau (Circular Dependencies), team có gặp phải không và xử lý ra sao?**
> **Trả lời:** *"Quá trình phát triển React thường dễ dính Circular Import. Để khắc phục, team thống nhất nguyên tắc thiết kế phân lớp: tách biệt hoàn toàn các file `utils` (formatters.js) và custom `hooks` (useMedias.jsx) ra độc lập, không cho phép file util import ngược lại component. Nhờ đó đường đi của dữ liệu là một chiều."*
PRESENTATION_GUIDE.md
Đang hiển thị PRESENTATION_GUIDE.md.
