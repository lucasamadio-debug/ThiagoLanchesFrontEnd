import type { Lanche } from "../../types/Lanche";
import { formatarPreco, gerarLinkWhatsapp } from "../../utils/formatar";
import "./CardLanche.css";

interface CardLancheProps {
  lanche: Lanche;
}

const CardLanche = (props: CardLancheProps) => {
  const lanche = props.lanche;

  return (
    <div className="card card-lanche h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="lanche-categoria">{lanche.categoria}</span>
          {lanche.popular ? <span className="badge badge-popular">POPULAR</span> : null}
        </div>

        <div className="mb-4">
          <h4 className="lanche-nome">{lanche.nome}</h4>
          <p className="lanche-ingredientes card-text">{lanche.ingredientes}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <span className="lanche-preco">{formatarPreco(lanche.preco)}</span>
          <a href={gerarLinkWhatsapp(lanche.nome)} target="_blank" rel="noreferrer" className="seta-link">
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardLanche;