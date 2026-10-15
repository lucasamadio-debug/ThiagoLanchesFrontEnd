import type { FormEvent } from "react";
import "./Login.css";

const Login = () => {
  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
  };

  return (
    <div className="login">
      <div className="card shadow login-card">
        <div className="card-header text-center">
          <img src="/imagens/logo5.png" alt="Thiago Lanches" className="login-logo" />
        </div>

        <div className="card-body">
          <form onSubmit={enviar}>
            <div className="mb-3">
              <label htmlFor="email">E-mail:</label>
              <input 
              type="text" id="email" className="form-control"   placeholder="Digite seu e-mail" />
            </div>
            <div className="mb-3">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                className="form-control"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha">Senha:</label>
              <input type="password" id="senha" className="form-control"   placeholder="Digite sua senha" />
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-success w-100">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;