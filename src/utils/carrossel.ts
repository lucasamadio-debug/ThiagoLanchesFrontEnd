import type { Destaque } from "../types/Destaque";

export const dividirEmGrupos = (lista: Destaque[], tamanho: number): Destaque[][] => {
  const grupos: Destaque[][] = [];

  for (let i = 0; i < lista.length; i = i + tamanho) {
    grupos.push(lista.slice(i, i + tamanho));
  }

  return grupos;
};