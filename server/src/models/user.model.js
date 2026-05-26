import { prisma } from '../config/database.config.js'

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  })
}

// Lưu ý: Tôi đã bỏ fullName đi vì bảng User không có cột này
export const createUser = async (email, hashedPassword, name) => {
  return await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name
      // role tự động lấy giá trị default là USER theo schema
    }
  })
}

export const updatePassword = async (email, hashedPassword) => {
  return await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })
}