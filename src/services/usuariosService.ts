
import { API_URL } from "../utils/constantes";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string | null;
  role: "ADMIN" | "USER";
}

const obterToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  return token;
};

const obterErro = async (
  resposta: Response,
  mensagemPadrao: string
): Promise<Error> => {
  const dados: { message?: string } | null =
    await resposta.json().catch(() => null);

  return new Error(dados?.message || mensagemPadrao);
};

export const buscarUsuarios = async (): Promise<Usuario[]> => {
  const resposta = await fetch(API_URL + "/usuarios", {
    headers: {
      Authorization: "Bearer " + obterToken(),
    },
  });

  if (!resposta.ok) {
    throw await obterErro(
      resposta,
      "Não foi possível carregar os usuários."
    );
  }

  return await resposta.json();
};

export const buscarMeuUsuario = async (): Promise<Usuario> => {
  const resposta = await fetch(API_URL + "/usuarios/me", {
    headers: {
      Authorization: "Bearer " + obterToken(),
    },
  });

  if (!resposta.ok) {
    throw await obterErro(
      resposta,
      "Não foi possível carregar seus dados."
    );
  }

  return await resposta.json();
};

export const editarMeuUsuario = async (
  nome: string,
  cpf: string,
  senha?: string
): Promise<Usuario> => {
  const resposta = await fetch(API_URL + "/usuarios/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + obterToken(),
    },
    body: JSON.stringify({
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ""),
      ...(senha ? { senha } : {}),
    }),
  });

  if (!resposta.ok) {
    throw await obterErro(
      resposta,
      "Não foi possível atualizar seus dados."
    );
  }

  return await resposta.json();
};

export const excluirUsuario = async (
  id: number
): Promise<void> => {
  const resposta = await fetch(
    API_URL + "/usuarios/" + id,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + obterToken(),
      },
    }
  );

  if (!resposta.ok) {
    throw await obterErro(
      resposta,
      "Não foi possível excluir o usuário."
    );
  }
};
