
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginacao from "../../components/Paginacao/Paginacao";

import {
  buscarIngredientes,
  excluirIngrediente,
} from "../../services/ingredientesService";

import type { Ingrediente } from "../../services/ingredientesService";

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const itensPorPagina = 5;

  const totalPaginas = Math.ceil(
    ingredientes.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const ingredientesPagina = ingredientes.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await buscarIngredientes();
        setIngredientes(dados);
      } catch (erro) {
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar os ingredientes."
        );
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  const excluir = async (ingrediente: Ingrediente) => {
    const confirmar = window.confirm(
      "Deseja realmente excluir o ingrediente " +
      ingrediente.nome + "?"
    );

    if (!confirmar) {
      return;
    }

    setMensagemErro("");
    setExcluindoId(ingrediente.id);

    try {
      await excluirIngrediente(ingrediente.id);

      const novaLista = ingredientes.filter(
        (item) => item.id !== ingrediente.id
      );

      setIngredientes(novaLista);

      const novasPaginas = Math.max(
        1,
        Math.ceil(novaLista.length / itensPorPagina)
      );

      setPaginaAtual((pagina) =>
        Math.min(pagina, novasPaginas)
      );

    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao excluir ingrediente."
      );
    } finally {
      setExcluindoId(null);
    }
  };

  if (carregando) {
    return <p>Carregando ingredientes...</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h3 className="m-0">Cadastro de Ingredientes</h3>

        <Link
          to="/admin/ingredientes/novo"
          className="btn btn-success btn-sm"
        >
          Cadastrar Novo
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
                <th>Nome do Ingrediente</th>
                <th className="text-end pe-3">Opções</th>
              </tr>
            </thead>

            <tbody>
              {ingredientesPagina.map((ingrediente) => (
                <tr key={ingrediente.id}>
                  <td className="ps-3 fw-bold">
                    {ingrediente.id}
                  </td>

                  <td>{ingrediente.nome}</td>

                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-1">
                      <Link
                        to={
                          "/admin/ingredientes/editar/" +
                          ingrediente.id
                        }
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => excluir(ingrediente)}
                        disabled={excluindoId !== null}
                      >
                        {excluindoId === ingrediente.id
                          ? "Excluindo..."
                          : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

export default Ingredientes;
