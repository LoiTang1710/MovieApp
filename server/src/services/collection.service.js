import { StatusCodes } from 'http-status-codes'
import prisma from '../config/database.config.js'
import { AppError } from '../utils/AppError.js'

// 1. Lấy danh sách Collections
export const getUserCollections = async (userId) => {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      _count: { select: { items: true } },
      items: { select: { mediaId: true } },
    },
    orderBy: {
      isDefault: 'desc',
    },
  })
  return collections.map((col) => ({
    id: col.id,
    collectionName: col.collectionName,
    iconKey: col.iconKey,
    isDefault: col.isDefault,
    count: col._count.items,
    items: col.items,
  }))
}

// 2. Lấy movie trong Collections
export const getMoviesInCollection = async (collectionId, userId) => {
  const collection = await prisma.collection.findFirst({
    where: { id: Number(collectionId), userId },
    include: {
      items: {
        orderBy: {
          addedAt: 'desc',
        },
      },
    },
  })
  if (!collection) throw new Error('COLLECTION NOT FOUND')
  return collection.items.map((item) => ({
    id: item.mediaId,
    mediaType: item.mediaType,
    title: item.title,
    rating: item.rating,
    poster: item.posterPath,
    like: true,
  }))
}

// 3. Tạo mới Collection
export const createCollection = async (userId, collectionName, iconKey) => {
  return await prisma.collection.create({
    data: {
      userId,
      collectionName,
      iconKey,
      isDefault: false,
    },
  })
}

// 4. Xóa Collection
export const deleteCollection = async (collectionId, userId) => {
  const collection = await prisma.collection.findFirst({
    where: { id: Number(collectionId), userId },
  })

  if (!collection)
    throw new AppError('Không tìm thấy bộ sưu tập', StatusCodes.NOT_FOUND)
  if (collection.isDefault)
    throw new AppError(
      'Không thể xóa danh sách mặc định',
      StatusCodes.BAD_REQUEST,
    )

  await prisma.collection.delete({
    where: {
      id: Number(collectionId),
    },
  })
  return true
}

// 5. Thêm/Bỏ phim (NÂNG CẤP HỖ TRỢ LƯU VÀO DANH SÁCH CỤ THỂ)
export const toggleFavouriteMovie = async (userId, movieId, movieData) => {
  // BƯỚC 1: Hứng thêm biến collectionId từ Frontend
  const { title, posterPath, rating, releasedDate, mediaType, collectionId } =
    movieData

  let targetCollection

  // BƯỚC 2: Nếu người dùng chọn 1 danh sách cụ thể từ Modal
  if (collectionId) {
    targetCollection = await prisma.collection.findFirst({
      where: { id: Number(collectionId), userId }, // Bảo mật: Đảm bảo danh sách này thuộc về user
    })

    if (!targetCollection) {
      throw new AppError('Không tìm thấy bộ sưu tập này', StatusCodes.NOT_FOUND)
    }
  }
  // BƯỚC 3: Nếu không truyền ID (fallback), tìm hoặc tạo danh sách Mặc định
  else {
    targetCollection = await prisma.collection.findFirst({
      where: { userId, isDefault: true },
    })

    if (!targetCollection) {
      targetCollection = await prisma.collection.create({
        data: {
          userId,
          collectionName: 'Phim Yêu Thích',
          iconKey: 'heart',
          isDefault: true,
        },
      })
    }
  }

  // BƯỚC 4: Kiểm tra phim đã có trong danh sách được chọn chưa
  const existingItem = await prisma.collectionItem.findUnique({
    where: {
      collectionId_mediaId: {
        collectionId: targetCollection.id, // Sửa defaultCol thành targetCollection
        mediaId: Number(movieId),
      },
    },
  })

  // BƯỚC 5: Xóa nếu đã có, Thêm nếu chưa có
  if (existingItem) {
    await prisma.collectionItem.delete({ where: { id: existingItem.id } })
    return { isAdded: false }
  } else {
    await prisma.collectionItem.create({
      data: {
        collectionId: targetCollection.id, // Sửa defaultCol thành targetCollection
        mediaId: Number(movieId),
        title: title || 'Unknown',
        posterPath: posterPath || '',
        rating: Number(rating) || 0,
        releasedDate: releasedDate
          ? String(releasedDate)
          : null,
        mediaType: mediaType || 'movie',
      },
    })
    return { isAdded: true }
  }
}
