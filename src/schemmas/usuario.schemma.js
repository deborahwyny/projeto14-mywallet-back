import joi from "joi"


export const cadastroSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().required().trim(),
  senha: joi.string().min(3).trim(),
  repetirSenha: joi.string().required().valid(joi.ref('senha')).trim(),
});

    
export const loginSchema = joi.object({
        email: joi.string().required().trim(),
        senha: joi.string().required().min(3).trim()
      });
    

    