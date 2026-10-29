
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginacao from "../../components/Paginacao/Paginacao";
import { buscarEstoque } from "../../services/estoqueService";
import type { ItemEstoque } from "../../types/ItemEstoque";

const Estoque = () => {
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  const itensPorPagina = 10;

  const totalPaginas = Math.ceil(
    estoque.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const estoquePagina = estoque.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  useEffect(() => {
    const carregarEstoque = async () => {
      try {
        const dados = await buscarEstoque();
        setEstoque(dados);
      } catch (erro) {
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar estoque."
        );
      } finally {
        setCarregando(false);
      }
    };

    carregarEstoque();
  }, []);

  if (carregando) {
    return <p>Carregando estoque...</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h3 className="m-0">Controle de Estoque</h3>

        <Link
          to="/admin/estoque/novo"
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
                <th className="ps-3">Produto</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th className="text-end pe-3">
                  Opções
                </th>
              </tr>
            </thead>

            <tbody>
              {estoquePagina.map((item) => (
                <tr key={item.id}>
                  <td className="ps-3 fw-bold">
                    {item.produto}
                  </td>

                  <td>
                    <span className="badge bg-info text-dark">
                      {item.categoria}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        item.quantidade < 5
                          ? "badge bg-danger"
                          : "badge bg-success"
                      }
                    >
                      {item.quantidade}
                    </span>
                  </td>

                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-1">
                      <Link
                        to={
                          "/admin/estoque/editar/" +
                          item.id
                        }
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </Link>

                      {/* TODO: Integrar DELETE com a API */}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {estoquePagina.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4"
                  >
                    Nenhum item cadastrado no estoque.
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

export default Estoque;
