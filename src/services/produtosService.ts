import type { Produto } from "../types/Produto";
import { API_URL } from "../utils/constantes";

export const buscarProdutos = async (): Promise<Produto[]> => {
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + "/menu");
  } catch (erro) {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.", { cause: erro });
  }

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os dados do cardápio.");
  }

  return await resposta.json();
};