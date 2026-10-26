
import { API_URL } from "../utils/constantes";

export interface Ingrediente {
  id: number;
  nome: string;
}

interface IngredienteApi {
  id_ingredientes: number;
  nome_ingrediente: string;
}

export const buscarIngredientes = async (): Promise<Ingrediente[]> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/ingredientes");
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os ingredientes.");
  }

  const dados: IngredienteApi[] = await resposta.json();

  if (!Array.isArray(dados)) {
    throw new Error("Resposta inválida da API de ingredientes.");
  }

  return dados.map((ingrediente) => ({
    id: ingrediente.id_ingredientes,
    nome: ingrediente.nome_ingrediente,
  }));

  
};

//cadastrar

export const cadastrarIngrediente = async (
  nome: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado para cadastrar.");
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/ingredientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nome_ingrediente: nome.trim(),
      }),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    const dados: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    if (resposta.status === 403) {
      throw new Error("Você não tem permissão para cadastrar ingredientes.");
    }

    if (resposta.status === 409) {
      throw new Error("Este ingrediente já está cadastrado.");
    }

    throw new Error(
      dados?.message || "Não foi possível cadastrar o ingrediente."
    );
  }
};

//editar

export const buscarIngredientePorId = async (
  id: number
): Promise<Ingrediente> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/ingredientes/" + id);
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar o ingrediente.");
  }

  const dados: {
    id_ingredientes?: number;
    nome_ingrediente?: string;
    ingredient_id?: number;
    ingredient_name?: string;
  } = await resposta.json();

  const idIngrediente = dados.id_ingredientes ?? dados.ingredient_id;
  const nomeIngrediente = dados.nome_ingrediente ?? dados.ingredient_name;

  if (
    typeof idIngrediente !== "number" ||
    typeof nomeIngrediente !== "string"
  ) {
    throw new Error("Dados inválidos recebidos da API.");
  }

  return {
    id: idIngrediente,
    nome: nomeIngrediente,
  };
};

export const editarIngrediente = async (
  id: number,
  nome: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/ingredientes/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nome_ingrediente: nome.trim(),
      }),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    const dados: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (resposta.status === 403) {
      throw new Error("Você não tem permissão para editar.");
    }

    throw new Error(
      dados?.message || "Não foi possível editar o ingrediente."
    );
  }
};

//excluir

export const excluirIngrediente = async (
  id: number
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Você precisa estar logado.");
  }

  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/ingredientes/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!resposta.ok) {
    const dados: { message?: string } | null =
      await resposta.json().catch(() => null);

    if (resposta.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (resposta.status === 403) {
      throw new Error("Você não tem permissão para excluir.");
    }

    if (resposta.status === 409) {
      throw new Error(
        dados?.message ||
        "Não é possível excluir um ingrediente associado a um lanche."
      );
    }

    throw new Error(
      dados?.message || "Não foi possível excluir o ingrediente."
    );
  }
};

