
import { Link } from "react-router-dom";

interface Categoria {
  id: number;
  nome: string;
}

const Categorias = () => {
  // TODO: Buscar as categorias na API do backend.
  const categorias: Categoria[] = [];

  const excluirCategoria = (_id: number) => {
    // TODO: Conectar com a API para excluir a categoria.
  };

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
                <th className="text-end pe-3">Opções</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria) => (
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
                        onClick={() =>
                          excluirCategoria(categoria.id)
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categorias;
