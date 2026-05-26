import prisma from '../src/config/database.config.js'
import { hashPassword } from '../src/services/auth.service.js'

const premiumPlans = [
  {
    code: 'PREMIUM_MONTHLY',
    name: 'Premium Tháng',
    price: 375000,
    currency: 'VND',
    durationDays: 30,
    isActive: true,
  },
  {
    code: 'PREMIUM_YEARLY',
    name: 'Premium Năm',
    price: 2999999,
    currency: 'VND',
    durationDays: 365,
    isActive: true,
  },
]

const genres = ['Hành động', 'Tình cảm', 'Kinh dị', 'Hài', 'Khoa học viễn tưởng', 'Hoạt hình']

const movies = [
  {
    title: 'Tiên Nghịch',
    description: 'Phim kể về cuộc hành trình của Vương Lâm, một thiếu niên bình thường trở thành một trong những tu sĩ mạnh nhất trong thế giới tiên hiệp. Là một thiếu niên may mắn, bị cuốn vào thế giới tu tiên của nước Triệu. Ban đầu, hắn thiếu linh căn và không có tri thức về thế giới này. Tuy nhiên, một hiểu lầm tai hại và một khối thiết tinh bí ẩn đã thay đổi cuộc đời của Vương Lâm mãi mãi. Hắn nhận được một "hạt châu thần bí", sự hỗ trợ quý báu trong việc trở thành một tu sĩ mạnh mẽ. Con đường tu tiên của Vương Lâm không hề dễ dàng. Hắn phải đối mặt với những thử thách đầy khó khăn và hiểm nguy, chiến đấu với các thế lực tà ác và khám phá những bí ẩn sâu thẳm về thế giới tiên hiệp. Cuộc hành trình này không chỉ là về sức mạnh, mà còn về sự trưởng thành, trí tuệ và lòng dũng cảm trong trái tim của Vương Lâm.',
    releaseYear: 2023,
    country: 'Trung Quốc',
    duration: 20,
    posterUrl: 'https://media.themoviedb.org/t/p/w260_and_h390_face/mQrx1A2mBCEloORl1YNqAFIE1kG.jpg',
    status: 'AVAILABLE',
    views: 155500,
    rating: 9.2,
    genres: ['Hành động', 'Hoạt hình'],
  },
  {
    title: 'Kiếm Lai',
    description: 'Trần Bình An từ một thiếu niên vô danh buộc phải gánh lấy sứ mệnh dẫn dắt Lý Bảo Bình cùng đồng hành vượt biên, tìm đường đến nước Tùy xa xôi để nối tiếp học nghiệp còn chưa hoàn thành. Hành trình mở ra giữa non sông rộng lớn, phong cảnh tuy đẹp như tranh, nhưng sát cơ ẩn sâu trong từng bước chân. Thiết kỵ lạnh lùng truy bức không ngừng, yêu tà quỷ mị rình rập trong bóng tối, sinh tử chỉ cách nhau một nhịp thở. Trước gió bụi mịt mờ ấy, Trần Bình An không còn đường lùi, chỉ có thể tiến lên, dùng ý chí và nắm đấm mở lối sinh tồn. Giữa cơn loạn thế, những cường giả giấu tên lần lượt xuất hiện, âm thầm dang tay che chở, cũng đồng thời đẩy chàng vào vòng xoáy sâu hơn của võ đạo và đại cục.',
    releaseYear: 2024,
    country: 'Trung Quốc',
    duration: 24,
    posterUrl: 'https://media.themoviedb.org/t/p/w260_and_h390_face/p2PgXFWzPGWLXxVU0ccurC8oWyz.jpg',
    status: 'AVAILABLE',
    views: 12200,
    rating: 9.5,
    genres: ['Hành động', 'Hoạt hình'],
  },
  {
    title: 'Bóng Ma Anh Quốc',
    description: 'Được đặt trong bối cảnh nước Anh đầu thế kỷ 19, Peaky Blinders nói về gia đình Shelby, những người cầm đầu băng đảng Peaky Blinders khét tiếng trong thế giới ngầm với bộ não là Tommy Shelby, đứa con trai thứ hai. Bộ phim là hành trình thăng tiến trong thế giới ngầm của Tommy bằng những mưu mô, thủ đoạn tàn nhẫn. Ngoài ra, người xem cũng sẽ được gặp lại nhiều nhân vật và sự kiện lịch sử có thật như Winston Churchill, cuộc kháng chiến đòi độc lập của Ai-len với Anh Quốc .',
    releaseYear: 2022,
    country: 'Anh',
    duration: 45,
    posterUrl: 'https://media.themoviedb.org/t/p/w260_and_h390_face/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    status: 'AVAILABLE',
    views: 11100,
    rating: 8.8,
    genres: ['Hành động'],
  },
]

const promotions = [
  {
    code: 'WELCOME50',
    name: 'Chào mừng thành viên mới',
    description: 'Giảm 50% gói Premium tháng đầu',
    discountPercent: 50,
    maxUses: 1000,
    usedCount: 120,
    status: 'ACTIVE',
    startAt: new Date('2025-01-01'),
    endAt: new Date('2026-12-31'),
  },
  {
    code: 'TET2026',
    name: 'Khuyến mãi Tết 2026',
    description: 'Giảm 30% tất cả gói Premium',
    discountPercent: 30,
    maxUses: 500,
    usedCount: 45,
    status: 'ACTIVE',
    startAt: new Date('2026-01-15'),
    endAt: new Date('2026-02-28'),
  },
]

const seedPremiumPlans = async () => {
  await Promise.all(
    premiumPlans.map(({ code, ...data }) =>
      prisma.premiumPlan.upsert({
        where: { code },
        update: data,
        create: { code, ...data },
      }),
    ),
  )
}

const seedAdminUser = async () => {
  const password = await hashPassword('admin123')
  await prisma.user.upsert({
    where: { email: 'admin@cinevibe.com' },
    update: {
      password,
      role: 'ADMIN',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
    },
    create: {
      email: 'admin@cinevibe.com',
      password,
      role: 'ADMIN',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      profiles: { create: { name: 'Admin', type: 'ADULT' } },
    },
  })

  const userPassword = await hashPassword('user123')
  await prisma.user.upsert({
    where: { email: 'user@cinevibe.com' },
    update: {
      password,
      fullName: 'Trần Thị Lan',
      phone: '0912345678',
      dateOfBirth: new Date('1998-08-20'),
      gender: 'FEMALE',
    },
    create: {
      email: 'user@cinevibe.com',
      password: userPassword,
      role: 'USER',
      fullName: 'Trần Thị Lan',
      phone: '0912345678',
      dateOfBirth: new Date('1998-08-20'),
      gender: 'FEMALE',
      profiles: { create: { name: 'Người xem', type: 'ADULT' } },
    },
  })

  const password2 = await hashPassword('user123')
  await prisma.user.upsert({
    where: { email: 'minh.nguyen@email.com' },
    update: {},
    create: {
      email: 'minh.nguyen@email.com',
      password: password2,
      role: 'USER',
      fullName: 'Nguyễn Hoàng Minh',
      phone: '0923456789',
      dateOfBirth: new Date('1995-03-10'),
      gender: 'MALE',
    },
  })
}

const seedGenresAndMovies = async () => {
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  for (const movie of movies) {
    const { genres: genreNames, ...data } = movie
    const genreRecords = await prisma.genre.findMany({
      where: { name: { in: genreNames } },
    })

    const existing = await prisma.movie.findFirst({ where: { title: data.title } })
    if (existing) {
      await prisma.movie.update({
        where: { id: existing.id },
        data: {
          ...data,
          genres: { set: genreRecords.map((g) => ({ id: g.id })) },
        },
      })
    } else {
      await prisma.movie.create({
        data: {
          ...data,
          genres: { connect: genreRecords.map((g) => ({ id: g.id })) },
        },
      })
    }
  }
}

const seedPromotions = async () => {
  for (const promo of promotions) {
    await prisma.promotion.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo,
    })
  }
}

try {
  await seedPremiumPlans()
  await seedAdminUser()
  await seedGenresAndMovies()
  await seedPromotions()
  console.log('Seed completed: admin, users, movies, promotions.')
  console.log('Admin login: admin@cinevibe.com / admin123')
} catch (error) {
  console.error('Seed failed.', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
