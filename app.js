require('dotenv').config()
const express = require('express')
const routes = require('./api/routes')

const app = express()

routes(app)

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public');

})
app.listen(3000)
console.log('Server open http://localhost:3000')






