
import { useEffect, useState } from "react";
import CartaoNumero from "../../components/CartaoNumero/CartaoNumero";
import { buscarEstoque } from "../../services/estoqueService";
import { buscarProdutos } from "../../services/produtosService";
import type { ItemEstoque } from "../../types/ItemEstoque";
import type { Produto } from "../../types/Produto";
import { calcularDashboard, calcularEstoque } from "../../utils/calcularDashboard";
import { classeBadgeEstoque, formatarPreco } from "../../utils/formatar";

const Dashboard = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const dadosProdutos = await buscarProdutos();
        setProdutos(dadosProdutos);
      } catch (erro) {
        if (erro instanceof Error) {
          setMensagemErro(erro.message);
        } else {
          setMensagemErro("Erro ao carregar os produtos.");
        }
      }

      try {
        const dadosEstoque = await buscarEstoque();
        setEstoque(dadosEstoque);
      } catch (erro) {
        // TODO: Tratar erros da API de estoque quando estiver pronta.
        console.error("Erro ao carregar estoque:", erro);
      }

      setCarregando(false);
    };

    carregar();
  }, []);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (mensagemErro) {
    return (
      <div className="alert alert-danger">
        {mensagemErro}
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <p className="text-center text-muted">
        Nenhum dado registrado.
      </p>
    );
  }

  const resumo = calcularDashboard(produtos);
  const dadosEstoque = calcularEstoque(estoque);
  const temDadosEstoque = estoque.length > 0;

  let nomeMaior = "-";
  let nomeMenor = "-";

  if (dadosEstoque.ranking.length > 0) {
    nomeMaior = dadosEstoque.ranking[0].produto;
    nomeMenor =
      dadosEstoque.ranking[dadosEstoque.ranking.length - 1].produto;
  }

  return (
    <div>
      <div
        className="row row-cols-2 row-cols-md-4 g-3 mb-4 mx-auto"
        style={{ maxWidth: "1100px" }}
      >
        <CartaoNumero
          titulo="TOTAL DE LANCHES"
          valor={String(resumo.total)}
          cor="text-primary"
        />

        <CartaoNumero
          titulo="PREÇO MÉDIO"
          valor={formatarPreco(resumo.media)}
          cor="text-success"
        />

        <CartaoNumero
          titulo="MAIS CARO"
          valor={formatarPreco(resumo.maisCaroPreco)}
          cor="text-danger"
          detalhe={resumo.maisCaroNome}
        />

        <CartaoNumero
          titulo="MAIS BARATO"
          valor={formatarPreco(resumo.maisBaratoPreco)}
          cor="text-info"
          detalhe={resumo.maisBaratoNome}
        />

        <CartaoNumero
          titulo="CATEGORIAS"
          valor={String(resumo.totalCategorias)}
          cor="text-warning"
        />

        <CartaoNumero
          titulo="BEBIDAS CADASTRADAS"
          valor={String(resumo.totalBebidas)}
          cor="text-primary"
        />

        <CartaoNumero
          titulo="ESTOQUE DE BEBIDAS"
          valor={
            temDadosEstoque
              ? String(dadosEstoque.totalUnidades) + " un."
              : "-"
          }
          cor="text-success"
        />

        <div className="col">
          <div className="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
            <small className="text-muted fw-bold">
              RANKING DE ESTOQUE
            </small>

            <div className="mt-2">
              <div className="text-success fw-bold">
                {nomeMaior}
              </div>
              <small className="text-muted">
                Maior estoque
              </small>
            </div>

            <div className="mt-2">
              <div className="text-danger fw-bold">
                {nomeMenor}
              </div>
              <small className="text-muted">
                Menor estoque
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-3">
        <div className="card-header bg-white py-3">
          <h3 className="m-0">Ranking de Estoque</h3>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">#</th>
                  <th>Produto</th>
                  <th className="text-end pe-3">
                    Quantidade
                  </th>
                </tr>
              </thead>

              <tbody>
                {dadosEstoque.ranking.map((item, indice) => (
                  <tr key={item.id}>
                    <td className="ps-3 fw-bold">
                      {indice + 1}
                    </td>

                    <td>{item.produto}</td>

                    <td className="text-end pe-3">
                      <span
                        className={classeBadgeEstoque(item.quantidade)}
                      >
                        {item.quantidade} un.
                      </span>
                    </td>
                  </tr>
                ))}

                {/* TODO: Ranking preenchido pela API de estoque */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
