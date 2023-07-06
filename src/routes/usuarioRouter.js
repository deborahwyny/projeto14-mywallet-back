import { Router } from "express"
import { cadastroUser, loginUser, usuarioLogado } from '../controllers/usuarios.controllers.js'


const usuarioRouter = Router() 

usuarioRouter.post("/cadastroUser", cadastroUser)
usuarioRouter.post("/loginUser", loginUser)
usuarioRouter.get("/usuarioLogado", usuarioLogado)

export default usuarioRouter