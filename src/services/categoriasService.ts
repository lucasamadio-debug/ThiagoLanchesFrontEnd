
import { API_URL } from "../utils/constantes";

export interface Categoria {
  id: number;
  nome: string;
}

interface CategoriaApi {
  id_categoria: number;
  nome_categoria: string;
}

export const buscarCategorias = async (): Promise<Categoria[]> => {
  const resposta = await fetch(API_URL + "/categorias");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }

  const dados: CategoriaApi[] = await resposta.json();

  return dados.map((categoria) => ({
    id: categoria.id_categoria,
    nome: categoria.nome_categoria,
  }));
};

export const buscarCategoriaPorId = async (
  id: number
): Promise<Categoria> => {
  const resposta = await fetch(API_URL + "/categorias/" + id);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar a categoria.");
  }

  const dados: CategoriaApi = await resposta.json();

  return {
    id: dados.id_categoria,
    nome: dados.nome_categoria,
  };
};

export const cadastrarCategoria = async (
  nome: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const resposta = await fetch(API_URL + "/categorias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      nome_categoria: nome.trim(),
    }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.message || "Não foi possível cadastrar a categoria."
    );
  }
};

export const editarCategoria = async (
  id: number,
  nome: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const resposta = await fetch(
    API_URL + "/categorias/" + id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nome_categoria: nome.trim(),
      }),
    }
  );

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.message || "Não foi possível editar a categoria."
    );
  }
};

export const excluirCategoria = async (
  id: number
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  const resposta = await fetch(
    API_URL + "/categorias/" + id,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.message || "Não foi possível excluir a categoria."
    );
  }
};
