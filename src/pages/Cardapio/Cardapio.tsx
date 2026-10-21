import { useState, useEffect } from "react";
import FiltroCategorias from "../../components/FiltroCategorias/FiltroCategorias";
import SecaoCardapio from "../../components/SecaoCardapio/SecaoCardapio";
import type { Produto } from "../../types/Produto";
import { filtros } from "../../data/filtros";
import { API_URL } from "../../utils/constantes";
import { filtrarPorCategoria, agruparPorCategoria } from "../../utils/cardapio";

const Cardapio = () => {
  const [categoriaAtual, setCategoriaAtual] = useState("TODOS");
  const [lanches, setLanches] = useState<Produto[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API_URL}/menu`)
        .then((response) => {
          if(!response.ok) {
            throw new Error("Erro ao carregar cardápio")
          }
          return response.json()
        })
        .then((data: Produto[]) => {
          setLanches(data);
        })
        .catch((error) => {
          console.error(error)
          setErro("Não foi possível carregar o cardápio. Tente novamente mais tarde.")
        })
        .finally(() => {
          setCarregando(false);
        })
  }, []);

  const lanchesFiltrados = filtrarPorCategoria(lanches, categoriaAtual);
  const secoes = agruparPorCategoria(lanchesFiltrados);

  return (
    <div className="container my-5">
      <FiltroCategorias filtros={filtros} categoriaAtual={categoriaAtual} aoEscolher={setCategoriaAtual} />

      {carregando && <div className="alert alert-info">Carregando cardápio...</div>}

      {erro && <div className="alert alert-danger">{erro}</div>}

      {secoes.map((secao) => (
        <SecaoCardapio key={secao.titulo} secao={secao} />
      ))}
    </div>
  );
};

export default Cardapio;