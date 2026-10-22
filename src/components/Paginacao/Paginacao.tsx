
interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  aoMudar: (pagina: number) => void;
}

const Paginacao = ({
  paginaAtual,
  totalPaginas,
  aoMudar,
}: PaginacaoProps) => {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 py-3">
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        disabled={paginaAtual === 1}
        onClick={() => aoMudar(paginaAtual - 1)}
      >
        Anterior
      </button>

      <span>
        Página {paginaAtual} de {totalPaginas}
      </span>

      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        disabled={paginaAtual === totalPaginas}
        onClick={() => aoMudar(paginaAtual + 1)}
      >
        Próxima
      </button>
    </div>
  );
};

export default Paginacao;
