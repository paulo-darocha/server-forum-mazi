export default class CategoriaTopico {

  constructor(
    public topicoId: string,
    public categoriaId: string,
    public categoriaNome: string,
    public titulo: string,
    public tituloCriadoEm: Date
  ) {}
  
}