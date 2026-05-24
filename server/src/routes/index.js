import express from 'express'
import statsRoutes from './stats.route.js'
import mediasRoutes from './media.route.js'
import adminRoutes from './admin.route.js'

const apiRouter = express.Router()

apiRouter.use('/stats', statsRoutes) 
apiRouter.use('/medias', mediasRoutes)
apiRouter.use('/admin', adminRoutes)

export default apiRouter
