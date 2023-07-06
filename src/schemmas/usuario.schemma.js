import joi from "joi"


export const cadastroSchema = joi.object({name: joi.string().required().trim(),
    email: joi.string().required().trim(),
    senha: joi.string().min(3).trim(),
    repeat_password: joi.ref('password')
    })
    
export const loginSchema = joi.object({
        email: joi.string().required().trim(),
        senha: joi.string().required().min(3).trim()
      });
    