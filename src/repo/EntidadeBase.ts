import { BaseEntity, Column } from "typeorm";

export class EntidadeBase extends BaseEntity {
  @Column("varchar", {
    name: "CriadoPor",
    length: 60,
    default: "Criador",
    nullable: false,
  })
  criadoPor: string;

  @Column("timestamp with time zone" ,{
    name: "CriadoEm",
    default: `() = now()`,
    nullable: false,
  })
  criadoEm: Date;

  @Column("varchar", {
    name: "ModificadoPor",
    length: 60,
    default: "Modificador",
    nullable: false
  })
  modificadoPor: string;

  @Column("timestamp with time zone", {
    name: "ModificadoEm",
    default: `() => now()`,
    nullable: false,
  })
  modificadoEm: Date;
}