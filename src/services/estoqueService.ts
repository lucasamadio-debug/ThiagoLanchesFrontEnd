
import { API_URL } from "../utils/constantes";
import type { ItemEstoque } from "../types/ItemEstoque";

export interface EstoqueDetalhado extends ItemEstoque {
  id_produto: number;
}

const requisicaoEstoque = async (
  caminho: string,
  metodo: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  dados?: object
): Promise<Response> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const headers: Record<string, string> = {
    Authorization: "Bearer " + token,
  };

  if (dados) {
    headers["Content-Type"] = "application/json";
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers,
      body: dados ? JSON.stringify(dados) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    const erro: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    if (resposta.status === 403) {
      throw new Error("Você não tem permissão para acessar o estoque.");
    }

    throw new Error(
      erro?.message || "Não foi possível realizar a operação."
    );
  }

  return resposta;
};

export const buscarEstoque = async (): Promise<ItemEstoque[]> => {
  const resposta = await requisicaoEstoque("/estoque");
  return await resposta.json();
};

export const buscarEstoquePorId = async (
  id: number
): Promise<EstoqueDetalhado> => {
  const resposta = await requisicaoEstoque("/estoque/" + id);
  return await resposta.json();
};

export const cadastrarEstoque = async (
  id_produto: number,
  quantidade: number
): Promise<void> => {
  await requisicaoEstoque("/estoque", "POST", {
    id_produto,
    quantidade,
  });
};

export const editarEstoque = async (
  id: number,
  quantidade: number
): Promise<void> => {
  await requisicaoEstoque("/estoque/" + id, "PUT", {
    quantidade,
  });
};

export const excluirEstoque = async (
  id: number
): Promise<void> => {
  await requisicaoEstoque("/estoque/" + id, "DELETE");
};
