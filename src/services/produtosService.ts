
import type { Produto } from "../types/Produto";
import { API_URL } from "../utils/constantes";

export interface IngredienteLanche {
  id_ingrediente: number;
  quantidade: number;
}

export interface DadosCadastroLanche {
  nome: string;
  preco: number;
  popular: boolean;
  id_categoria: number;
  ingredientes: IngredienteLanche[];
}

export interface ProdutoDetalhado extends Produto {
  id_categoria: number;
  ingredientesDetalhados: IngredienteLanche[];
}

export const buscarProdutos = async (): Promise<Produto[]> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/menu");
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os lanches.");
  }

  return await resposta.json();
};

export const buscarLanchePorId = async (
  id: number
): Promise<ProdutoDetalhado> => {
  const resposta = await fetch(API_URL + "/menu/" + id);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o lanche.");
  }

  return await resposta.json();
};

export const cadastrarLanche = async (
  dados: DadosCadastroLanche
): Promise<number> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const resposta = await fetch(API_URL + "/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.message || "Não foi possível cadastrar o lanche."
    );
  }

  const resultado: { id_produto: number } =
    await resposta.json();

  return resultado.id_produto;
};

export const editarLanche = async (
  id: number,
  dados: DadosCadastroLanche
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const resposta = await fetch(API_URL + "/menu/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.message || "Não foi possível editar o lanche."
    );
  }
};

export const excluirLanche = async (
  id: number
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/menu/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    const erro: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (resposta.status === 403) {
      throw new Error("Você não tem permissão para excluir lanches.");
    }

    if (resposta.status === 404) {
      throw new Error("Lanche não encontrado.");
    }

    if (resposta.status === 409) {
      throw new Error(
        erro?.message ||
        "Não é possível excluir um lanche vinculado ao estoque."
      );
    }

    throw new Error(
      erro?.message || "Não foi possível excluir o lanche."
    );
  }
};
