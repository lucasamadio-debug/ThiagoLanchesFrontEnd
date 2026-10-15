import Botao from "../../components/Botao/Botao";
import "./Erro.css";

const Erro = () => {
  return (
    <div className="container text-center py-5">
      <img src="/imagens/404.png" alt="Página não encontrada" className="erro-imagem" />
      <h2>Ops... Página não encontrada!</h2>

      <Botao texto="Voltar para a Home" para="/" />

    </div>
  );
};

export default Erro;