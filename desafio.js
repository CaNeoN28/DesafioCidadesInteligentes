const bcrypt = require("bcrypt")

class Usuario {
  validarUsuario(dadosUsuario) {
    const erros = [];

		const {nome, email, senha, listaPermissoes} = dadosUsuario || {}

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexSenha =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/g;

		if (!nome){
			erros.push("Nome é obrigatório")
		}

    if (!email) {
      erros.push("Email é obrigatório");
    } else if (!regexEmail.test(email)) {
      erros.push("Email inválido");
    }

    if (!senha) {
      erros.push("Senha é obrigatória");
    } else if (!regexSenha.test(senha)) {
      erros.push("Senha inválida");
    }

		if (listaPermissoes && !Array.isArray(listaPermissoes)){
			erros.push("Lista de permissões é inválida")
		}

    if (erros.length > 0) {
      throw erros.join(", ");
    }
  }

	criptografarSenha(senha) {
		const salt = bcrypt.genSaltSync(6)

		this.senha = bcrypt.hashSync(senha, salt)
	}

  constructor(dadosUsuario) {
    try {
			this.validarUsuario(dadosUsuario)

      this.nome = dadosUsuario.nome;
      this.email = dadosUsuario.email;
      this.listaPermissoes = dadosUsuario.listaPermissoes || [];
      this.ativo = new Boolean(dadosUsuario.ativo) || false;

      this.dataCriacao = new Date();
      this.dataLogin = null;

			this.criptografarSenha(dadosUsuario.senha)
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  Usuario,
};
