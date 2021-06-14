import { Categoria } from "../repo/Categoria";
import { Topico } from "../repo/Topico";
import { Usuario } from "../repo/Usuario";
import { textoValido, tituloValido } from "../validador/TopicoValidador";
import { ArrayRespostas, UmaResposta } from "./TiposRespostas";

export const criarTopico = async (
  usuarioId: string,
  categoriaId: string,
  titulo: string,
  texto: string
): Promise<UmaResposta<Topico>> => {

  const msgTitulo = tituloValido(titulo);
  if (msgTitulo) {
    return {
      aviso: msgTitulo
    };
  }

  const msgTexto = textoValido(texto);
  if (msgTexto) {
    return {
      aviso: msgTexto
    };
  }

  const usuario = await Usuario.findOne({ id: usuarioId });
  if (!usuario) {
    return {
      aviso: "Efetue login para postar."
    }
  }

  const categoria = await Categoria.findOne({ id: categoriaId });
  if (!categoria) {
    return {
      aviso: "Categoria não encontrada."
    }
  }

  const novoTopico = await Topico.create({
    titulo,
    texto,
    usuario,
    categoria
  }).save();

  if (!novoTopico) {
    return {
      aviso: "Falha ao criar novo Tópico."
    }
  }

  return {
    aviso: novoTopico.id
  }
};


export const getTopicoPorId = async (
  id: string
): Promise<UmaResposta<Topico>> => {

  const topico = await Topico.findOne({
    where: { id },
    relations: [
      "usuario", 
      "respostas", 
      "respostas.usuario",
      "respostas.topico",
      "categoria"
    ]
  });
  if (!topico) {
    return {
      aviso: "Tópico não encontrado."
    }
  }

  return {
    resultado: topico
  }
};


export const getTopicosPorCategoria = async (
  categoriaId: string
): Promise<ArrayRespostas<Topico>> => {

  const topicos = await Topico.createQueryBuilder("busca")
    .where(`busca."categoriaId" = :categoriaId`, { categoriaId })
    .leftJoinAndSelect("busca.categoria", "categoria")
    .leftJoinAndSelect("busca.respostas", "respostas")
    .leftJoinAndSelect("busca.usuario", "usuario")
    .orderBy("busca.criadoEm", "DESC")
    .getMany();

  if (!topicos || topicos.length === 0) {
    console.log("Não encontrado tópicos para esta categoria.");
    return {
      aviso: "Não encontrado tópicos para esta categoria."
    }
  }
  console.log(topicos);

  return {
    resultados: topicos
  }
};


export const getTopicosRecentes = async (): Promise<ArrayRespostas<Topico>> => {

  const topicos = await Topico.createQueryBuilder("busca")
    .leftJoinAndSelect("busca.categoria", "categoria")
    .leftJoinAndSelect("busca.respostas", "respostas")
    .leftJoinAndSelect("busca.usuario", "usuario")
    .orderBy("busca.criadoEm", "DESC")
    .take(10)
    .getMany();

  if (!topicos || topicos.length === 0) {
    return {
      aviso: "Nenhum tópico encontrado"
    }
  }
  return {
    resultados: topicos
  }
};

