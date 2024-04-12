import colors from 'colors'
import express from 'express'
import cors from 'cors'
import server from './server'

const app = express()

// Permitir todas las solicitudes CORS
app.use(cors())

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API en el puerto ${port}`))
})
