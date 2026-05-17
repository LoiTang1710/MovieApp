import express from 'express'
import movieRoutes from './movie.route.js'
import statsRoutes from './stats.route.js'

const apiRouter = express.Router()

apiRouter.use('/movies', movieRoutes)
apiRouter.use('/stats', statsRoutes)

export default apiRouter
