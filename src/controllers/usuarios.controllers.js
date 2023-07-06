import  bcrypt from 'bcrypt'
import { db } from '../app.js'
import { cadastroSchema } from '../app.js'
import { loginSchema } from '../app.js'
import { v4 as uuid } from 'uuid';




///// endpoints
export async function cadastroUser (req, res){

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
}

export async function loginUser (req, res){
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

}

export async function usuarioLogado (req, res){

    const {autorizacao} = req.headers
    const token = autorizacao?.replace('Bearer ', '')
    console.log("Token:", token);

    if(!token) return res.sendStatus(401)


    try{

        const sessao = await db.collection("sessao").findOne({ sessionToken:token })
        console.log("Session:", sessao);
		if (!sessao) return res.sendStatus(401)        


        const usuario = await db.collection("usuario").findOne({ _id: sessao.userId });
        console.log("Usuario:", usuario);


        res.status(200).send(usuario)
        
    } catch(err) {
        res.status(500).send(err.message)

    }
}