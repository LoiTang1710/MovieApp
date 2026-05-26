import express from 'express'
import authRoutes from './auth.route.js'
import statsRoutes from './stats.route.js'
import mediasRoutes from './media.route.js'
import premiumRoutes from './premium.route.js'
import adminRoutes from './admin.route.js'

const apiRouter = express.Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/stats', statsRoutes) 
apiRouter.use('/medias', mediasRoutes)
apiRouter.use('/premium', premiumRoutes)
apiRouter.use('/admin', adminRoutes)

export default apiRouter
