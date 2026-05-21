import express from 'express'
import { getAnime, getPopular, getReleased, getTopRated, getTrailer } from '../controllers/movie.controller.js'

const Router = express.Router()

// GET /api/movies/popular
Router.route('/popular').get(getPopular)
Router.route('/trailer/:id').get(getTrailer)
Router.route('/released').get(getReleased)
Router.route('/toprated').get(getTopRated)
Router.route('/anime').get(getAnime)

export default Router
