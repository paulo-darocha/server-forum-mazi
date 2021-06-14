import { Length } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Resposta } from "./Resposta";
import { Topico } from "./Topico";
import { PontoTopico } from "./PontoTopico";
import { PontoResposta } from "./PontoResposta";
import { EntidadeBase } from "./EntidadeBase";

@Entity({ name: "Usuarios" })
export class Usuario extends EntidadeBase {

  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("varchar", { name: "Email", length: 120, unique: true, nullable: false })
  email: string;

  @Column("varchar", { name: "Usuario", length: 60, unique: true, nullable: false })
  usuario: string;

  @Column("varchar", { name: "Senha", length: 100, nullable: false })
  @Length(8, 100)
  senha: string;

  @Column("boolean", { name: "Validado", default: true, nullable: false })
  validado: boolean;

  @Column("boolean", { name: "Desativado", default: false, nullable: false })
  desativado: boolean;

  @OneToMany(() => Topico, topicos => topicos.usuario)
  topicos: [Topico];

  @OneToMany(() => Resposta, respostas => respostas.usuario)
  respostas: [Resposta]

  @OneToMany(() => PontoTopico, pontosTopico => pontosTopico.usuario)
  pontosTopico: [PontoTopico];

  @OneToMany(() => PontoResposta, pontosResposta => pontosResposta.usuario)
  pontosResposta: [PontoResposta];

  @Column("varchar", {name: "ImgUrl", unique: true, nullable: true})
  imgUrl: string;
}