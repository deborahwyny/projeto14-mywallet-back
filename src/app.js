import express from 'express'
import cors from 'cors'
import router from './routes/index.js'

/// configurações
const app = express();
app.use(cors());
app.use(express.json())
app.use(router)

/// porta sendo utilizada
const PORT = 4000
app.listen(PORT, () =>console.log(`servidor está rodando na porta ${PORT}`))