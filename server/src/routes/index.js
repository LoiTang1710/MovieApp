import express from 'express'
import statsRoutes from './stats.route.js'
import mediasRoutes from './media.route.js'

const apiRouter = express.Router()

apiRouter.use('/stats', statsRoutes) 
apiRouter.use('/medias', mediasRoutes)

export default apiRouter
