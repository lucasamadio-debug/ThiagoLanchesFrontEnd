
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Paginacao from "../../components/Paginacao/Paginacao";

import {
  buscarCategorias,
  excluirCategoria,
} from "../../services/categoriasService";

import type { Categoria } from "../../services/categoriasService";

import {
  alertaSucesso,
  alertaErro,
  confirmarExclusao,
} from "../../utils/alertas";

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const itensPorPagina = 5;

  const totalPaginas = Math.ceil(
    categorias.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const categoriasPagina = categorias.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await buscarCategorias();
        setCategorias(dados);
      } catch (erro) {
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar categorias."
        );
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  const excluir = async (categoria: Categoria) => {
    const confirmado = await confirmarExclusao(categoria.nome);

    if (!confirmado) return;

    setExcluindoId(categoria.id);

    try {
      await excluirCategoria(categoria.id);

      const novaLista = categorias.filter(
        (item) => item.id !== categoria.id
      );

      setCategorias(novaLista);

      const novasPaginas = Math.max(
        1,
        Math.ceil(novaLista.length / itensPorPagina)
      );

      setPaginaAtual((pagina) =>
        Math.min(pagina, novasPaginas)
      );

      await alertaSucesso("Categoria excluída com sucesso!");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível excluir a categoria."
      );
    } finally {
      setExcluindoId(null);
    }
  };

  if (carregando) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h3 className="m-0">Cadastro de Categorias</h3>

        <Link
          to="/admin/categorias/novo"
          className="btn btn-success btn-sm"
        >
          Nova Categoria
        </Link>
      </div>

      {mensagemErro && (
        <div className="alert alert-danger m-3">
          {mensagemErro}
        </div>
      )}

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Nome da Categoria</th>
                <th className="text-end pe-3">Opções</th>
              </tr>
            </thead>

            <tbody>
              {categoriasPagina.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="ps-3 fw-bold">
                    {categoria.id}
                  </td>

                  <td>{categoria.nome}</td>

                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-1">
                      <Link
                        to={
                          "/admin/categorias/editar/" +
                          categoria.id
                        }
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => excluir(categoria)}
                        disabled={excluindoId !== null}
                      >
                        {excluindoId === categoria.id
                          ? "Excluindo..."
                          : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categorias.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4"
                  >
                    Nenhuma categoria cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="card-footer bg-white">
          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            aoMudar={setPaginaAtual}
          />
        </div>
      )}
    </div>
  );
};

export default Categorias;
