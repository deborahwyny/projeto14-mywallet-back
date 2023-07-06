import { db } from '../app.js'


export async function entrada (req, res){

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

}

export async function saida (req, res){

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
}

export async function operacoes (req, res){
    try {
        const userId = req.user._id; 
        const user = await db.collection("usuario").findOne({ _id: ObjectId(userId) });
        if(!user) return res.sendStatus(404)

        const entrada = await db.collection("entrada").find({valor, descricao}).toArray()
        if(!entrada) return res.sendStatus(404)

        const saida = await db.collection("saida").find({valor, descricao}).toArray()
        if(!saida) return res.sendStatus(404)


        res.sendStatus(200)

    } catch(err){
        res.status(500).send(err.message)

    }

}


///todas funções sem token