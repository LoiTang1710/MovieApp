import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
import { env } from './environment.config.js'

const { PrismaClient } = pkg

let prisma

try {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  prisma = new PrismaClient({ adapter })
  console.log('Prisma client initialized')
} catch (error) {
  console.error('Failed to initialize Prisma client:', error.message)
  if (env.NODE_ENV === 'production') {
    throw error
  }
  // Mock prisma for local development only
  prisma = {
    user: {
      findUnique: async () => null,
      create: async (data) => data.data,
      update: async (data) => data.data,
    }
  }
}

export default prisma
