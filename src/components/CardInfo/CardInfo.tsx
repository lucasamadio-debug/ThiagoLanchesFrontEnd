import "./CardInfo.css";

interface CardInfoProps {
  icone: string;
  titulo: string;
  texto: string;
}

const CardInfo = (props: CardInfoProps) => {
  return (
    <div className="card-info">
      <h2>
        {props.icone}
        <br />
        {props.titulo}
      </h2>
      <p>{props.texto}</p>
    </div>
  );
};

export default CardInfo;