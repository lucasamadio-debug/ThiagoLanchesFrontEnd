
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Paginacao from "../../components/Paginacao/Paginacao";

import {
  buscarUsuarios,
  buscarMeuUsuario,
  excluirUsuario,
} from "../../services/usuariosService";

import type { Usuario } from "../../services/usuariosService";

import {
  alertaSucesso,
  alertaErro,
  confirmarExclusao,
} from "../../utils/alertas";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [meuId, setMeuId] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const itensPorPagina = 10;

  const totalPaginas = Math.ceil(
    usuarios.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const usuariosPagina = usuarios.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  useEffect(() => {
    let ativo = true;

    const carregarUsuarios = async () => {
      try {
        const [listaUsuarios, meuUsuario] = await Promise.all([
          buscarUsuarios(),
          buscarMeuUsuario(),
        ]);

        if (ativo) {
          setUsuarios(listaUsuarios);
          setMeuId(meuUsuario.id);
        }
      } catch (erro) {
        if (ativo) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Erro ao carregar usuários."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, []);

  const excluir = async (usuario: Usuario) => {
    if (excluindoId !== null || meuId === null) return;

    if (usuario.id === meuId) {
      await alertaErro(
        "Você não pode excluir sua própria conta."
      );
      return;
    }

    const confirmado = await confirmarExclusao(usuario.nome);

    if (!confirmado) return;

    setExcluindoId(usuario.id);

    try {
      await excluirUsuario(usuario.id);

      const novaLista = usuarios.filter(
        (item) => item.id !== usuario.id
      );

      setUsuarios(novaLista);

      const novasPaginas = Math.max(
        1,
        Math.ceil(novaLista.length / itensPorPagina)
      );

      setPaginaAtual((pagina) =>
        Math.min(pagina, novasPaginas)
      );

      await alertaSucesso(
        "Usuário excluído com sucesso!"
      );
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível excluir o usuário."
      );
    } finally {
      setExcluindoId(null);
    }
  };

  if (carregando) {
    return <p>Carregando usuários...</p>;
  }

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
                <th>Nome do Usuário</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th className="text-end pe-3">
                  Opções
                </th>
              </tr>
            </thead>

            <tbody>
              {usuariosPagina.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="ps-3 fw-bold">
                    {usuario.id}
                  </td>

                  <td>
                    {usuario.nome}
                    {usuario.id === meuId && (
                      <span className="badge bg-secondary ms-2">
                        Você
                      </span>
                    )}
                  </td>

                  <td>{usuario.email}</td>

                  <td>
                    <span className="badge bg-info text-dark">
                      {usuario.role === "ADMIN"
                        ? "Administrador"
                        : "Usuário"}
                    </span>
                  </td>

                  <td className="text-end pe-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => excluir(usuario)}
                      disabled={
                        meuId === null ||
                        usuario.id === meuId ||
                        excluindoId !== null
                      }
                      title={
                        usuario.id === meuId
                          ? "Você não pode excluir sua própria conta"
                          : "Excluir usuário"
                      }
                    >
                      {excluindoId === usuario.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </td>
                </tr>
              ))}

              {usuariosPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4"
                  >
                    Nenhum usuário encontrado.
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

export default Usuarios;
