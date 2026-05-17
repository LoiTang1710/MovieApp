## Nơi nhận các Request phía Client

Là nơi mà server sẽ nhận các request từ Client gửi xuống

*Nó quyết định đường đi tới các layer trong server từ việc gọi API phía client*

Ví dụ: đối với việc xác thực người dùng Route sẽ điều hướng tới việc gọi AuthRoute và các logic Authorize và Authenticate phía Server. Ngược lại, nếu việc gọi API cơ bản là cần json data thì Route sẽ điều hướng tới layer tương ứng trong Controller