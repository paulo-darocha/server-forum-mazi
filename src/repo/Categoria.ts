import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntidadeBase } from "./EntidadeBase";
import { Topico } from "./Topico";

@Entity({ name: "Categorias" })
export class Categoria extends EntidadeBase {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;

  @Column("varchar", { name: "Nome", length: 100, unique: true, nullable: false})
  nome: string;

  @Column("varchar", { name: "Resenha", length: 150, nullable: true })
  resenha: string;

  @OneToMany(() => Topico, topicos => topicos.categoria)
  topicos: [Topico];
}