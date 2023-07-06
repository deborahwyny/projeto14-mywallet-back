import { Router } from "express";
import { entrada, operacoes, saida } from '../controllers/transacao.controllers.js'


const transacaoRouter = Router()


transacaoRouter.post("/entrada", entrada)
transacaoRouter.post("/saida", saida)
transacaoRouter.get("/operacoes", operacoes)

export default transacaoRouter