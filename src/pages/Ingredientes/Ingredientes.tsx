
import { Link } from "react-router-dom";

interface Ingrediente {
  id: number;
  nome: string;
}

const Ingredientes = () => {
  // TODO: Buscar os ingredientes na API do backend.
  const ingredientes: Ingrediente[] = [];

  const excluirIngrediente = (_id: number) => {
    // TODO: Conectar com a API para excluir o ingrediente.
  };

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
              {ingredientes.map((ingrediente) => (
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
                        onClick={() =>
                          excluirIngrediente(ingrediente.id)
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* TODO: Preencher a tabela com dados da API */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ingredientes;
