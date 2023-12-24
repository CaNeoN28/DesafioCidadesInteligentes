class Usuario {
  validarUsuario(dadosUsuario) {
		const {nome, email, senha, listaPermissoes} = dadosUsuario

    const erros = [];
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexSenha =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/g;

		if (nome == undefined){
			erros.push("Nome é obrigatório")
		}

    if (email == undefined) {
      erros.push("Email é obrigatório");
    } else if (!regexEmail.test(email)) {
      erros.push("Email inválido");
    }

    if (senha == undefined) {
      erros.push("Senha é obrigatória");
    } else if (!regexSenha.test(senha)) {
			console.log(senha)
      erros.push("Senha inválida");
    }

		if (listaPermissoes && !Array.isArray(listaPermissoes)){
			erros.push("Lista de permissões é inválida")
		}

    if (erros.length > 0) {
      throw erros.join(", ");
    }
  }

  constructor(nome, email, senha, listaPermissoes, ativo) {
    try {
			this.validarUsuario({nome, email, senha, listaPermissoes})

      this.nome = nome;
      this.email = email;
      this.senha = senha;
      this.listaPermissoes = listaPermissoes || [];
      this.ativo = new Boolean(ativo) || false;

      this.dataCriacao = new Date();
      this.dataLogin = null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  Usuario,
};
