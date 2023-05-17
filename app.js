require('dotenv').config()
const express = require('express')
const routes = require('./api/routes')

const app = express()

routes(app)
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Bem vindo a api'
    })

})
app.listen(3000)
console.log('Server open http://localhost:3000')






