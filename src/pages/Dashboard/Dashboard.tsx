import { useEffect, useState } from "react";
import CartaoNumero from "../../components/CartaoNumero/CartaoNumero";
import { buscarProdutos } from "../../services/produtosService";
import type { Produto } from "../../types/Produto";
import { calcularDashboard } from "../../utils/calcularDashboard";
import { formatarPreco } from "../../utils/formatar";

const Dashboard = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await buscarProdutos();
        setProdutos(dados);
      } catch (erro) {
        if (erro instanceof Error) {
          setMensagemErro(erro.message);
        } else {
          setMensagemErro("Erro inesperado. Tente novamente.");
        }
      }

      setCarregando(false);
    };

    carregar();
  }, []);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (mensagemErro) {
    return <div className="alert alert-danger">{mensagemErro}</div>;
  }

  if (produtos.length === 0) {
    return <p className="text-center text-muted">Nenhum dado registrado.</p>;
  }

  const resumo = calcularDashboard(produtos);

  return (
    <div>
      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4 mx-auto" style={{ maxWidth: "1100px" }}>
        <CartaoNumero titulo="TOTAL DE LANCHES" valor={String(resumo.total)} cor="text-primary" />
        <CartaoNumero titulo="PREÇO MÉDIO" valor={formatarPreco(resumo.media)} cor="text-success" />
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
        <CartaoNumero titulo="CATEGORIAS" valor={String(resumo.totalCategorias)} cor="text-warning" />
        <CartaoNumero titulo="BEBIDAS CADASTRADAS" valor={String(resumo.totalBebidas)} cor="text-primary" />

        {/* ESTOQUE: depende de uma rota do back que devolva a quantidade de cada produto */}
        <CartaoNumero titulo="ESTOQUE DE BEBIDAS" valor="-" cor="text-success" />

        <div className="col">
          <div className="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
            <small className="text-muted fw-bold">RANKING DE ESTOQUE</small>
            <div className="mt-2">
              <div className="text-success fw-bold">-</div>
              <small className="text-muted">Maior estoque</small>
            </div>
            <div className="mt-2">
              <div className="text-danger fw-bold">-</div>
              <small className="text-muted">Menor estoque</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-3">
        <div className="card-header bg-white py-3">
          <h3 className="m-0">Ranking de Estoque</h3>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">#</th>
                <th>Produto</th>
                <th className="text-end pe-3">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="text-center text-muted py-3">
                  Aguardando a rota de estoque do back-end
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;