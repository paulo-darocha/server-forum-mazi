import { getManager } from "typeorm";
import { PontoResposta } from "../repo/PontoResposta";
import { Resposta } from "../repo/Resposta";
import { Usuario } from "../repo/Usuario";

export const atualizaRespostaPonto = async (
  usuarioId: string,
  respostaId: string,
  somaUm: boolean
): Promise<string> => {
  if (!usuarioId || usuarioId === "0") {
    return "Usuário não autenticado";
  }

  let aviso = "Falha ao incrementar pontuação da resposta";

  const resposta = await Resposta.findOne({
    where: { id: respostaId },
    relations: ["usuario"]
  });

  if (resposta?.usuario.id === usuarioId) {
    return "Usuário não pode incrementar sua própria postagem";
  }

  const usuario = await Usuario.findOne({ where: { id: usuarioId } });

  const pontoExistente = await PontoResposta.findOne({
    where: {
      resposta: { id: respostaId },
      usuario: { id: usuarioId }
    },
    relations: ["resposta"]
  })

  await getManager().transaction(
    async (transactionEntityManager) => {

      if (pontoExistente) {
        if (somaUm) {
          if (pontoExistente.subtraiUm) {
            await PontoResposta.remove(pontoExistente);
            resposta!.pontos = Number(resposta!.pontos) + 1;
            resposta!.modificadoEm = new Date();
            resposta!.save();
          }
        } else {
          if (!pontoExistente.subtraiUm) {
            await PontoResposta.remove(pontoExistente);
            resposta!.pontos = Number(resposta!.pontos) - 1;
            resposta!.modificadoEm = new Date();
            resposta!.save();
          }
        }
      } else {
        await PontoResposta.create({
          subtraiUm: !somaUm,
          usuario,
          resposta
        }).save();
        if (somaUm) {
          resposta!.pontos = Number(resposta!.pontos) + 1;
        } else {
          resposta!.pontos = Number(resposta!.pontos) - 1;
        }
        resposta!.modificadoEm = new Date();
        await resposta!.save();
      }
      aviso = `Pontuação ${somaUm ? "adicionada" : "removida"} com sucesso.`;
    }
  );
  return aviso;
};