import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg header-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/imagens/logo5.png" alt="Logo" className="header-logo" />
        </Link>

        <div className="navbar-collapse">
          <ul className="navbar-nav">  
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cardapio" >
                Cardápio
              </NavLink>
            </li>
              <li className="nav-item">
              <NavLink className="nav-link" to="/sobre" >
                Sobre
              </NavLink>
            </li>
              <li className="nav-item">
                <a className="nav-link" href="#contato">
                  Contato
                </a>
              </li>
                <li className="nav-item">
              <NavLink className="nav-link" to="/login" >
                <img src="/imagens/adm-logo.png" alt="Login" width="30" height="30" />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;