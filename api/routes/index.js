require('dotenv').config();
const bodyParser = require('body-parser')
const database = require('../models')
const bcrypt = require('bcrypt')

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
            confirmar_senha: passwordHash,
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

            res.status(200).json({
                id: user.id,
                name: user.nome
            })



        } catch (err) {
            console.log(err);
            res.status(500).json({
                msg: "ocorreu um erro.. tente novamente"
            })
        }


    })


}

