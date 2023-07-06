import joi from "joi"

export const transacaoSchema = joi.object({
    valor: joi.number().required().positive(),
    descricao: joi.string().required()
})
