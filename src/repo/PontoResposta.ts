import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntidadeBase } from "./EntidadeBase";
import { Resposta } from "./Resposta";
import { Usuario } from "./Usuario";

@Entity({ name: "PontosResposta" })
export class PontoResposta extends EntidadeBase {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("boolean", { name: "SubtraiUm", default: false, nullable: false })
  subtraiUm: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.pontosResposta)
  usuario: Usuario;

  @ManyToOne(() => Resposta, resposta => resposta.pontosResposta)
  resposta: Resposta
}