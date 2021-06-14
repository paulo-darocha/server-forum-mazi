import { Categoria } from "../repo/Categoria";
import { ArrayRespostas } from "./TiposRespostas";

export const getCategorias = async (): Promise<ArrayRespostas<Categoria>> => {

  const categorias = await Categoria.find();

  if (!categorias || categorias.length === 0) {
    return {
      aviso: "Nenhuma categoria encontrada"
    }
  }
  return {
    resultados: categorias
  };
};