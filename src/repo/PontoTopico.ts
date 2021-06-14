import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntidadeBase } from "./EntidadeBase";
import { Topico } from "./Topico";
import { Usuario } from "./Usuario";

@Entity({ name: "PontosTopico" })
export class PontoTopico extends EntidadeBase {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("boolean", { name: "SubtraiUm", default: false, nullable: false })
  subtraiUm: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.pontosTopico)
  usuario: Usuario;

  @ManyToOne(() => Topico, topico => topico.pontosTopico)
  topico: Topico;
}