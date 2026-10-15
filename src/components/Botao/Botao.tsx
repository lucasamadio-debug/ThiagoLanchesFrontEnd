import { Link } from "react-router-dom";
import "./Botao.css";

interface BotaoProps {
  texto: string;
  para: string;
}

const Botao = (props: BotaoProps) => {
  return (
    <Link to={props.para} className="botao">
      {props.texto}
    </Link>
  );
};

export default Botao;