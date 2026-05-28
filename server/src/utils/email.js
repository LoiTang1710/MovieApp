import nodemailer from 'nodemailer';

// Tạo transporter gửi email sử dụng thông tin từ biến môi trường (nếu có)
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true nếu port là 465
      auth: { user, pass }
    });
  }
  return null;
};

/**
 * Gửi email chứa mã xác thực OTP
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} code - Mã OTP
 * @param {string} type - Loại OTP ('register' hoặc 'forgot-password')
 */
export const sendOtpEmail = async (to, code, type) => {
  const subject = type === 'register' 
    ? '[CineVibe] Mã xác nhận đăng ký tài khoản mới' 
    : '[CineVibe] Yêu cầu khôi phục mật khẩu tài khoản';
  
  const title = type === 'register' ? 'Đăng ký tài khoản' : 'Khôi phục mật khẩu';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #e50914; text-align: center;">CineVibe</h2>
      <p>Xin chào,</p>
      <p>Bạn đã gửi yêu cầu <strong>${title}</strong> tại hệ thống CineVibe.</p>
      <p>Dưới đây là mã xác thực OTP của bạn (mã có hiệu lực trong 5 phút):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #e50914; border: 2px dashed #e50914; padding: 10px 20px; border-radius: 5px; background-color: #fff5f5;">
          ${code}
        </span>
      </div>
      <p>Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động từ hệ thống CineVibe, vui lòng không trả lời email này.</p>
    </div>
  `;

  const transporter = createTransporter();

  console.log(`[OTP LOG] ----------------------------------------`);
  console.log(`[OTP LOG] Gửi OTP đến email: ${to}`);
  console.log(`[OTP LOG] Loại yêu cầu: ${type}`);
  console.log(`[OTP LOG] MÃ OTP CỦA BẠN LÀ: ${code}`);
  console.log(`[OTP LOG] ----------------------------------------`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `CineVibe Support <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent
      });
      console.log(`[OTP LOG] Đã gửi email OTP thật thành công!`);
    } catch (error) {
      console.error(`[OTP LOG] Không thể gửi email thật: ${error.message}`);
    }
  } else {
    console.log(`[OTP LOG] Không phát hiện cấu hình SMTP. Chỉ ghi mã OTP ra console.`);
  }
};
