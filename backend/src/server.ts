import 'reflect-metadata'
import express from 'express'
import './database'
import { router } from './routes'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(3333, () => console.log('Servidor executando na porta 3333!'))