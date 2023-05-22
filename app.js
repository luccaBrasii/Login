require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');

const routes = require('./api/routes')

const app = express()

routes(app)

app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));


app.get('/', (req, res) => {
    if (req.session.login == null) {
        res.status(200).sendFile(__dirname + '/public/login.html');
    } else {
        res.status(200).sendFile(__dirname + '/public/privateRoute.html');
    }
})

app.post('/', async (req, res) => {
    const user = await login(req.body.login, req.body.password)
    if (user) {
        req.session.login = user.name
    } else {
        console.log('falhou')
    }

    res.status(200).redirect(`/`)
})

app.get('/game', (req, res) => {
    if (req.session.login) {
        const userName = req.session.login;
        // Faça o que você precisa fazer com o nome do usuário aqui
        res.status(200).json({ user: userName })
    } else {
        res.status(200).redirect(`/`)
    }
})


app.listen(3000)
console.log('Server open http://localhost:3000')




async function login(name, senha) {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                senha: senha
            }),
        });

        if (response.ok) {
            const data = await response.json(); // Converter a resposta para JSON

            return data
        } else {
            const errorData = await response.json(); // Converter a resposta de erro para JSON
            console.log(errorData);
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error);
    }
}

