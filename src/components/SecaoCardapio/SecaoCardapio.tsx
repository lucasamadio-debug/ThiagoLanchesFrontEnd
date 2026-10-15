import type { Secao } from "../../types/Secao";
import CardLanche from "../CardLanche/CardLanche";
import "./SecaoCardapio.css";

interface SecaoCardapioProps {
  secao: Secao;
}

const SecaoCardapio = (props: SecaoCardapioProps) => {
  const secao = props.secao;

  return (
    <div className="mb-5">
      <div className="secao-header d-flex align-items-center mb-4">
        <span className="secao-icone">{secao.icone}</span>
        <h2 className="secao-titulo ms-3">{secao.titulo}</h2>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        {secao.lanches.map((lanche) => (
          <div className="col" key={lanche.id}>
            <CardLanche lanche={lanche} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecaoCardapio;