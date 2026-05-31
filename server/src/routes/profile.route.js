import express from 'express'
import { verifyUserSession } from '../middlewares/userAuth.middleware.js'
import * as profileController from '../controllers/profile.controller.js'

const Router = express.Router()

Router.use(verifyUserSession)

Router.get('/', profileController.getProfiles)
Router.get('/:id', profileController.getProfile)
Router.post('/', profileController.createProfile)
Router.put('/:id', profileController.updateProfile)
Router.delete('/:id', profileController.deleteProfile)

export default Router
