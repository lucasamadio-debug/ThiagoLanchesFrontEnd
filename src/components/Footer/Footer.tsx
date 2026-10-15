import { NUMERO_WHATSAPP, LINK_INSTAGRAM } from "../../utils/constantes";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="contato" className="footer text-center">
      <h2>Informações de contato</h2>
      <p>📍 Endereço: Avenida Paraná, Jardim Primavera</p>
      <p>⏰ Terça a Sábado: 18h às 00h e Domingo: 18h às 23h</p>

      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        <a href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-square-instagram"></i>
        </a>
         <a href={NUMERO_WHATSAPP} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-square-whatsapp"></i>
        </a>

      </div>
    </footer>
  );
};

export default Footer;