import express from 'express'
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  avatars,
} from '../controllers/profile.controller.js'

const Router = express.Router()

Router.route('/').get(getAll).post(create)
Router.route('/avatars').get(avatars)
Router.route('/:id').get(getOne).put(update).delete(remove)

export default Router
