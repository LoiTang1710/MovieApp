import express from 'express'
import { getPopular, getTrailer } from '../controllers/movie.controller.js'

const Router = express.Router()

// GET /api/movies/popular
Router.route('/popular').get(getPopular)
Router.route('/trailer/:id').get(getTrailer)
export default Router
