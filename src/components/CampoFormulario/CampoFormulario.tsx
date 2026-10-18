interface CampoFormularioProps {
  id: string;
  rotulo: string;
  tipo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  erro?: string;
  placeholder?: string;
  maxLength?: number;
}

const CampoFormulario = (props: CampoFormularioProps) => {
  const classe = props.erro ? "form-control is-invalid" : "form-control";

  return (
    <div className="mb-3">
      <label htmlFor={props.id}>{props.rotulo}</label>
      <input
        type={props.tipo}
        id={props.id}
        className={classe}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        value={props.valor}
        onChange={(evento) => props.aoMudar(evento.target.value)}
      />
      <div className="invalid-feedback">{props.erro}</div>
    </div>
  );
};

export default CampoFormulario;