require('dotenv').config();
const bodyParser = require('body-parser')
const database = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



module.exports = app => {
    app.use(bodyParser.json())


    //REGISTRAR USUARIO 
    app.post('/registrar', async (req, res) => {

        const { name, senha, confirmaSenha } = req.body

        //validacoes
        if (!name) {
            return res.status(422).json({
                msg: "O nome é obrigatório.."
            })
        }
        if (!senha) {
            return res.status(422).json({
                msg: "A senha é obrigatório.."
            })
        }
        if (!confirmaSenha) {
            return res.status(422).json({
                msg: "Confirme sua senha.."
            })
        }

        if (senha != confirmaSenha) {
            return res.status(422).json({
                msg: "As senhas não estão iguais! .."
            })
        }

        //VER SE EXISTE O USUARIO
        const umUsuario = await database.Usuario.findOne({
            where: { nome: name }
        })
        if (umUsuario) {
            return res.status(422).json({
                msg: "Já existe um usuario cadastrado.."
            })
        }

        //create senha

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(senha, salt)

        //create usuario
        await database.Usuario.create({
            nome: name,
            senha: passwordHash,
            confirmar_senha: confirmaSenha,
            createdAt: new Date(),
            updatedAt: new Date()
        })


        return res.status(200).json({
            msg: "REGISTRO OK.."
        })



    })

    //LOGIN
    app.post('/login', async (req, res) => {

        const { name, senha } = req.body

        //validacoes

        if (!name) {
            return res.status(422).json({
                msg: "O nome é obrigatória.."
            })
        }
        if (!senha) {
            return res.status(422).json({
                msg: "A senha é obrigatório.."
            })
        }


        //VER SE EXISTE O USUARIO
        const user = await database.Usuario.findOne({
            where: { nome: name }
        })

        if (!user) {
            return res.status(422).json({
                msg: "Usuario incorreto.."
            })
        }

        //VER SE A SENHA CONFERE

        const checkPassword = await bcrypt.compare(senha, user.senha)

        if (!checkPassword) {
            return res.status(422).json({
                msg: "Senha incorreta.."
            })
        }

        try {
            const secret = process.env.SECRET

            const token = jwt.sign({
                id: user._id
            }, secret)

            res.status(200).json({
                msg: `LOGIN OK, TOKEN: ${token}`
            })

        } catch (err) {
            console.log(err);
            res.status(500).json({
                msg: "ocorreu um erro.. tente novamente"
            })
        }


    })

    //ROTA PRIVADA
    app.get('/user/:id', checkToken, async (req, res) => {
        const id = req.params.id

        //ver se o usuario existe
        const user = await database.Usuario.findOne({
            where: { id: id },
            attributes: { exclude: ['senha', 'confirmar_senha'] }
        })

        //validacoes


        res.status(200).json({
            user
        })
    })
}

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];


    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}