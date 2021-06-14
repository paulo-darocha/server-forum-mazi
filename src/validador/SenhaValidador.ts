export interface TesteSenhaResultado {
  mensagem: string;
  valida: boolean;
}

export const senhaValida = (senha: string): TesteSenhaResultado => {
  const testeSenhaResultado: TesteSenhaResultado = {
    mensagem: "",
    valida: true
  };

  if (senha.length < 8) {
    testeSenhaResultado.mensagem = "Senha precisa ter no mínimo 8 caracteres";
    testeSenhaResultado.valida = false;
    return testeSenhaResultado;
  }

  const senhaSegura = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (!senhaSegura.test(senha)) {
    testeSenhaResultado.mensagem =
      "Senha precisa ter pelo menos 1 caractere especial, 1 letra maiúscula e 1 número";
    testeSenhaResultado.valida = false;
  }

  return testeSenhaResultado;
}
