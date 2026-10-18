import type { RespostaLogin } from "../types/RespostaLogin";
import { API_URL } from "../utils/constantes";

export const fazerLogin = async (email: string, cpf: string, senha: string): Promise<RespostaLogin> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, cpf: cpf, senha: senha }),
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  if (resposta.status === 400) {
    throw new Error("Preencha e-mail, CPF e senha.");
  }

  if (resposta.status === 401) {
    throw new Error("E-mail, CPF ou senha incorretos.");
  }

  if (!resposta.ok) {
    throw new Error("Erro no servidor. Tente novamente mais tarde.");
  }

  return await resposta.json();
};