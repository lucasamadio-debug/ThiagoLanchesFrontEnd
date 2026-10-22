
import { useState } from "react";
import { Link } from "react-router-dom";
import Paginacao from "../../components/Paginacao/Paginacao";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const Usuarios = () => {
  // TODO: Buscar os usuários na API do backend.
  const usuarios: Usuario[] = [];

  const [paginaAtual, setPaginaAtual] = useState(1);

  // Paginação de 10 usuários por página
  const itensPorPagina = 10;

  const totalPaginas = Math.ceil(
    usuarios.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const usuariosPagina = usuarios.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  const excluirUsuario = (_id: number) => {
    // TODO: Conectar à API para excluir o usuário.
    // Confirmar a exclusão antes de enviar.
    // Atualizar a listagem após excluir com sucesso.
    // Impedir que o administrador exclua a própria conta.
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h3 className="m-0">Cadastro de Usuários</h3>

        <div className="d-flex gap-2">
          <Link
            to="/admin/usuarios/editar"
            className="btn btn-outline-dark btn-sm"
          >
            Editar meus dados
          </Link>

          <Link
            to="/admin/usuarios/novo"
            className="btn btn-success btn-sm"
          >
            Cadastrar Novo
          </Link>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Nome do Usuário</th>
                <th>E-mail</th>
                <th className="text-end pe-3">Opções</th>
              </tr>
            </thead>

            <tbody>
              {usuariosPagina.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="ps-3 fw-bold">
                    {usuario.id}
                  </td>

                  <td>{usuario.nome}</td>

                  <td>{usuario.email}</td>

                  <td className="text-end pe-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirUsuario(usuario.id)}
                      disabled
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {/* TODO: Integrar a listagem com a API */}
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

export default Usuarios;
