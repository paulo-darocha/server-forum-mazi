import { Resposta } from "../repo/Resposta";
import { Topico } from "../repo/Topico";
import { Usuario } from "../repo/Usuario";
import { textoValido } from "../validador/TopicoValidador";
import { UmaResposta } from "./TiposRespostas";


export const criarResposta = async (
  usuarioId: string | undefined | null,
  topicoId: string,
  texto: string
): Promise<UmaResposta<Resposta>> => {

  const msg = textoValido(texto);
  if (msg) {
    return { aviso: msg };
  }

  if (!usuarioId) {
    return { aviso: "Faça login para postar respostas." };
  }

  const usuario = await Usuario.findOne({ id: usuarioId });
  if (!usuario) {
    return { aviso: "Usuário não encontrado" }
  }

  const topico = await Topico.findOne({ id: topicoId });
  if (!topico) {
    return { aviso: "Tópico não encontrado" }
  }

  const novaResposta = await Resposta.create({
    texto, usuario, topico
  }).save();
  if (!novaResposta) {
    return { aviso: "Falha ao criar Resposta." }
  }

  return { aviso: `${novaResposta.id}.` }

};