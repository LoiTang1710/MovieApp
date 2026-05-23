import { useState } from "react";



const danhSachPhim = [
  { id: 1, title: "Nữ Hoàng Băng Giá 3", rating: 9.0, daThich: true, nam: 2027, poster: "" },
  { id: 2, title: "Hành Trình Của Moana", rating: 9.6, daThich: true, nam: 2027, poster: "" },
  { id: 3, title: "Minions & Quái Vật", rating: 9.5, daThich: false, nam: 2027, poster: "" },
  { id: 4, title: "Chàng Mèo Mang Mũ", rating: 9.0, daThich: false, nam: 2027, poster: "" },
  { id: 5, title: "Kung Fu Panda 4", rating: 9.1, daThich: false, nam: 2027, poster: "" },
  { id: 6, title: "Mufasa: Vua Sư Tử", rating: 8.9, daThich: true, nam: 2027, poster: "" },
  { id: 7, title: "Lọ Lem", rating: 9.6, daThich: false, nam: 2027, poster: "" },
  { id: 8, title: "Công Chúa Mononoke", rating: 9.0, daThich: false, nam: 2027, poster: "" },
];

const danhSachBanDau = [
  { id: 1, ten: "Xem Sau", soPhim: 8, icon: "", laMacDinh: true },
  { id: 2, ten: "Phim Hành Động", soPhim: 8, icon: "", laMacDinh: false },
  { id: 3, ten: "Phim Hoạt Hình", soPhim: 0, icon: "", laMacDinh: false },
];



function Modal({ children, onDong }) {
  return (
    <div
      onClick={onDong}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#2a2a2a",
          borderRadius: 16,
          padding: "32px 28px",
          width: "90%",
          maxWidth: 460,
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}



function ModalTaoMoi({ onDong, onTao }) {
  const [ten, setTen] = useState("");
  const [iconDaChon, setIconDaChon] = useState("");

  const danhSachIcon = ["", "", "", "", "", ""];

  function handleTao() {
    if (ten.trim() === "") return;
    onTao(ten.trim(), iconDaChon);
    onDong();
  }

  return (
    <Modal onDong={onDong}>
      <button
        onClick={onDong}
        style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#aaa", fontSize: 20, cursor: "pointer" }}
      >
        ✕
      </button>

      <h2 style={{ margin: "0 0 24px", color: "#fff", fontSize: 22 }}>Tạo Danh Sách Mới</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {danhSachIcon.map((icon) => (
          <button
            key={icon}
            onClick={() => setIconDaChon(icon)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              border: "none",
              background: iconDaChon === icon ? "#e53935" : "#3a3a3a",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            {icon}
          </button>
        ))}
      </div>

      <p style={{ margin: "0 0 8px", color: "#ccc", fontSize: 14 }}>Tên Danh Sách</p>
      <input
        value={ten}
        onChange={(e) => setTen(e.target.value)}
        placeholder="Nhập tên bộ sưu tập ..."
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 10,
          border: "1px solid #444",
          background: "#1e1e1e",
          color: "#fff",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          marginBottom: 24,
        }}
      />

      <button
        onClick={handleTao}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "none",
          background: ten.trim() ? "#e53935" : "#555",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: ten.trim() ? "pointer" : "not-allowed",
        }}
      >
        Tạo Danh Sách
      </button>
    </Modal>
  );
}



function ModalXoa({ ten, onDong, onXacNhan }) {
  return (
    <Modal onDong={onDong}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}></div>
        <h2 style={{ margin: "0 0 12px", color: "#fff", fontSize: 20 }}>Xóa Danh Sách ?</h2>
        <p style={{ margin: "0 0 28px", color: "#bbb", fontSize: 14, lineHeight: 1.6 }}>
          Bạn có chắc muốn xóa <strong style={{ color: "#fff" }}>{ten}</strong> ?<br />
          Hành động này không thể hoàn tác.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onDong}
            style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#3a3a3a", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
          >
            Hủy
          </button>
          <button
            onClick={() => { onXacNhan(); onDong(); }}
            style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#e53935", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </Modal>
  );
}



function ModalChiaSe({ onDong }) {
  const [daSaoCHep, setDaSaoChep] = useState(false);

  const mangMangXaHoi = [
    { ten: "Facebook", icon: "f" },
    { ten: "Twitter", icon: "𝕏" },
    { ten: "Instagram", icon: "" },
    { ten: "Sao Chép", icon: "" },
  ];

  function handleSaoChep() {
    setDaSaoChep(true);
    setTimeout(() => setDaSaoChep(false), 2000);
  }

  return (
    <Modal onDong={onDong}>
      <button
        onClick={onDong}
        style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#aaa", fontSize: 20, cursor: "pointer" }}
      >
        ✕
      </button>

      <h2 style={{ margin: "0 0 28px", color: "#fff", fontSize: 22, textAlign: "center" }}>Chia Sẻ Danh Sách</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        {mangMangXaHoi.map((mxh) => (
          <div
            key={mxh.ten}
            onClick={mxh.ten === "Sao Chép" ? handleSaoChep : undefined}
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#3a3a3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 8,
              color: daSaoCHep && mxh.ten === "Sao Chép" ? "#4caf50" : "#fff",
            }}>
              {mxh.icon}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
              {mxh.ten === "Sao Chép" && daSaoCHep ? "Đã sao chép!" : mxh.ten}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}



function DropdownBoLoc({ locHienTai, onApDung, onDong }) {
  const [locDaChon, setLocDaChon] = useState(locHienTai);
  const cacLua = ["Tất Cả", "Mới Thêm", "A - Z"];

  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 8px)",
      right: 0,
      background: "#2a2a2a",
      borderRadius: 14,
      padding: 20,
      zIndex: 200,
      minWidth: 260,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <p style={{ margin: "0 0 12px", color: "#fff", fontWeight: 600, fontSize: 15 }}>Phân Loại</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {cacLua.map((lua) => (
          <button
            key={lua}
            onClick={() => setLocDaChon(lua)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: locDaChon === lua ? "#e53935" : "#3a3a3a",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {lua}
          </button>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #3a3a3a", margin: "0 0 16px" }} />

      <button
        onClick={() => { onApDung(locDaChon); onDong(); }}
        style={{ padding: "10px 24px", borderRadius: 20, border: "none", background: "#e53935", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
      >
        Áp Dụng
      </button>
    </div>
  );
}



function ThePhimLuoi({ phim, onThichPhim }) {
  const [dangHover, setDangHover] = useState(false);

  return (
    <div>
      <div
        onMouseEnter={() => setDangHover(true)}
        onMouseLeave={() => setDangHover(false)}
        style={{
          position: "relative",
          borderRadius: 10,
          overflow: "hidden",
          cursor: "pointer",
          aspectRatio: "2/3",
          transform: dangHover ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.2s",
          boxShadow: dangHover ? "0 12px 36px rgba(0,0,0,0.7)" : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <img
          src={phim.poster}
          alt={phim.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {dangHover && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        )}

        <button
          onClick={() => onThichPhim(phim.id)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 15,
            color: phim.daThich ? "#e53935" : "#fff",
          }}
        >
          {phim.daThich ? "♥" : "♡"}
        </button>
      </div>

      <p style={{ margin: "8px 0 2px", fontSize: 13, fontWeight: 600, color: "#f0f0f0" }}>{phim.title}</p>
      <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>⭐ {phim.rating}</p>
    </div>
  );
}



function HangPhimDanhSach({ phim, onThichPhim }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      background: "#1a1a1a",
      borderRadius: 12,
      padding: "12px 16px",
    }}>
      <img
        src={phim.poster}
        alt={phim.title}
        style={{ width: 52, height: 72, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
      />

      <p style={{ flex: 1, margin: 0, fontWeight: 600, fontSize: 15, color: "#fff" }}>{phim.title}</p>

      <p style={{ margin: 0, fontSize: 13, color: "#777", flexShrink: 0 }}>{phim.nam}</p>

      <p style={{ margin: 0, fontSize: 13, color: "#bbb", flexShrink: 0 }}>⭐ {phim.rating}</p>

      <button
        onClick={() => onThichPhim(phim.id)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: phim.daThich ? "#e53935" : "#555", flexShrink: 0 }}
      >
        {phim.daThich ? "♥" : "♡"}
      </button>
    </div>
  );
}



function ManHinhRong() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 24, opacity: 0.3 }}></div>
      <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 700, color: "#fff" }}>Danh Sách Phim Còn Trống</h2>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: "#666" }}>Hãy thêm những bộ phim yêu thích của bạn vào đây</p>
      <button style={{
        background: "#e53935",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        padding: "13px 28px",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
      }}>
        ▶ Khám Phá Ngay
      </button>
    </div>
  );
}



export default function MyList() {
  const [danhSach, setDanhSach] = useState(danhSachBanDau);
  const [idDangChon, setIdDangChon] = useState(1);
  const [phim, setPhim] = useState(danhSachPhim);
  const [xemLuoi, setXemLuoi] = useState(true);
  const [locHienTai, setLocHienTai] = useState("Tất Cả");

  const [hienModalTao, setHienModalTao] = useState(false);
  const [xoaMucTieu, setXoaMucTieu] = useState(null);
  const [hienModalChiaSe, setHienModalChiaSe] = useState(false);
  const [hienDropdownLoc, setHienDropdownLoc] = useState(false);

  const boSuuTapHienTai = danhSach.find((d) => d.id === idDangChon);

  const phimHienThi = boSuuTapHienTai?.soPhim === 0
    ? []
    : [...phim].sort((a, b) => {
        if (locHienTai === "A - Z") return a.title.localeCompare(b.title, "vi");
        if (locHienTai === "Mới Thêm") return b.id - a.id;
        return 0;
      });

  function handleThichPhim(id) {
    setPhim(phim.map((p) => p.id === id ? { ...p, daThich: !p.daThich } : p));
  }

  function handleTaoMoi(ten, icon) {
    const moi = { id: Date.now(), ten, soPhim: 0, icon, laMacDinh: false };
    setDanhSach([...danhSach, moi]);
  }

  function handleXoa(id) {
    setDanhSach(danhSach.filter((d) => d.id !== id));
    if (idDangChon === id) setIdDangChon(1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>

      {}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
        borderBottom: "1px solid #1e1e1e",
        position: "sticky",
        top: 0,
        background: "#111",
        zIndex: 100,
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#e53935" }}>CINEVIBE</span>

        <nav style={{ display: "flex", gap: 32 }}>
          {["Home", "Movies", "TV Shows", "My List"].map((item) => (
            <a key={item} href="#" style={{
              color: item === "My List" ? "#e53935" : "#ccc",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: item === "My List" ? 700 : 400,
              borderBottom: item === "My List" ? "2px solid #e53935" : "none",
              paddingBottom: 2,
            }}>
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 20, fontSize: 20, color: "#ccc" }}>
          <span style={{ cursor: "pointer" }}></span>
          <span style={{ cursor: "pointer" }}></span>
          <span style={{ cursor: "pointer" }}></span>
        </div>
      </header>

      {}
      <div style={{ display: "flex", gap: 24, padding: "28px 40px", maxWidth: 1100, margin: "0 auto" }}>

        {}
        <div style={{
          width: 230,
          flexShrink: 0,
          background: "#1a1a1a",
          borderRadius: 14,
          padding: "24px 16px",
          alignSelf: "flex-start",
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#666", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Bộ Sưu Tập
          </p>

          {danhSach.map((ds) => (
            <div
              key={ds.id}
              onClick={() => setIdDangChon(ds.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: idDangChon === ds.id ? "#e53935" : "transparent",
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>{ds.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: idDangChon === ds.id ? "#fff" : "#ddd" }}>
                    {ds.ten}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: idDangChon === ds.id ? "#ffcdd2" : "#777" }}>
                    {ds.soPhim} phim {ds.laMacDinh ? "· Mặc định" : ""}
                  </p>
                </div>
              </div>

              {!ds.laMacDinh && (
                <button
                  onClick={(e) => { e.stopPropagation(); setXoaMucTieu(ds); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 16 }}
                >
                  🗑
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setHienModalTao(true)}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: "#e53935",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Tạo Danh Sách Mới
          </button>

          <div style={{ marginTop: 32 }}>
            <button style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: "#e53935",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              marginBottom: 12,
            }}>
               Nâng Cấp Lên PRO
            </button>

            <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 13 }}>
              ↩ Đăng Xuất
            </button>
          </div>
        </div>

        {}
        <div style={{ flex: 1, minWidth: 0 }}>

          {}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{boSuuTapHienTai?.ten}</h1>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>
                Chào mừng chở lại! Bạn có {boSuuTapHienTai?.soPhim} phim đang chờ.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>

              {}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => { setHienDropdownLoc(!hienDropdownLoc); setHienModalChiaSe(false); }}
                  style={{ background: "#1e1e1e", border: "1px solid #333", color: "#ccc", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
                >
                  ⚙ Bộ Lọc
                </button>
                {hienDropdownLoc && (
                  <DropdownBoLoc
                    locHienTai={locHienTai}
                    onApDung={setLocHienTai}
                    onDong={() => setHienDropdownLoc(false)}
                  />
                )}
              </div>

              {}
              <button
                onClick={() => { setHienModalChiaSe(true); setHienDropdownLoc(false); }}
                style={{ background: "#1e1e1e", border: "1px solid #333", color: "#ccc", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
              >
                ↗ Chia Sẻ
              </button>

              {}
              <button
                onClick={() => setXemLuoi(true)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, background: xemLuoi ? "#e53935" : "#222", color: "#fff", cursor: "pointer", fontSize: 16 }}
              >
                ⊞
              </button>
              <button
                onClick={() => setXemLuoi(false)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, background: !xemLuoi ? "#e53935" : "#222", color: "#fff", cursor: "pointer", fontSize: 16 }}
              >
                ≡
              </button>
            </div>
          </div>

          {}
          {phimHienThi.length === 0 ? (
            <ManHinhRong />
          ) : xemLuoi ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 20 }}>
              {phimHienThi.map((p) => (
                <ThePhimLuoi key={p.id} phim={p} onThichPhim={handleThichPhim} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phimHienThi.map((p) => (
                <HangPhimDanhSach key={p.id} phim={p} onThichPhim={handleThichPhim} />
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <footer style={{ textAlign: "center", padding: "40px 20px 28px", borderTop: "1px solid #1e1e1e", marginTop: 40 }}>
        <p style={{ fontSize: 20, fontWeight: 900, color: "#e53935", margin: "0 0 10px" }}>CINEVIBE</p>
        <p style={{ fontSize: 12, color: "#555", margin: "0 0 16px" }}>
          Nền tảng xem phim trực tuyến hàng đầu Việt Nam. Trải nghiệm điện ảnh đỉnh cao ngay tại nhà.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
          {["f", "𝕏", "", "▶"].map((icon, i) => (
            <div key={i} style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#666", fontSize: 14,
            }}>
              {icon}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#444" }}>© 2026 CINEVIBE. All rights reserved.</p>
      </footer>

      {}
      {hienModalTao && (
        <ModalTaoMoi onDong={() => setHienModalTao(false)} onTao={handleTaoMoi} />
      )}
      {xoaMucTieu && (
        <ModalXoa
          ten={xoaMucTieu.ten}
          onDong={() => setXoaMucTieu(null)}
          onXacNhan={() => handleXoa(xoaMucTieu.id)}
        />
      )}
      {hienModalChiaSe && (
        <ModalChiaSe onDong={() => setHienModalChiaSe(false)} />
      )}
    </div>
  );
}
