import "./Sobre.css";

const Sobre = () => {
  return (
    <div>
      <section className="sobre-titulo">
        <h2>Nossa História</h2>
      </section>

      <main>
        <div className="sobre-historia">
          <div className="sobre-texto">
            <h2>A paixão que começou na chapa</h2>
            <p>
              Thiago Lanches nasceu do sonho de um jovem empreendedor apaixonado por gastronomia, mas infelizmente
              não deu certo e teve que ser vendida. Ali começa a sua grande história: Maicon, um homem com vários
              sonhos e um talento incomum para cozinhar, resolveu comprar a lanchonete do Thiago e decidiu deixar
              com o mesmo nome, e isso foi um sucesso. Com dedicação e amor pela arte de fazer lanches, ele cresceu
              muito e agora é um dos maiores da sua cidade. Hoje, Thiago Lanches é conhecido por sua qualidade
              excepcional, ingredientes frescos e atendimento acolhedor, conquistando o paladar de muitos clientes
              fiéis.
            </p>
          </div>
          <div className="sobre-chef">
            <img src="/imagens/maicon1.jpeg" alt="Maicon, o chef da cozinha" />
            <p>Maicon, o chef por trás do sucesso de Thiago Lanches</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;