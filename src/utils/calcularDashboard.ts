import type { Produto } from "../types/Produto";

export interface DadosDashboard {
  total: number;
  media: number;
  maisCaroNome: string;
  maisCaroPreco: number;
  maisBaratoNome: string;
  maisBaratoPreco: number;
  totalCategorias: number;
  totalBebidas: number;
}

export const calcularDashboard = (produtos: Produto[]): DadosDashboard => {
  let soma = 0;
  let maisCaro = produtos[0];
  let maisBarato = produtos[0];
  let totalBebidas = 0;
  const categorias: string[] = [];

  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];
    const preco = Number(produto.preco);

    soma = soma + preco;

    if (preco > Number(maisCaro.preco)) {
      maisCaro = produto;
    }

    if (preco < Number(maisBarato.preco)) {
      maisBarato = produto;
    }

    if (produto.categoria.toUpperCase() === "BEBIDAS") {
      totalBebidas = totalBebidas + 1;
    }

    if (categorias.includes(produto.categoria) === false) {
      categorias.push(produto.categoria);
    }
  }

  return {
    total: produtos.length,
    media: soma / produtos.length,
    maisCaroNome: maisCaro.nome,
    maisCaroPreco: Number(maisCaro.preco),
    maisBaratoNome: maisBarato.nome,
    maisBaratoPreco: Number(maisBarato.preco),
    totalCategorias: categorias.length,
    totalBebidas: totalBebidas,
  };
};