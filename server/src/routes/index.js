import express from 'express'
import statsRoutes from './stats.route.js'
import mediasRoutes from './media.route.js'
import premiumRoutes from './premium.route.js'

const apiRouter = express.Router()

apiRouter.use('/stats', statsRoutes) 
apiRouter.use('/medias', mediasRoutes)
apiRouter.use('/premium', premiumRoutes)

export default apiRouter
