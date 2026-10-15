import type { Lanche } from "./Lanche";

export interface Secao {
  titulo: string;
  icone: string;
  lanches: Lanche[];
}