import express from 'express'
import { MongoClient, ObjectId } from "mongodb"
import cors from 'cors'
import joi from "joi"
import dotenv from "dotenv"
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs'

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

const db = mongoClient.db()


/// schemas

const cadastroSchema = joi.object({name: joi.string().required().trim(),
email: joi.string().required().trim(),
senha: joi.string().min(3).trim(),
repeat_password: joi.ref('password')
})

const loginSchema = joi.object({
    email: joi.string().required().trim(),
    senha: joi.string().required().min(3).trim()
  });


const transacaoSchema = joi.object({
    valor: joi.number().required().positive(),
    descricao: joi.string().required()
})

/// endponts
/// cadastrar usuario
app.post("/cadastroUser", async (req, res)=>{

    const {name, email, senha} = req.body
    
    const validacao = cadastroSchema.validate(req.body)
    if (validacao.error) {
        return res.status(422).send(validacao.error.details.map(detail => detail.message))
    }
    const cryptySenha = bcrypt.hashSync(senha, 3)

    try{
        const participanteCadstrado = await db.collection("usuario").findOne({email})
        if (participanteCadstrado) return res.sendStatus(409)

        await db.collection("usuario").insertOne({name, email, senha: cryptySenha})

        res.sendStatus(201)

    }catch(err){
        res.status(500).send(err.message)
    }
})

/// login usuario 
app.post("/loginUser", async (req, res)=>{
    const { email, senha } = req.body;

    const validacao = loginSchema.validate(req.body)

    if (validacao.error) {
        return res.status(422).send(validacao.error.details.map(detail => detail.message))
    }

    try {
       
        const user = await db.collection("usuario").findOne({email})
        if(!user) return res.sendStatus(401) 

        if(!bcrypt.compareSync(senha, user.senha)) return res.sendStatus(401)

        const sessionToken = uuid()

        await db.collection("sessao").insertOne({userId: user._id, sessionToken})
        delete user.password;
        res.status(200).send(sessionToken)
    } catch(err) {
        res.status(500).send(err.message)

    }

})

//// usuario logado pegando o token --- arrumar token
app.get("/usuarioLogado", async(req, res)=>{

    const {autorizacao} = req.headers
    const token = autorizacao?.replace('Bearer ', '')
    console.log("Token:", token);

    if(!token) return res.sendStatus(401)


    try{

        const sessao = await db.collection("sessao").findOne({ token })
        console.log("Session:", sessao);
		if (!sessao) return res.sendStatus(401)        


        const usuario = await db.collection("usuario").findOne({ _id: sessao.userId });
        console.log("Usuario:", usuario);


        res.status(200).send(usuario)
        
    } catch(err) {
        res.status(500).send(err.message)

    }

})

/// entrada de valores - sem tokent 
app.post("/entrada", async(req, res)=>{

    const {valor, descricao} = req.body
    const validacao = transacaoSchema.validate(req.body)

    if (validacao.error) {
        return res.status(422).send(validacao.error.details.map(detail => detail.message))
    }

    try {

        const entrada = await db.collection("entrada").insertOne({valor, descricao})
        if(!entrada) return res.status(422)


        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)

    }

})

/// saida de valores - sem token

app.post("/saida", async(req, res)=>{

    const {valor, descricao} = req.body
    const validacao = transacaoSchema.validate(req.body)

    if (validacao.error) {
        return res.status(422).send(validacao.error.details.map(detail => detail.message))
    }

    try {

        const entrada = await db.collection("saida").insertOne({valor, descricao})
        if(!entrada) return res.status(422)


        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)

    }

})

/// listagem de operações - sem token 

app.get("operacoes", async (req, res)=>{
    
})

    /// porta sendo utilizada
const PORT = 5000
app.listen(PORT, () =>console.log(`servidor está rodando na porta ${PORT}`))