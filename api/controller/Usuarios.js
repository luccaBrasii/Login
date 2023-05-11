const database = require('../models/usuario')

class Usuarios {
    static async buscaUsuario(req, res) {
        const usuario = req.name
        try {
            const umUsuario = await database.Usuario.findOne({
                where: { nome: usuario }
            })
            return res.status(200).json(umUsuario)
        } catch (err) {
            return
        }
    }
}

module.exports = Usuarios