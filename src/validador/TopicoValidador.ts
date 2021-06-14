export const tituloValido = (titulo: string) => {
  return stringValida("Título", titulo, 5, 150);
}

export const textoValido = (texto: string) => {
  return stringValida("Texto", texto, 10, 3000)
}

export const stringValida = (
  rotulo: string,
  texto: string,
  min: number,
  max: number
) => {
  if (!texto) return `${rotulo} não pode estar em branco.`;
  if (texto.length < min) {
    return `${rotulo} precisa ter no mínimo ${min} letras`;
  }
  if (texto.length > max) {
    return `${rotulo} pode ter no máximo ${max} letras`;
  }
  return "";
};