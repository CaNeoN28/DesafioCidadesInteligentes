const { describe, expect, test } = require("@jest/globals");
const { Usuario, GerenciamentoUsuarios } = require("./desafio.js");
const { compareSync } = require("bcrypt");

const dadosUsuario = {
  nome: "Carlos Felipe",
  email: "carlosfelipe.st28@gmail.com",
  senha: "1234Asdf$",
  listaPermissoes: [],
  ativo: true,
};

describe("Criação do usuário", () => {
  test("deve instanciar um usuário com os atributos corretos", () => {
    const usuario = new Usuario(dadosUsuario);

    expect(usuario.nome).toBe("Carlos Felipe");
    expect(usuario.email).toBe("carlosfelipe.st28@gmail.com");
    expect(usuario.listaPermissoes).toEqual([]);
    expect(usuario.ativo).toEqual(Boolean(true));
  });

  test("deve dar erro de atributos inválidos", () => {
    const criarUsuarioErrado = () => {
      const usuario = new Usuario();
    };

    expect(criarUsuarioErrado).toThrowError(
      "Nome é obrigatório, Email é obrigatório, Senha é obrigatória"
    );
  });

  test("deve dar erro de email inválido", () => {
    try {
      const usuario = new Usuario({ email: "carlosfelipe" });
    } catch (error) {
      expect(error).toContain("Email inválido");
    }
  });

  test("deve dar erro de senha inválida", () => {
    try {
      const usuario = new Usuario({ senha: "1234567" });
    } catch (error) {
      expect(error).toContain("Senha inválida");
    }
  });

  test("deve testar a criptografia da senha", () => {
    const usuario = new Usuario(dadosUsuario);

    const senhaCorreta = compareSync(dadosUsuario.senha, usuario.senha);

    expect(usuario.senha).not.toBe(dadosUsuario.senha);
    expect(senhaCorreta).toBe(true);
  });
});

describe("Gerenciamento de usuários", () => {
  const gerenciamento = new GerenciamentoUsuarios();

  test("deve criar um novo usuário", () => {
    expect(gerenciamento.usuarios.length).toBe(0);

    gerenciamento.criarUsuario(dadosUsuario);

    expect(gerenciamento.usuarios.length).toBe(1);
  });

  test("deve retornar erro ao criar usuário", () => {
    expect(gerenciamento.criarUsuario({})).toBe(
      "Não foi possível cadastrar o usuário"
    );
  });

  test("deve alterar um usuário no indice", () => {
    const resposta = gerenciamento.alterarUsuario(0, { nome: "Carlos Felipe Steinheuser" });

		expect(gerenciamento.usuarios[0].nome).toBe("Carlos Felipe Steinheuser")
  });

	test("deve retornar erro ao substituir por um dado inválido", () => {
		const resposta = gerenciamento.alterarUsuario(0, {senha: "12345678"})

		expect(resposta).toContain("Senha inválida")
	})

	test("deve retornar erro ao não encontrar o usuario ao alterar seus dados", () => {
		const resposta = gerenciamento.alterarUsuario(2, {nome: "Carlos"})

		expect(resposta).toContain("Usuário não encontrado")
	})

	test("deve alterar o ativo de um usuário", () => {
		gerenciamento.alterarAtivo(0)

		expect(gerenciamento.usuarios[0].ativo).toBe(false)
	})

	test("deve retornar erro ao não encontrar o usuário ao alterar ativo", () => {
		const resposta = gerenciamento.alterarAtivo(2)

		expect(resposta).toBe("Não foi possível encontrar o usuário")
	})
});
