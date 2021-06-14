import { Categoria } from "../repo/Categoria";
import CategoriaTopico from "../repo/CategoriaTopico";
import { Topico } from "../repo/Topico";

export const getTopCategoriaTopico = async (): Promise<
  Array<CategoriaTopico>
> => {

  const categorias = await Categoria.createQueryBuilder("categoria")
    .leftJoinAndSelect("categoria.topicos", "topico")
    .getMany();

  const topicosCategoria: Array<CategoriaTopico> = [];
  categorias.sort((a: Categoria, b: Categoria) => {
    if (a.topicos.length > b.topicos.length) return -1;
    if (a.topicos.length < b.topicos.length) return 1;
    return 0;
  });

  const topCategorias = categorias.slice(0, 3);

  topCategorias.forEach((cat) => {
    cat.topicos.sort((a: Topico, b: Topico) => {
      if (a.criadoEm > b.criadoEm) return -1;
      if (a.criadoEm < b.criadoEm) return 1;
      return 0;
    });
    cat.topicos.forEach((topico) => {
      topicosCategoria.push(
        new CategoriaTopico(
          topico.id, cat.id, cat.nome, topico.titulo, topico.criadoEm)
      );
    });
  });
  return topicosCategoria
};