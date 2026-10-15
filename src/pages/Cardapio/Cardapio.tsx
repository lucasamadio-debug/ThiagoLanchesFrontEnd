import { useState } from "react";
import FiltroCategorias from "../../components/FiltroCategorias/FiltroCategorias";
import SecaoCardapio from "../../components/SecaoCardapio/SecaoCardapio";
import { lanches } from "../../data/lanches";
import { filtros } from "../../data/filtros";
import { filtrarPorCategoria, agruparPorCategoria } from "../../utils/cardapio";

const Cardapio = () => {
  const [categoriaAtual, setCategoriaAtual] = useState("TODOS");

  const lanchesFiltrados = filtrarPorCategoria(lanches, categoriaAtual);
  const secoes = agruparPorCategoria(lanchesFiltrados);

  return (
    <div className="container my-5">
      <FiltroCategorias filtros={filtros} categoriaAtual={categoriaAtual} aoEscolher={setCategoriaAtual} />

      {secoes.map((secao) => (
        <SecaoCardapio key={secao.titulo} secao={secao} />
      ))}
    </div>
  );
};

export default Cardapio;