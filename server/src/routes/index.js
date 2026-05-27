import express from 'express'
import authRoutes from './auth.route.js'
import statsRoutes from './stats.route.js'
import mediasRoutes from './media.route.js'
import premiumRoutes from './premium.route.js'
import adminRoutes from './admin.route.js'
import authRoutes from './auth.route.js'
import reviewRoutes from './review.route.js'
import commentRoutes from './comment.route.js'
import devRoutes from './dev.route.js'

const apiRouter = express.Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/stats', statsRoutes) 
apiRouter.use('/medias', mediasRoutes)
apiRouter.use('/premium', premiumRoutes)
apiRouter.use('/admin', adminRoutes)
apiRouter.use('/reviews', reviewRoutes)
apiRouter.use('/comments', commentRoutes)
apiRouter.use('/dev', devRoutes)

export default apiRouter
