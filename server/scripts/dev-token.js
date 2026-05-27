/**
 * Sinh JWT dev để test đánh giá/bình luận khi login chưa xong.
 * Usage: node scripts/dev-token.js [email]
 */
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import prisma from '../src/config/database.config.js'

const email = process.argv[2] || 'user@test.com'

if (!process.env.JWT_SECRET) {
  console.error('Thiếu JWT_SECRET trong server/.env')
  process.exit(1)
}

const user = await prisma.user.findUnique({ where: { email } })

if (!user) {
  console.error(`Không tìm thấy ${email}. Chạy: npm run db:seed`)
  process.exit(1)
}

const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' },
)

console.log('\n--- Dev JWT ---\n')
console.log(token)
console.log('\nDán vào Console trình duyệt:')
console.log(`localStorage.setItem('token', '${token}')`)
console.log('')

await prisma.$disconnect()
