import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  type Msg { aviso: String }
  type TopicoArray {topicos: [Topico!]}
  type UsuarioArray {usuarios: [Usuario!]}
  union TopicoOuMsg = Topico | Msg
  union TopicoArrayOuMsg = TopicoArray | Msg
  union UsuarioOuMsg = Usuario | Msg
  union UsuarioArrayOuMsg = UsuarioArray | Msg
  
  type Usuario {
    id: ID!
    email: String!
    usuario: String!
    senha: String!
    validado: Boolean!
    desativado: Boolean!
    topicos: [Topico!]
    respostas: [Resposta!]
    criadoPor: String!
    criadoEm: Date!
    modificadoPor: String!
    modificadoEm: Date!
    imgUrl: String
  }

  type Topico {
    id: ID!
    views: Int!
    pontos: Int!
    desativado: Boolean!
    titulo: String!
    texto: String!
    usuario: Usuario!
    respostas: [Resposta!]
    categoria: Categoria
    criadoPor: String!
    criadoEm: Date!
    modificadoPor: String!
    modificadoEm: Date!
  }

  type Resposta {
    id: ID!
    views: Int!
    pontos: Int!
    desativado: Boolean!
    texto: String!
    usuario: Usuario!
    topico: Topico!
    criadoPor: String!
    criadoEm: Date!
    modificadoPor: String!
    modificadoEm: Date!
  }

  type Categoria {
    id: ID!
    nome: String!
    resenha: String!
    topicos: [Topico!]!
    criadoPor: String!
    criadoEm: Date!
    modificadoPor: String!
    modificadoEm: Date!
  }

  type CategoriaTopico {
    topicoId: ID!
    categoriaId: ID!
    categoriaNome: String!
    titulo: String!
    tituloCriadoEm: Date!
  }

  type Query {
    getTopicoPorId(id: ID!): TopicoOuMsg
    getTopicosPorCategoria(categoriaId: ID!): TopicoArrayOuMsg!
    perfil: UsuarioOuMsg!
    getCategorias: [Categoria!]
    getTopicosRecentes: TopicoArrayOuMsg!
    getTopCategoriaTopico: [CategoriaTopico!]
    getUsuariosAtivos: UsuarioArrayOuMsg!
  }

  type Mutation {
    criarTopico(usuarioId: ID!, categoriaId: ID!, titulo: String!, texto: String!): Msg
    atualizarPontoTopico(topicoId: ID!, somaUm: Boolean!): String!
    registro(email: String!, usuario: String!, senha: String!): UsuarioOuMsg!
    login(usuario: String!, senha: String!): UsuarioOuMsg!
    logout(usuario: String!): String!
    alterarSenha(novaSenha: String!): String!
    atualizaRespostaPonto(respostaId: ID!, somaUm: Boolean!): String!
    criarResposta(usuarioId: ID!, topicoId: ID!, texto: String!): Msg
    apagaUsuario (usuarioId: ID!): String!
  }

`

export default typeDefs;