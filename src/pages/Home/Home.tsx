import Botao from "../../components/Botao/Botao";
import "./Home.css";
import CardInfo from "../../components/CardInfo/CardInfo";
import { informacoes } from "../../data/informacoes";
import Carrossel from "../../components/Carrossel/Carrossel";
import { destaques } from "../../data/destaques";

const Home = () => {
  return (
    <div>
      <section className="banner-fundo">
        <h1>Thiago lanches o melhor de Araruna!</h1>
        <p>
          Os melhores lanches da cidade, com ingredientes frescos e sabor inconfundível que aquece o coração!
        </p>
        <Botao texto="Cardápio" para="/cardapio" />
      </section>
    <main>
      <div className="home-grid">
          {informacoes.map((info) => (
          <CardInfo key={info.titulo} icone={info.icone} titulo={info.titulo} texto={info.texto} />
         ))}
      </div>
      <div className="home-pedido">
        <h2>Faça seu pedido agora mesmo!</h2>
        <p>Os melhores lanches da cidade estão aqui no Thiago Lanches</p>
        <Botao texto="Cardápio" para="/cardapio" />
      </div>
      <Carrossel destaques={destaques} />
    </main>
    </div>
  );
};

export default Home;