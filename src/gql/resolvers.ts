import { IResolvers } from "apollo-server-express";
import { Categoria } from "../repo/Categoria";
import CategoriaTopico from "../repo/CategoriaTopico";
import { Resposta } from "../repo/Resposta";
import { Topico } from "../repo/Topico";
import { Usuario } from "../repo/Usuario";
import { getCategorias } from "../repoFunctions/CategoriaRepo";
import { getTopCategoriaTopico } from "../repoFunctions/CategoriaTopicoRepo";
import { atualizaRespostaPonto } from "../repoFunctions/PontoRespostaRepo";
import { atualizarPontoTopico } from "../repoFunctions/PontoTopicoRepo";
import { criarResposta } from "../repoFunctions/RespostaRepo";
import { ArrayRespostas, UmaResposta } from "../repoFunctions/TiposRespostas";
import { criarTopico, getTopicoPorId, getTopicosPorCategoria, getTopicosRecentes } from "../repoFunctions/topicoRepo";
import { alterarSenha, apagaUsuario, getUsuariosAtivos, login, logout, perfil, registro, RespostaUsuario } from "../repoFunctions/UsuarioRepo";
import { GqlContext } from "./GqlContext";

const ERRO = "Ocorreu um erro. Por favor tente novamente";

interface Msg {
  aviso?: string;
}

const resolvers: IResolvers = {

  TopicoOuMsg: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.aviso) {
        return "Msg"
      }
      return "Topico";
    }
  },

  TopicoArrayOuMsg: {
    __resolveType(obj: any, ctx: GqlContext, info: any) {
      if (obj.aviso) {
        return "Msg"
      }
      return "TopicoArray"
    }
  },

  UsuarioOuMsg: {
    __resolveType(obj: any, ctx: GqlContext, info: any) {
      if (obj.aviso) {
        return "Msg"
      }
      return "Usuario"
    }
  },

  UsuarioArrayOuMsg: {
    __resolveType(obj: any, ctx: GqlContext, info: any) {
      if (obj.aviso) {
        return "Msg"
      }
      return "UsuarioArray"
    }
  },

  Query: {
    getTopicoPorId: async (
      obj: any,
      args: { id: string },
      ctx: GqlContext,
      info: any
    ): Promise<Topico | Msg> => {
      let topico: UmaResposta<Topico>;
      try {
        topico = await getTopicoPorId(args.id);
        if (topico.resultado) {
          return topico.resultado;
        }
        return topico;
      } catch (ex) {
        throw ex;
      }
    },

    getTopicosPorCategoria: async (
      obj: any,
      args: { categoriaId: string },
      ctx: GqlContext,
      info: any
    ): Promise<{ topicos: Array<Topico> } | Msg> => {
      let resposta: ArrayRespostas<Topico>;
      try {
        resposta = await getTopicosPorCategoria(args.categoriaId);
        if (resposta.resultados) {
          return {
            topicos: resposta.resultados
          };
        }
        return {
          aviso: resposta.aviso ? resposta.aviso
            : "Ocorreu um erro ao buscar os tópicos."
        }
      } catch (ex) {
        throw ex;
      }
    },

    perfil: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Usuario | Msg> => {
      let resposta: RespostaUsuario;
      try {
        if (!ctx.req.session?.userid) {
          return {
            aviso: "Usuário não conectado"
          };
        }
        resposta = await perfil(ctx.req.session.userid);
        if (resposta && resposta.usuario) {
          return resposta.usuario;
        }
        return {
          aviso: resposta.aviso ? resposta.aviso : ERRO
        }
      } catch (ex) {
        throw ex;
      }
    },

    getCategorias: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<Categoria> | Msg> => {
      let categorias: ArrayRespostas<Categoria>;
      try {
        categorias = await getCategorias();
        if (categorias.resultados) {
          return categorias.resultados;
        }
        return {
          aviso: categorias.aviso ? categorias.aviso : ERRO
        }
      } catch (ex) {
        throw ex;
      }
    },

    getTopicosRecentes: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<{ topicos: Array<Topico> } | Msg> => {
      let resposta: ArrayRespostas<Topico>;
      try {
        resposta = await getTopicosRecentes();
        if (resposta.resultados) {
          return {
            topicos: resposta.resultados
          }
        }
        return {
          aviso: resposta.aviso ? resposta.aviso : ERRO
        }
      } catch (ex) {
        throw ex;
      }
    },

    getTopCategoriaTopico: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<CategoriaTopico>> => {
      try {
        return await getTopCategoriaTopico();
      } catch (ex) {
        throw ex;
      }
    },

    getUsuariosAtivos: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<{usuarios: Array<Usuario>} | Msg> => {
      let respostas: ArrayRespostas<Usuario>;
      try {
        respostas = await getUsuariosAtivos();
        if (respostas.resultados) {
          return {
            usuarios: respostas.resultados
          }
        }
        return {
          aviso: respostas.aviso ?? ERRO
        }
      } catch (ex) {
        throw (ex);
      }
    },

  },



  Mutation: {
    criarTopico: async (
      obj: any,
      args: {
        usuarioId: string,
        categoriaId: string,
        titulo: string,
        texto: string
      },
      ctx: GqlContext,
      info: any
    ): Promise<Msg> => {
      try {
        let resposta: UmaResposta<Topico>;
        resposta = await criarTopico(
          args.usuarioId, args.categoriaId, args.titulo, args.texto
        );
        return {
          aviso: resposta.aviso ? resposta.aviso :
            "Ocorreu um erro ao criar o tópico"
        };
      } catch (ex) {
        throw ex;
      }
    },

    atualizarPontoTopico: async (
      obj: any,
      args: { topicoId: string, somaUm: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let resposta = "";
      try {
        if (!ctx.req.session || !ctx.req.session?.userid) {
          return "Para curtir um tópico é necessário efetuar login";
        }
        resposta = await atualizarPontoTopico(
          ctx.req.session!.userid, args.topicoId, args.somaUm
        );
        return resposta;
      } catch (ex) {
        throw ex;
      }
    },

    registro: async (
      obj: any,
      args: { email: string, usuario: string, senha: string },
      ctx: GqlContext,
      info: any
    ): Promise<Usuario | Msg> => {
      let resposta: RespostaUsuario;
      try {
        resposta = await registro(
          args.email, args.usuario, args.senha
        );
        if (resposta && resposta.usuario) {
          return resposta.usuario;
        }
        return {
          aviso: resposta.aviso ? resposta.aviso : ERRO
        };
      } catch (ex) {
        throw ex;
      }
    },

    login: async (
      obj: any,
      args: { usuario: string, senha: string },
      ctx: GqlContext,
      info: any
    ): Promise<Usuario | Msg> => {
      let resposta: RespostaUsuario;
      try {
        resposta = await login(args.usuario, args.senha);
        if (resposta && resposta.usuario) {
          ctx.req.session.userid = resposta.usuario.id;
          return resposta.usuario;
        }
        return {
          aviso: resposta.aviso
        }
      } catch (ex) {
        throw ex;
      }
    },

    logout: async (
      obj: any,
      args: { usuario: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        let resposta = logout(args.usuario);
        ctx.req.session.destroy((erro) => {
          if (erro) {
            console.log("falha ao encerrar sessão")
            return;
          }
          console.log("Sessão encerrada com sucesso.",
            ctx.req.session?.userid);
        });

        return resposta;
      } catch (ex) {
        throw ex;
      }

    },

    alterarSenha: async (
      obj: any,
      args: { novaSenha: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        if (!ctx.req.session || !ctx.req.session.userid) {
          return "Faça login para alterar a senha."
        }
        const resposta = await alterarSenha(
          ctx.req.session!.userid, args.novaSenha);
        return resposta;
      } catch (ex) {
        throw ex;
      }
    },

    atualizaRespostaPonto: async (
      obj: any,
      args: { respostaId: string, somaUm: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let resposta = "";
      try {
        if (!ctx.req.session || !ctx.req.session?.userid) {
          return "Faça login para atulizar pontuação.";
        }
        resposta = await atualizaRespostaPonto(
          ctx.req.session.userid, args.respostaId, args.somaUm
        );
        return resposta;
      } catch (ex) {
        throw ex;
      }
    },

    criarResposta: async (
      obj: any,
      args: { usuarioId: string, topicoId: string, texto: string },
      ctx: GqlContext,
      info: any
    ): Promise<Msg> => {
      let resultado: UmaResposta<Resposta>;
      try {
        resultado = await criarResposta(args.usuarioId, args.topicoId, args.texto);
        return {
          aviso: resultado.aviso ?? ERRO
        }
      } catch (ex) {
        throw ex;
      }
    },

    apagaUsuario: async (
      obj: any,
      args: { usuarioId: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let resultado = "";
      try {
        resultado = await apagaUsuario(args.usuarioId);
        return resultado;
      } catch (ex) {
        throw ex;
      }
    },

  },

}

export default resolvers;