import { Router } from 'express'
import litprotocol from './controller'

const router = Router()

// define routes
router.route('/encrypt').post(litprotocol.encrypt)

export default router
