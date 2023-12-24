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
    expect(usuario.ativo).toEqual(new Boolean(true));
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

    const senhaCorreta = compareSync(dadosUsuario.senha, usuario.senha)

		expect(usuario.senha).not.toBe(dadosUsuario.senha)
		expect(senhaCorreta).toBe(true)
  });
});

describe("Gerenciamento de usuários", () => {
	const gerenciamento = new GerenciamentoUsuarios()
})