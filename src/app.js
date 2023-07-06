import express from 'express'
import { MongoClient, ObjectId } from "mongodb"
import cors from 'cors'
import joi from "joi"
import dotenv from "dotenv"
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs'
import { cadastroUser, loginUser, usuarioLogado } from './controllers/usuarios.controllers.js'
import { entrada, operacoes, saida } from './controllers/transacao.controllers.js'

/// configurações
const app = express();
app.use(cors());
app.use(express.json())
dotenv.config()

/// conexão com o banco
const mongoClient = new MongoClient(process.env.DATABASE_URL)

try {
    mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}

export const db = mongoClient.db()


/// schemas

export const cadastroSchema = joi.object({name: joi.string().required().trim(),
email: joi.string().required().trim(),
senha: joi.string().min(3).trim(),
repeat_password: joi.ref('password')
})

export const loginSchema = joi.object({
    email: joi.string().required().trim(),
    senha: joi.string().required().min(3).trim()
  });


export const transacaoSchema = joi.object({
    valor: joi.number().required().positive(),
    descricao: joi.string().required()
})

/// endpoints

/// usuario login, cadastro e token
app.post("/cadastroUser", cadastroUser)

app.post("/loginUser", loginUser)

app.get("/usuarioLogado", usuarioLogado)


/// entrada/saida de valores e listagem de operações

app.post("/entrada", entrada)

app.post("/saida", saida)

app.get("/operacoes", operacoes)


/// porta sendo utilizada
const PORT = 5000
app.listen(PORT, () =>console.log(`servidor está rodando na porta ${PORT}`))