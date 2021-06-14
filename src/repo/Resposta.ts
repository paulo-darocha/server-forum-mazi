import { Length } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntidadeBase } from "./EntidadeBase";
import { PontoResposta } from "./PontoResposta";
import { Topico } from "./Topico";
import { Usuario } from "./Usuario";

@Entity({ name: "Respostas" })
export class Resposta extends EntidadeBase {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("int", { name: "Views", default: 0, nullable: false })
  views: number;

  @Column("int", { name: "Pontos", default: 0, nullable: false })
  pontos: number;

  @Column("boolean", { name: "Desativado", default: false, nullable: false })
  desativado: boolean;

  @Column("varchar", { name: "Texto", length: 3000, nullable: false })
  @Length(10, 3000)
  texto: string;

  @ManyToOne(() => Usuario, usuario => usuario.respostas)
  usuario: Usuario;

  @ManyToOne(() => Topico, topico => topico.respostas)
  topico: Topico

  @OneToMany(() => PontoResposta, pontosResposta => pontosResposta.resposta)
  pontosResposta: [PontoResposta]
}