import type { Produto } from "./Produto";

export interface Secao {
  titulo: string;
  icone: string;
  lanches: Produto[];
}