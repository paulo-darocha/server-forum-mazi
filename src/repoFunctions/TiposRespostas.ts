export class ArrayRespostas<T> {
  constructor (
    public aviso?: string,
    public resultados?: Array<T>
  ) {}
}

export class UmaResposta<T> {
  constructor (
    public aviso?: string,
    public resultado?: T
  ) {}
}