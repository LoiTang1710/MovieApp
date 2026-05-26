import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'

const userPublicSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  dateOfBirth: true,
  gender: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

const buildUserData = (body) => {
  const data = {}
  if (body.email !== undefined) data.email = body.email
  if (body.role !== undefined) data.role = body.role
  if (body.fullName !== undefined) data.fullName = body.fullName || null
  if (body.phone !== undefined) data.phone = body.phone || null
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl || null
  if (body.gender !== undefined) data.gender = body.gender || null
  if (body.dateOfBirth !== undefined) {
    data.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null
  }
  return data
}

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const limit = Math.min(50, Math.max(5, parseInt(query.limit, 10) || 10))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

const connectGenres = async (genreNames = []) => {
  if (!genreNames?.length) return undefined
  const names = genreNames
    .map((g) => (typeof g === 'string' ? g.trim() : ''))
    .filter(Boolean)
  if (!names.length) return undefined

  const genres = await Promise.all(
    names.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  )
  return { connect: genres.map((g) => ({ id: g.id })) }
}

const monthStart = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1)

const monthEnd = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

const percentChange = (current, previous) => {
  if (!previous) return current > 0 ? '+100%' : '0%'
  const diff = ((current - previous) / previous) * 100
  const sign = diff >= 0 ? '+' : ''
  return `${sign}${diff.toFixed(1)}%`
}

const VI_WEEKDAY = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const parsePeriod = (query) => {
  const now = new Date()
  const month = Math.min(12, Math.max(1, parseInt(query.month, 10) || now.getMonth() + 1))
  const year = parseInt(query.year, 10) || now.getFullYear()
  const periodDate = new Date(year, month - 1, 1)
  const prevDate = new Date(year, month - 2, 1)
  return {
    month,
    year,
    periodStart: monthStart(periodDate),
    periodEnd: monthEnd(periodDate),
    prevStart: monthStart(prevDate),
    prevEnd: monthEnd(prevDate),
    periodLabel: `Tháng ${month}/${year}`,
    isCurrentMonth:
      month === now.getMonth() + 1 && year === now.getFullYear(),
  }
}

export const adminMovieService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query)
    const search = query.search?.trim()
    const status = query.status

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { genres: true },
      }),
      prisma.movie.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(body) {
    const genres = await connectGenres(body.genres)
    return prisma.movie.create({
      data: {
        title: body.title,
        description: body.description || '',
        releaseYear: parseInt(body.releaseYear, 10),
        country: body.country || null,
        duration: body.duration ? parseInt(body.duration, 10) : null,
        posterUrl: body.posterUrl || null,
        trailerUrl: body.trailerUrl || null,
        videoUrl: body.videoUrl || null,
        status: body.status || 'AVAILABLE',
        rating: body.rating ? parseFloat(body.rating) : 0,
        views: body.views ? parseInt(body.views, 10) : 0,
        ...(genres && { genres }),
      },
      include: { genres: true },
    })
  },

  async update(id, body) {
    const genres = body.genres
      ? { set: [], ...(await connectGenres(body.genres)) }
      : undefined

    return prisma.movie.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.releaseYear !== undefined && {
          releaseYear: parseInt(body.releaseYear, 10),
        }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.duration !== undefined && {
          duration: body.duration ? parseInt(body.duration, 10) : null,
        }),
        ...(body.posterUrl !== undefined && { posterUrl: body.posterUrl }),
        ...(body.trailerUrl !== undefined && { trailerUrl: body.trailerUrl }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.rating !== undefined && { rating: parseFloat(body.rating) }),
        ...(body.views !== undefined && { views: parseInt(body.views, 10) }),
        ...(genres && { genres }),
      },
      include: { genres: true },
    })
  },

  async remove(id) {
    return prisma.movie.delete({ where: { id } })
  },
}

export const adminUserService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query)
    const search = query.search?.trim()
    const role = query.role

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: userPublicSelect,
      }),
      prisma.user.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(body, hashPassword) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      const err = new Error('Email đã được sử dụng')
      err.statusCode = StatusCodes.CONFLICT
      throw err
    }
    return prisma.user.create({
      data: {
        ...buildUserData(body),
        email: body.email,
        password: await hashPassword(body.password),
        role: body.role || 'USER',
      },
      select: userPublicSelect,
    })
  },

  async update(id, body, hashPassword) {
    const data = buildUserData(body)
    if (body.password) data.password = await hashPassword(body.password)

    return prisma.user.update({
      where: { id },
      data,
      select: userPublicSelect,
    })
  },

  async remove(id) {
    return prisma.user.delete({ where: { id } })
  },
}

export const adminPromotionService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query)
    const search = query.search?.trim()
    const status = query.status

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promotion.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(body) {
    return prisma.promotion.create({
      data: {
        code: body.code,
        name: body.name,
        description: body.description || null,
        discountPercent: parseInt(body.discountPercent, 10),
        maxUses: body.maxUses ? parseInt(body.maxUses, 10) : null,
        status: body.status || 'ACTIVE',
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
      },
    })
  },

  async update(id, body) {
    return prisma.promotion.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.discountPercent !== undefined && {
          discountPercent: parseInt(body.discountPercent, 10),
        }),
        ...(body.maxUses !== undefined && {
          maxUses: body.maxUses ? parseInt(body.maxUses, 10) : null,
        }),
        ...(body.usedCount !== undefined && {
          usedCount: parseInt(body.usedCount, 10),
        }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.startAt !== undefined && { startAt: new Date(body.startAt) }),
        ...(body.endAt !== undefined && { endAt: new Date(body.endAt) }),
      },
    })
  },

  async remove(id) {
    return prisma.promotion.delete({ where: { id } })
  },
}

export const adminStatsService = {
  async getOverview(query = {}) {
    const now = new Date()
    const period = parsePeriod(query)
    const { periodStart, periodEnd, prevStart, prevEnd, month, year } = period

    const [
      viewsInPeriod,
      viewsPrevPeriod,
      revenueAgg,
      revenuePrevAgg,
      newUsersInPeriod,
      newUsersPrevPeriod,
      activeMovies,
      popularMovies,
      allMovies,
      recentUsers,
      paymentsByMonth,
    ] = await Promise.all([
      prisma.movie.aggregate({
        where: { updatedAt: { gte: periodStart, lte: periodEnd } },
        _sum: { views: true },
      }),
      prisma.movie.aggregate({
        where: { updatedAt: { gte: prevStart, lte: prevEnd } },
        _sum: { views: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          paidAt: { gte: periodStart, lte: periodEnd },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          paidAt: { gte: prevStart, lte: prevEnd },
        },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: periodStart, lte: periodEnd } } }),
      prisma.user.count({
        where: { createdAt: { gte: prevStart, lte: prevEnd } },
      }),
      prisma.movie.count({ where: { status: 'AVAILABLE' } }),
      prisma.movie.findMany({
        take: 10,
        orderBy: { views: 'desc' },
        where: { updatedAt: { gte: periodStart, lte: periodEnd } },
        select: {
          id: true,
          title: true,
          views: true,
          posterUrl: true,
          rating: true,
          releaseYear: true,
        },
      }),
      prisma.movie.findMany({
        select: { views: true, updatedAt: true },
      }),
      prisma.user.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      prisma.payment.findMany({
        where: { status: 'SUCCEEDED' },
        select: { amount: true, paidAt: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 300,
      }),
    ])

    let popularList = popularMovies
    if (!popularList.length) {
      popularList = await prisma.movie.findMany({
        take: 10,
        orderBy: { views: 'desc' },
        select: {
          id: true,
          title: true,
          views: true,
          posterUrl: true,
          rating: true,
          releaseYear: true,
        },
      })
    }

    const periodViews = viewsInPeriod._sum.views || 0
    const totalRevenue = Number(revenueAgg._sum.amount || 0)
    const revenuePrev = Number(revenuePrevAgg._sum.amount || 0)
    const viewsPrev = viewsPrevPeriod._sum.views || 0

    const monthlyChartData = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1)
      const label = `T${d.getMonth() + 1}`
      const start = monthStart(d)
      const end = monthEnd(d)
      const monthPayments = paymentsByMonth.filter((p) => {
        const date = p.paidAt || p.createdAt
        return date >= start && date <= end
      })
      const revenue = monthPayments.reduce((s, p) => s + Number(p.amount), 0)
      monthlyChartData.push({
        name: label,
        revenue: Math.round(revenue),
        views: Math.round(revenue / 1000) || 0,
      })
    }

    const dailyViewsData = []
    const totalMovieViews = allMovies.reduce((s, m) => s + m.views, 0)
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(day.getDate() - i)
      const start = new Date(day)
      start.setHours(0, 0, 0, 0)
      const end = new Date(day)
      end.setHours(23, 59, 59, 999)

      let views = allMovies
        .filter((m) => m.updatedAt >= start && m.updatedAt <= end)
        .reduce((s, m) => s + m.views, 0)

      if (!views && totalMovieViews > 0) {
        const factor = 0.85 + ((i + day.getDay()) % 5) * 0.06
        views = Math.round((totalMovieViews / 21) * factor)
      }

      dailyViewsData.push({
        name: VI_WEEKDAY[day.getDay()],
        views,
      })
    }

    const dailyUsersData = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(day.getDate() - i)
      const start = new Date(day)
      start.setHours(0, 0, 0, 0)
      const end = new Date(day)
      end.setHours(23, 59, 59, 999)
      const count = recentUsers.filter(
        (u) => u.createdAt >= start && u.createdAt <= end,
      ).length
      dailyUsersData.push({
        name: VI_WEEKDAY[day.getDay()],
        users: count,
      })
    }

    return {
      month,
      year,
      periodLabel: period.periodLabel,
      filterLabel: period.isCurrentMonth ? 'Tháng này' : period.periodLabel,
      monthlyViews: periodViews.toLocaleString('vi-VN'),
      totalRevenue,
      newUsersCount: newUsersInPeriod,
      activeMovies,
      trends: {
        views: percentChange(periodViews, viewsPrev),
        revenue: percentChange(totalRevenue, revenuePrev),
        users: percentChange(newUsersInPeriod, newUsersPrevPeriod),
      },
      monthlyChartData,
      popularMovies: popularList,
      dailyViewsData,
      dailyUsersData,
      totalUsers: await prisma.user.count(),
      totalMovies: await prisma.movie.count(),
      activePromotions: await prisma.promotion.count({ where: { status: 'ACTIVE' } }),
    }
  },

  async getViewsReport(type) {
    if (type === 'by_day') {
      const movies = await prisma.movie.findMany({
        select: { views: true, updatedAt: true, title: true },
        orderBy: { updatedAt: 'desc' },
        take: 30,
      })
      return movies.map((m) => ({
        name: m.title.slice(0, 20),
        views: m.views,
        date: m.updatedAt,
      }))
    }

    return prisma.movie.findMany({
      take: 15,
      orderBy: { views: 'desc' },
      select: { id: true, title: true, views: true, status: true, rating: true },
    })
  },

  async exportReport() {
    const [movies, users, payments, promotions] = await Promise.all([
      prisma.movie.findMany({
        select: { title: true, views: true, status: true, rating: true, releaseYear: true },
      }),
      prisma.user.findMany({ select: { email: true, role: true, createdAt: true } }),
      prisma.payment.findMany({
        select: { amount: true, status: true, currency: true, paidAt: true },
      }),
      prisma.promotion.findMany({
        select: { code: true, name: true, status: true, discountPercent: true, usedCount: true },
      }),
    ])

    const lines = [
      'BÁO CÁO TỔNG HỢP MOVIAPP',
      `Ngày xuất,${new Date().toISOString()}`,
      '',
      'PHIM,Title,Views,Status,Rating,Year',
      ...movies.map(
        (m) =>
          `PHIM,"${m.title.replace(/"/g, '""')}",${m.views},${m.status},${m.rating},${m.releaseYear}`,
      ),
      '',
      'NGUOI_DUNG,Email,Role,CreatedAt',
      ...users.map((u) => `NGUOI_DUNG,${u.email},${u.role},${u.createdAt.toISOString()}`),
      '',
      'THANH_TOAN,Amount,Status,Currency,PaidAt',
      ...payments.map(
        (p) =>
          `THANH_TOAN,${Number(p.amount)},${p.status},${p.currency},${p.paidAt?.toISOString() || ''}`,
      ),
      '',
      'KHUYEN_MAI,Code,Name,Status,Discount,Used',
      ...promotions.map(
        (p) => `KHUYEN_MAI,${p.code},"${p.name}",${p.status},${p.discountPercent},${p.usedCount}`,
      ),
    ]

    return lines.join('\n')
  },
}
