import { useState } from "react";
import type { Destaque } from "../../types/Destaque";
import { dividirEmGrupos } from "../../utils/carrossel";
import { formatarPreco } from "../../utils/formatar";
import "./Carrossel.css";

interface CarrosselProps {
  destaques: Destaque[];
}

const Carrossel = (props: CarrosselProps) => {
  const [indice, setIndice] = useState(0);

  const grupos = dividirEmGrupos(props.destaques, 3);

  const voltar = () => {
    if (indice === 0) {
      setIndice(grupos.length - 1);
    } else {
      setIndice(indice - 1);
    }
  };

  const avancar = () =>{
    if(indice === grupos.length - 1){
        setIndice(0);
    } else {
        setIndice(indice + 1);
    }
  }

  if (grupos.length === 0) {
    return null;
  }

  const grupoAtual = grupos[indice];

  return (
    <div className="carrossel">
      <button type="button" className="carrossel-seta" onClick={voltar} aria-label="Anterior">
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <div className="carrossel-grupo">
        {grupoAtual.map((item) => (
          <div className="card carrossel-card" key={item.nome}>
            <img src={item.imagem} className="card-img-top" alt={item.nome} />
            <div className="card-body text-center">
              <h5 className="card-title">{item.nome}</h5>
              <p className="card-text carrossel-preco">{formatarPreco(item.preco)}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="carrossel-seta" onClick={avancar} aria-label="Próximo">
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Carrossel;