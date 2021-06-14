import { Usuario } from "../repo/Usuario";
import { emailValido } from "../validador/EmailValidador";
import { senhaValida } from "../validador/SenhaValidador";
import bcrypt from "bcryptjs";
import { ArrayRespostas } from "./TiposRespostas";

const saltRounds = 10;

const usuarioNotFound = (usuario: string) => {
  return `Usuário ${usuario} não encontrado`;
}

export class RespostaUsuario {
  constructor(
    public aviso?: string,
    public usuario?: Usuario
  ) { }
}

export const registro = async (
  email: string,
  usuario: string,
  senha: string
): Promise<RespostaUsuario> => {

  let candidato = await Usuario.findOne({ usuario: usuario });
  if (candidato?.usuario === usuario) {
    return {
      aviso: "Nome de usuário já registrado"
    };
  }
  candidato = await Usuario.findOne({ email: email });
  if (candidato?.email === email) {
    return {
      aviso: "Email já registrado"
    };
  }

  const resultado = senhaValida(senha);
  if (!resultado.valida) {
    return {
      aviso: resultado.mensagem
    };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailaviso = emailValido(trimmedEmail);
  if (emailaviso) {
    return {
      aviso: emailaviso
    }
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedSenha = await bcrypt.hash(senha, salt);

  const novoUsuario = await Usuario.create({
    email: trimmedEmail,
    usuario,
    senha: hashedSenha,
  }).save();
  console.log("REGISTRO.novoUsuario", novoUsuario);

  novoUsuario.senha = "";

  return {
    usuario: novoUsuario
  }
}


export const login = async (
  usuario: string,
  senha: string
): Promise<RespostaUsuario> => {
  const candidato = await Usuario.findOne({ where: { usuario } });

  if (!candidato) {
    return {
      aviso: usuarioNotFound(usuario)
    };
  }

  if (!candidato?.validado) {
    return {
      aviso: "Usuário ainda não confirmou email de registro."
    };
  }

  const senhasIguais = await bcrypt.compare(senha, candidato.senha);
  if (!senhasIguais) {
    return {
      aviso: "Senha Incorreta."
    };
  }

  return {
    usuario: candidato
  };
}


export const logout = async (usuario: string): Promise<string> => {
  const candidato = await Usuario.findOne({ where: { usuario } });

  if (!candidato) {
    return usuarioNotFound(usuario);
  }

  return `Seção do Usuário ${candidato.usuario} encerrada.`
};


export const perfil = async (id: string): Promise<RespostaUsuario> => {
  const candidato = await Usuario.findOne({
    where: { id },
    relations: [
      "topicos",
      "topicos.respostas",
      "respostas",
      "respostas.topico"
    ]
  });
  console.log("PERFIL.candidato", candidato);

  if (!candidato) {
    return {
      aviso: "Usuário não encontrado."
    };
  }

  if (!candidato.validado) {
    return {
      aviso: "Usário ainda não confirmou seu registro."
    };
  }

  return {
    usuario: candidato
  };

};


export const alterarSenha = async (
  id: string, novaSenha: string
): Promise<string> => {
  const candidato = await Usuario.findOne({ where: { id } });

  if (!candidato) {
    return "Usuário não encontrado";
  }
  if (!candidato.validado) {
    return "Usuário não confirmou cadastro ainda."
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedSenha = await bcrypt.hash(novaSenha, salt);
  candidato.senha = hashedSenha;
  candidato.save();
  return "Senha alterada com sucesso.";
};

export const apagaUsuario = async (usuarioId: string): Promise<string> => {
  const candidato = await Usuario.findOne({
    where: { id: usuarioId }
  });

  if (!candidato) {
    return "Usuario não encontrado";
  }

  await Usuario.remove(candidato);
  return "Usuário removido com sucesso"
};


export const getUsuariosAtivos = async (): Promise<ArrayRespostas<Usuario>> => {
  const usuarios = await Usuario.createQueryBuilder("busca")
    .leftJoinAndSelect("busca.topicos", "topicos")
    .orderBy("busca.criadoEm", "DESC")
    .take(30)
    .getMany()

  if (!usuarios) {
    return {aviso: "Nenhum usuário encontrado."}
  }

  if (usuarios) {
    console.log("USUÁRIOS", usuarios)
  }

  return {
    resultados: usuarios
  }
};