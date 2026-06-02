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
  getSearch,
  getMovies,
} from '../controllers/media.controller.js'

const Router = express.Router()

Router.route('/search').get(getSearch)
Router.route('/movies').get(getMovies)
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
