import express from 'express'
import {
  getAnimes,
  getDetail,
  getEpisodes,
  getImages,
  getPopulars,
  getReleases,
  getTopRates,
  getTrailers,
} from '../controllers/media.controller.js'

const Router = express.Router()

// GET /api/medias
Router.route('/images/:id').get(getImages)
Router.route('/popular').get(getPopulars)

Router.route('/trailer/:id').get(getTrailers)
Router.route('/released').get(getReleases)
Router.route('/top_rated').get(getTopRates)
Router.route('/anime').get(getAnimes)

Router.route('/detail/:id').get(getDetail)
Router.route('/tv/:id/episodes').get(getEpisodes)
export default Router
