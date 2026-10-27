
import type { Produto } from "../types/Produto";
import { API_URL } from "../utils/constantes";

export const buscarProdutos = async (): Promise<Produto[]> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/menu");
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Tente novamente."
    );
  }

  if (!resposta.ok) {
    throw new Error(
      "Não foi possível carregar os dados do cardápio."
    );
  }

  return await resposta.json();
};

export interface DadosCadastroLanche {
  nome: string;
  preco: number;
  popular: boolean;
  id_categoria: number;
  ingredienteIds: number[];
}

export const cadastrarLanche = async (
  dados: DadosCadastroLanche
): Promise<number> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Você precisa estar logado para cadastrar um lanche."
    );
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor."
    );
  }

  if (!resposta.ok) {
    const erro: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error(
        "Sua sessão expirou. Faça login novamente."
      );
    }

    if (resposta.status === 403) {
      throw new Error(
        "Você não tem permissão para cadastrar lanches."
      );
    }

    throw new Error(
      erro?.message || "Não foi possível cadastrar o lanche."
    );
  }

  const resultado: { id_produto: number } =
    await resposta.json();

  return resultado.id_produto;
};
