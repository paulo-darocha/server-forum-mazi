export const emailValido = (email: string) => {
  if (!email) return "Por favor preencha o campo 'email'";
  if (!email.includes("@")) {
    return "Por favor forneça um email válido";
  }
  if (/\s+/g.test(email)) {
    return "O email não pode conter espaços"
  }
  return "";
}