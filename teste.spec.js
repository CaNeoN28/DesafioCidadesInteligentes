const { describe, expect, test } = require("@jest/globals");
const {
  Usuario,
  GerenciamentoUsuarios,
  Autenticacao,
} = require("./desafio.js");
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
    expect(gerenciamento.criarUsuario({})).toContain(
      "Não foi possível cadastrar o usuário"
    );
  });

  test("deve retornar erro ao cadastrar usuário com email existente", () => {
    const resposta = gerenciamento.criarUsuario(dadosUsuario);

    expect(resposta).toContain("Email já utilizado");
  });

  test("deve alterar um usuário no indice", () => {
    const resposta = gerenciamento.alterarUsuario(0, {
      nome: "Carlos Felipe Steinheuser",
    });

    console.log(resposta);

    expect(gerenciamento.usuarios[0].nome).toBe("Carlos Felipe Steinheuser");
  });

  test("deve retornar erro ao alterar email do usuário para um email já existente", () => {
    const resposta = gerenciamento.criarUsuario(dadosUsuario);

    expect(resposta).toContain("Email já utilizado");
  });

  test("deve retornar erro ao substituir por um dado inválido", () => {
    const resposta = gerenciamento.alterarUsuario(0, { senha: "12345678" });

    expect(resposta).toContain("Senha inválida");
  });

  test("deve retornar erro ao não encontrar o usuario ao alterar seus dados", () => {
    const resposta = gerenciamento.alterarUsuario(2, { nome: "Carlos" });

    expect(resposta).toContain("Usuário não encontrado");
  });

  test("deve alterar o ativo de um usuário", () => {
    gerenciamento.alterarAtivo(0);

    expect(gerenciamento.usuarios[0].ativo).toBe(false);
  });

  test("deve retornar erro ao não encontrar o usuário ao alterar ativo", () => {
    const resposta = gerenciamento.alterarAtivo(2);

    expect(resposta).toBe("Não foi possível encontrar o usuário");
  });

  test("deve retornar uma lista de usuários", () => {
    const resposta = gerenciamento.listarUsuarios();

    console.log(resposta);

    expect(Array.isArray(resposta)).toBe(true);
  });

  test("deve excluir um usuário", () => {
    gerenciamento.excluirUsuario(0);

    expect(gerenciamento.usuarios[0]).toBe(undefined);
  });

  test("deve retornar erro ao não encontrar um usuário para excluir", () => {
    const resposta = gerenciamento.excluirUsuario(0);

    expect(resposta).toBe("Não foi possível encontrar o usuário para excluir");
  });
});

describe("Autenticação de usuários", () => {
  const gerenciamento = new GerenciamentoUsuarios();

  test("deve criar um usuário e fazer login com ele", () => {
    gerenciamento.criarUsuario(dadosUsuario);

    const resposta = gerenciamento.fazerLogin(
      dadosUsuario.email,
      dadosUsuario.senha
    );

    expect(resposta).toBe("Usuário autenticado com sucesso");
    expect(gerenciamento.emailAutenticado).toBe(dadosUsuario.email);
    expect(gerenciamento.usuarios[0].dataLogin).not.toBe(null);
  });

  test("deve retornar erro ao omitir os dados", () => {
    const resposta = gerenciamento.fazerLogin();

    expect(resposta).toBe("Email e senha são obrigatórios");
  });

  test("deve retornar erro de dados inválidos", () => {
    const resposta = gerenciamento.fazerLogin("carlosfelipe", "12345678");

    expect(resposta).toBe("Verifique seus dados e tente novamente");
  });

  test("deve realizar o logout do usuário", () => {
    gerenciamento.fazerLogout();

    expect(gerenciamento.emailAutenticado).toBe(null);
  });
});
