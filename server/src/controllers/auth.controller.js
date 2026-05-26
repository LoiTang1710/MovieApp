import * as AuthService from '../services/auth.service.js'
import { sendOtpEmail } from '../utils/email.js'

/**
 * API gửi mã xác thực OTP
 * POST /api/auth/send-otp
 */
export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body // type: 'register' hoặc 'forgot-password'
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email không được để trống' })
    }
    if (!type || !['register', 'forgot-password'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Loại yêu cầu không hợp lệ' })
    }

    // Sinh mã ngẫu nhiên 6 chữ số
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Lưu OTP vào session thay vì database
    req.session.otpData = {
      email,
      code,
      type,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 phút
    }

    // Gửi email OTP
    await sendOtpEmail(email, code, type)

    res.status(200).json({ success: true, message: 'Đã gửi mã xác nhận OTP qua email' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * API đăng ký tài khoản mới
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, username, code } = req.body

    if (!email || !password || !username || !code) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' })
    }

    // Xác thực OTP từ session
    const otpData = req.session.otpData
    if (!otpData || otpData.email !== email || otpData.code !== code || otpData.type !== 'register') {
      return res.status(400).json({ success: false, message: 'Mã xác nhận không hợp lệ' })
    }
    if (Date.now() > otpData.expiresAt) {
      delete req.session.otpData
      return res.status(400).json({ success: false, message: 'Mã xác nhận đã hết hạn' })
    }
    // Xóa OTP khỏi session sau khi xác thực
    delete req.session.otpData

    const user = await AuthService.register(email, password, username)
    
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    req.session.user = safeUser

    res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công', user: safeUser })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * API đăng nhập
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu không được để trống' })
    }

    const user = await AuthService.login(email, password)

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    // Lưu thông tin an toàn vào session
    req.session.user = safeUser

    res.status(200).json({ success: true, message: 'Đăng nhập thành công', user: safeUser })
  } catch (error) {
    res.status(401).json({ success: false, message: error.message })
  }
}

/**
 * API quên mật khẩu / đặt lại mật khẩu
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, code } = req.body

    if (!email || !newPassword || !code) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' })
    }

    // Xác thực OTP từ session
    const otpData = req.session.otpData
    if (!otpData || otpData.email !== email || otpData.code !== code || otpData.type !== 'forgot-password') {
      return res.status(400).json({ success: false, message: 'Mã xác nhận không hợp lệ' })
    }
    if (Date.now() > otpData.expiresAt) {
      delete req.session.otpData
      return res.status(400).json({ success: false, message: 'Mã xác nhận đã hết hạn' })
    }
    // Xóa OTP khỏi session sau khi xác thực
    delete req.session.otpData

    await AuthService.forgotPassword(email, newPassword)
    res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * API lấy thông tin cá nhân của session hiện tại
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' })
    }
    
    res.status(200).json({ success: true, user: req.session.user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * API đăng xuất
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' })
    res.clearCookie('connect.sid')
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' })
  })
}