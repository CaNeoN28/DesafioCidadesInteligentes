const bcrypt = require("bcrypt");

class Usuario {
  validarObrigatorio(dadosUsuario) {
    const erros = [];
    const { nome, email, senha } = dadosUsuario;

    if (!nome) {
      erros.push("Nome é obrigatório");
    }

    if (!email) {
      erros.push("Email é obrigatório");
    }

    if (!senha) {
      erros.push("Senha é obrigatória");
    }

    if (erros.length > 0) {
      return erros;
    }
  }

  static validarEmail(email) {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    return regexEmail.test(email);
  }

  static validarSenha(senha) {
    const regexSenha =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/g;

    return regexSenha.test(senha);
  }

  validarUsuario(dadosUsuario) {
    const obrigatorios = this.validarObrigatorio(dadosUsuario);

    const erros = [];

    const { email, senha, listaPermissoes } = dadosUsuario;

    if (!Usuario.validarEmail(email)) {
      erros.push("Email inválido");
    }

    if (!Usuario.validarSenha(senha)) {
      erros.push("Senha inválida");
    }

    if (listaPermissoes && !Array.isArray(listaPermissoes)) {
      erros.push("Lista de permissões é inválida");
    }

    if (erros.length > 0) {
      throw erros.concat(obrigatorios).join(", ");
    }
  }

  criptografarSenha(senha) {
    const salt = bcrypt.genSaltSync(6);

    this.senha = bcrypt.hashSync(senha, salt);
  }

  constructor(dadosUsuario) {
    try {
      this.validarUsuario(dadosUsuario || {});

      this.nome = dadosUsuario.nome;
      this.email = dadosUsuario.email;
      this.listaPermissoes = dadosUsuario.listaPermissoes || [];
      this.ativo = Boolean(dadosUsuario.ativo) || false;

      this.dataCriacao = new Date();
      this.dataLogin = null;

      this.criptografarSenha(dadosUsuario.senha);
    } catch (error) {
      throw error;
    }
  }
}

class GerenciamentoUsuarios {
  usuarios = [];

  criarUsuario(dadosUsuario) {
    try {
      const usuario = new Usuario(dadosUsuario);

      this.usuarios.push(usuario);
    } catch {
      return "Não foi possível cadastrar o usuário";
    }
  }

  alterarUsuario(indice, dadosUsuario) {
    const { nome, email, senha, listaPermissoes, ativo } = dadosUsuario;

    const erros = [];

    const usuario = this.usuarios[indice];

    if (usuario) {
      if (nome) usuario.nome = nome;

      if (ativo) usuario.ativo = ativo;

      if (email && !Usuario.validarEmail(email)) {
        erros.push("Email inválido");
      } else if (email) {
        usuario.email = email;
      }

      if (listaPermissoes && !Array.isArray(listaPermissoes)) {
        erros.push("Lista de permissões inválida");
      }

      if (senha && !Usuario.validarSenha(senha)) {
        erros.push("Senha inválida");
      } else if (senha) {
        const usuario = new Usuario({ ...usuario, ...dadosUsuario });
      }
    } else {
      erros.push("Usuário não encontrado");
    }

    if (erros.length > 0) {
      return `Não foi possível atualizar o usuário: ${erros.join(", ")}`;
    }

    this.usuarios[indice] = usuario;
  }

  alterarAtivo(indice) {
    const usuario = this.usuarios[indice];

    if (usuario) {
			this.usuarios = {...usuario, ativo: !usuario.ativo}
    } else {
			return "Não foi possível encontrar o usuário"
		}
  }
	
  excluirUsuario() {}
  listarUsuarios() {}
}

module.exports = {
  Usuario,
  GerenciamentoUsuarios,
};
