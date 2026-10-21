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
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.", { cause: erro });
  }

  if (resposta.status === 400) {
    throw new Error("Preencha e-mail, CPF e senha.");
  }

  if (resposta.status === 401) {
    throw new Error("E-mail, CPF ou senha incorretos.");
  }

  if (resposta.status === 403) {
    throw new Error("Você não tem permissão para acessar a área administrativa.");
  }

  if (!resposta.ok) {
    throw new Error("Erro no servidor. Tente novamente mais tarde.");
  }



  return await resposta.json();

};



export const cadastrarUsuario = async (
  nome: string,
  email: string,
  cpf: string,
  senha: string
): Promise<void> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        cpf,
        senha,
      }),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor."
    );
  }

  if (!resposta.ok) {
    const dados: { message?: string } | null =
      await resposta.json().catch(() => null);

    throw new Error(
      dados?.message || "Erro ao cadastrar usuário."
    );
  }
};
