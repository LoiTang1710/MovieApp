import express from 'express'
import {
  getAnimes,
  getPopulars,
  getReleases,
  getTopRates,
  getTrailers,
} from '../controllers/media.controller.js'

const Router = express.Router()

// GET /api/media/popular

Router.route('/popular').get(getPopulars)
Router.route('/trailer/:id').get(getTrailers)
Router.route('/released').get(getReleases)
Router.route('/top_rated').get(getTopRates)
Router.route('/anime').get(getAnimes)

export default Router
