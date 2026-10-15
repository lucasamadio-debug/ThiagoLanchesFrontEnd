import type { Filtro } from "../../types/Filtro";
import "./FiltroCategorias.css";

interface FiltroCategoriasProps {
  filtros: Filtro[];
  categoriaAtual: string;
  aoEscolher: (valor: string) => void;
}

const FiltroCategorias = (props: FiltroCategoriasProps) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {props.filtros.map((filtro) => (
        <button
          type="button"
          key={filtro.valor}
          className={props.categoriaAtual === filtro.valor ? "filtro-botao ativo" : "filtro-botao"}
          onClick={() => props.aoEscolher(filtro.valor)}
        >
          {filtro.texto}
        </button>
      ))}
    </div>
  );
};

export default FiltroCategorias;