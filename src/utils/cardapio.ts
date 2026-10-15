import type { Produto } from "../types/Produto";
import type { Secao } from "../types/Secao";

export const pegarIcone = (categoria: string): string => {
  if (categoria === "PRENSADOS") {
    return "🥖";
  }
  if (categoria === "HOT DOGS") {
    return "🌭";
  }

  if (categoria === "LANCHES GOURMET") {
    return "✨";
  }
  if (categoria === "BEBIDAS") {
    return "🥤";
  }

  return "🍔";
};

export const agruparPorCategoria = (lanches: Produto[]): Secao[] => {
  const secoes: Secao[] = [];

  lanches.forEach((lanche) => {
    let secao = secoes.find((item) => item.titulo === lanche.categoria);

    if (secao === undefined) {
      secao = {
        titulo: lanche.categoria,
        icone: pegarIcone(lanche.categoria),
        lanches: [],
      };
      secoes.push(secao);
    }

    secao.lanches.push(lanche);
  });

  return secoes;
};

export const filtrarPorCategoria = (lanches: Produto[], categoria: string): Produto[] => {
  if (categoria === "TODOS") {
    return lanches;
  }

  return lanches.filter((lanche) => lanche.categoria === categoria);
};