require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const routes = require('./api/routes')

const app = express()

routes(app)
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Bem vindo a api'
    })

})
console.log('Server open http://localhost3000')
app.listen(3000)





