import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
// import bodyParser from "body-parser";

import cors from "cors";
import { createConnection } from "typeorm";
import { login, logout, registro } from "./repoFunctions/UsuarioRepo";
import { criarTopico, getTopicosPorCategoria } from "./repoFunctions/topicoRepo";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import typeDefs from "./gql/typeDefs";
import resolvers from "./gql/resolvers";
import { salvaImgUsuario, recuperaImg } from "./repoFunctions/ImageUpload";
import { loadEnv } from "./envLoader";
loadEnv();
// import multer from "multer";
var multer = require("multer");

declare module "express-session" {
  interface Session {
    userid: any;
    loadedCount: any;
  }
}

require("dotenv").config();


const main = async () => {

  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  )
  const router = express.Router();

  await createConnection();

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({ client: redis });

  app.use((express.json()) as any);
  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 10
      },
    } as any)
  );

  app.use(router);

  router.post("/registro", async (req, res, next) => {
    try {
      console.log("/registro(req.body)", req.body);
      const resposta = await registro(
        req.body.email,
        req.body.usuario,
        req.body.senha
      );
      if (resposta && resposta.usuario) {
        res.send(
          `novo usuário criado com sucesso. ID: ${resposta.usuario.id}`);
      } else if (resposta && resposta.aviso) {
        res.send(resposta.aviso);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      console.log("/login.params(req.body)", req.body);
      const resposta = await login(req.body.usuario, req.body.senha);
      if (resposta && resposta.usuario) {
        req.session.userid = resposta.usuario?.id
        res.send(
          `Login do usuário ${req.body.usuario}, id: ${req.session.userid}, efetuado com sucesso.`);
      } else if (resposta && resposta.aviso) {
        res.send(resposta.aviso);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      console.log("LOGOUT.params", req.body);
      const msg = await logout(req.body.usuario);
      if (msg) {
        req.session!.userid = null;
        res.send(msg);
      } else {
        next();
      }
    } catch (ex) { }
  });

  router.post("/criartopico", async (req, res, next) => {
    try {
      const resposta = await criarTopico(
        req.session!.userid,
        req.body.categoriaId,
        req.body.titulo,
        req.body.texto
      );
      res.send(resposta);
    } catch (ex) {
      console.log(ex.message);
      res.send(ex.message);
    }
  });

  router.post("/topicosporcategoria", async (req, res, next) => {
    try {
      const resposta = await getTopicosPorCategoria(req.body.categoriaId);
      if (resposta && resposta.resultados) {
        let itens = "";
        resposta.resultados.forEach((top) => {
          itens += top.titulo + ", "
        });
        res.send(itens);
      } else if (resposta && resposta.aviso) {
        res.send(resposta.aviso);
      }
    } catch (ex) { }
  });

  var upload = multer({dest: "upload/"});
  router.post("/upload", upload.single("imagem") , async (req, res, next) => {
    // console.log("UPLOAD.REQ.BODY.ID", req.query.id);
    console.log("UPLOAD.REQ.BODY.ID", req.body.usid);
    try {
      let resultado = await salvaImgUsuario(
        req.body.usid, req.file.path);
      res.send(resultado);
      
    } catch (ex) {
      throw ex;
    }
  });

  router.get("/imagem/:usid", async (req, res) => {
    try {
      console.log("IMAGE/ID", req.params.usid)
      const resposta = await recuperaImg(req.params.usid);
      if (resposta.aviso) {
        res.send(null)
      }
      if (resposta.resultado) {
        let caminho = resposta.resultado.imgUrl;
        caminho = `${caminho.substring(7, 39)}`;
        console.log("CAMINHO", caminho);
        res.sendFile(caminho, {root: "./upload"});
      }
      if (resposta.aviso) {
        res.send(resposta.aviso);
      }
    } catch (ex) {
      throw ex;
    }
  });


  router.get("/", (req, res, next) => {
    if (!req.session!.userid) {
      req.session!.userid = req.query.userid;
      console.log("UserId is set");
      req.session!.loadedCount = 0;
    } else {
      req.session!.loadedCount = Number(req.session!.loadedCount) + 1;
    }
    res.send(
      `USER_ID: ${req.session!.userid}, LOADED_COUNT: ${req.session.loadedCount}`
    );
  });

  const schema = makeExecutableSchema({
    typeDefs, resolvers
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res })
  });
  apolloServer.applyMiddleware({ app, cors: false } as any);

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(`Server ready on port ${process.env.SERVER_PORT}${apolloServer.graphqlPath}`);
  });

}

main();