import express from 'express'
import { getPopular } from '../controllers/movie.controller.js'

const Router = express.Router()

// GET /api/movies/popular
Router.route('/popular').get(getPopular)

export default Router
