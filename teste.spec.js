const { describe, expect, test } = require("@jest/globals");
const { Usuario } = require("./desafio.js");

describe("Criação do usuário", () => {
  test("deve instanciar um usuário com os atributos corretos", () => {
    const usuario = new Usuario(
      "Carlos Felipe",
      "carlosfelipe.st28@gmail.com",
      "1234Asdf$",
      [],
      true
    );

    expect(usuario.nome).toBe("Carlos Felipe");
    expect(usuario.email).toBe("carlosfelipe.st28@gmail.com");
    expect(usuario.listaPermissoes).toEqual([]);
    expect(usuario.ativo).toEqual(new Boolean(true));
  });

	test("deve dar erro de atributos inválidos", () => {
		const criarUsuarioErrado = () => {
			const usuario = new Usuario()
		}

		expect(criarUsuarioErrado).toThrowError("Nome é obrigatório, Email é obrigatório, Senha é obrigatória")
	})

});
