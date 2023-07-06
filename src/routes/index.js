import { Router } from "express"
import usuarioRouter from '../routes/usuarioRouter.js'
import transacaoRouter from '../routes/transacaoRouter.js'



const router = Router()

router.use(usuarioRouter)
router.use(transacaoRouter)


export default router