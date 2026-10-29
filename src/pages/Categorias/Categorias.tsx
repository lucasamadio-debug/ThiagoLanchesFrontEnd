
import { useState } from "react";
import { Link } from "react-router-dom";
import Paginacao from "../../components/Paginacao/Paginacao";

interface Categoria {
  id: number;
  nome: string;
}

const Categorias = () => {
  // TODO: Buscar as categorias na API.
  const categorias: Categoria[] = [];

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 5;

  const totalPaginas = Math.ceil(
    categorias.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const categoriasPagina = categorias.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

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

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Nome da Categoria</th>
                <th className="text-end pe-3">
                  Opções
                </th>
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

                      {/* TODO: Conectar exclusão com a API */}
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

              {categoriasPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4"
                  >
                    Nenhuma categoria disponível.
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
