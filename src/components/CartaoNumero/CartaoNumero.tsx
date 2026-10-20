interface CartaoNumeroProps {
  titulo: string;
  valor: string;
  cor: string;
  detalhe?: string;
}

const CartaoNumero = (props: CartaoNumeroProps) => {
  return (
    <div className="col">
      <div className="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
        <small className="text-muted fw-bold">{props.titulo}</small>
        <h3 className={"mt-2 mb-0 " + props.cor}>{props.valor}</h3>
        {props.detalhe ? <small className="text-muted">{props.detalhe}</small> : null}
      </div>
    </div>
  );
};

export default CartaoNumero;