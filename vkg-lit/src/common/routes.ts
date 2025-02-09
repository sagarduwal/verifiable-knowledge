import { Router } from 'express'

const router: Router = Router()

// import routes
import litProtocolRouter from '../resources/litprotocol/routes'

router.use('/lit', litProtocolRouter)

export default router
