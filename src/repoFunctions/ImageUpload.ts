import { Usuario } from "../repo/Usuario";
import { UmaResposta } from "../repoFunctions/TiposRespostas";
const fs = require("fs");

export const salvaImgUsuario = async (
  usuarioId: string,
  imgUrl: any
): Promise<string> => {

  const usuario = await Usuario.findOne({ id: usuarioId });
  if (!usuario) { return "Usuário não encontrado" }

  if (usuario.imgUrl) {
    let caminho = `${usuario.imgUrl.substring(7, 39)}`;
    caminho = "./upload/" + caminho;
    fs.unlink(caminho, (erro: any) => {
      console.log("ERRO AO UNLINK", erro);
      return 
    })
  }

  if (usuario) {
    usuario.imgUrl = imgUrl;
    await usuario.save();
  }

  return "Logo do usuário atualizado com sucesso";
};

export const recuperaImg = async (
  usuarioId: string
): Promise<UmaResposta<Usuario>> => {
  const usuario = await Usuario.findOne({ id: usuarioId });
  
  if (!usuario) {
    return { aviso: "Usuário não encontrado" };
  }
  if (!usuario.imgUrl) {
    return { aviso: "Usuário não cadastrou imagem" }
  }

  return {
    resultado: usuario
  }
};
