import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
import { env } from './environment.config.js'

const { PrismaClient } = pkg
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
export default prisma
