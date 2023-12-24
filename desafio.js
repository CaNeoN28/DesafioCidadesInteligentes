class Usuario {
    constructor (nome, email, senha, listaDePermissoes, ativo) {
        this.nome = nome
        this.email = email
        this.senha = senha
        this.listaPermissoes = listaDePermissoes
        this.ativo = ativo

        this.dataCriacao = new Date()
        this.dataLogin = null
    }
}

const usuario = new Usuario("Carlos", "carlosfelipe.st28@gmail.com", "12345678", [], true)

console.log(usuario)

module.exports = {
    Usuario
}