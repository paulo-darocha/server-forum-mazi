import { getManager } from "typeorm";
import { PontoTopico } from "../repo/PontoTopico";
import { Topico } from "../repo/Topico";
import { Usuario } from "../repo/Usuario";

export const atualizarPontoTopico = async (
  usuarioId: string,
  topicoId: string,
  somaUm: boolean
): Promise<string> => {
  if (!usuarioId || usuarioId === "0") {
    return "Usuário não autenticado";
  }

  // TODO: checar se o usuário está autenticado
  let aviso = "Falha ao adicionar ponto ao tópico";

  const topico = await Topico.findOne({
    where: { id: topicoId },
    relations: ["usuario"]
  });
  console.log("PONTO_TOPICO_REPO.topico", topico);

  if (topico?.usuario.id === usuarioId) {
    aviso = "Usuário não pode incrementar seu próprio tópico"
  }

  const usuario = await Usuario.findOne({ where: { id: usuarioId } });
  console.log("PONTO_TOPICO_REPO.candidato", usuario);

  const pontoExistente = await PontoTopico.findOne({
    where: {
      topico: { id: topicoId },
      usuario: { id: usuarioId }
    },
    relations: ["topico"]
  });
  console.log("PONTO_TOPICO_REPO.pontoExistente", pontoExistente);

  await getManager().transaction(
    async (transactionEntityManager) => {

      if (pontoExistente) {
        if (somaUm) {
          if (pontoExistente.subtraiUm) {
            await PontoTopico.remove(pontoExistente);
            topico!.pontos = Number(topico!.pontos) + 1;
            topico!.modificadoEm = new Date();
            topico!.save();
          }
        } else {
          if (!pontoExistente.subtraiUm) {
            await PontoTopico.remove(pontoExistente);
            topico!.pontos = Number(topico!.pontos) - 1;
            topico!.modificadoEm = new Date();
            topico!.save();
          }
        }
      } else {
        await PontoTopico.create({
          subtraiUm: !somaUm,
          usuario,
          topico
        }).save();
        if (somaUm) {
          topico!.pontos = Number(topico!.pontos) + 1;
        } else {
          topico!.pontos = Number(topico!.pontos) - 1;
        }
        topico!.modificadoEm = new Date();
        await topico!.save();
      }
      aviso = `Pontuação ${somaUm ? "adicionada" : "removida"} com sucesso.`;
    }
  );
  return aviso;
};