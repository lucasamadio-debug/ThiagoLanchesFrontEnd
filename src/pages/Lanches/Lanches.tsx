
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginacao from "../../components/Paginacao/Paginacao";
import { buscarProdutos } from "../../services/produtosService";
import type { Produto } from "../../types/Produto";
import { formatarPreco } from "../../utils/formatar";

const Lanches = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

  const totalPaginas = Math.ceil(
    produtos.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const produtosPagina = produtos.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await buscarProdutos();
        setProdutos(dados);
      } catch (erro) {
        if (erro instanceof Error) {
          setMensagemErro(erro.message);
        } else {
          setMensagemErro("Erro ao carregar os produtos.");
        }
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  const excluirLanche = (_id: number) => {
    // TODO: Integrar exclusão com a API do backend.
    // Atualizar a listagem depois da exclusão.
  };

  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  if (mensagemErro) {
    return (
      <div className="alert alert-danger">
        {mensagemErro}
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h3 className="m-0">Cadastro de Lanches</h3>

        <Link
          to="/admin/lanches/novo"
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
                <th>Nome do Lanche</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th className="text-end pe-3">Opções</th>
              </tr>
            </thead>

            <tbody>
              {produtosPagina.map((produto) => (
                <tr key={produto.id}>
                  <td className="ps-3 fw-bold">
                    {produto.id}
                  </td>

                  <td>{produto.nome}</td>

                  <td>
                    <span className="badge bg-info text-dark">
                      {produto.categoria}
                    </span>
                  </td>

                  <td>{formatarPreco(produto.preco)}</td>

                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end gap-1">
                      <Link
                        to={
                          "/admin/lanches/editar/" +
                          produto.id
                        }
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          excluirLanche(produto.id)
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {produtos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-3"
                  >
                    Nenhum lanche cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-white">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          aoMudar={setPaginaAtual}
        />
      </div>
    </div>
  );
};

export default Lanches;
