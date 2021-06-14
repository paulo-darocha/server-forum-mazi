import { Length } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "./Categoria";
import { EntidadeBase } from "./EntidadeBase";
import { PontoTopico } from "./PontoTopico";
import { Resposta } from "./Resposta";
import { Usuario } from "./Usuario";

@Entity({ name: "Topicos" })
export class Topico extends EntidadeBase {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("int", { name: "Views", default: 0, nullable: false })
  views: number;

  @Column("int", { name: "Pontos", default: 0, nullable: false})
  pontos: number;

  @Column("boolean", { name: "Desativado", default: false, nullable: false })
  desativado: boolean;

  @Column("varchar", { name: "Titulo", length: 150, nullable: false })
  @Length(5, 150)
  titulo: string;

  @Column("varchar", { name: "Texto", length: 3000, nullable: true})
  @Length(10, 3000)
  texto: string;

  @ManyToOne(() => Usuario, usuario => usuario.topicos)
  usuario: Usuario;

  @OneToMany(() => Resposta, respostas => respostas.topico)
  respostas: [Resposta];

  @OneToMany(() => PontoTopico, pontosTopico => pontosTopico.topico)
  pontosTopico: [PontoTopico];

  @ManyToOne(() => Categoria, categoria => categoria.topicos)
  categoria: Categoria;

}
