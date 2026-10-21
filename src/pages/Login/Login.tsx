
import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { AuthContext } from "../../contexts/AuthContext";
import { loginSchema } from "../../schemas/usuario";
import { fazerLogin } from "../../services/authService";
import { pegarErros } from "../../utils/erros";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setMensagemErro("");

    const resultado = loginSchema.safeParse({
      email: email,
      cpf: cpf,
      senha: senha,
    });

    if (resultado.success === false) {
      setErros(pegarErros(resultado.error));
      return;
    }

    setErros({});
    setCarregando(true);

    try {
      const cpfSomenteNumeros = cpf.replace(/\D/g, "");

      const resposta = await fazerLogin(
        email,
        cpfSomenteNumeros,
        senha
      );

      auth.entrar(resposta);
      navigate("/admin");

    } catch (erro) {
      if (erro instanceof Error) {
        setMensagemErro(erro.message);
      } else {
        setMensagemErro("Erro inesperado. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login">
      <div className="card shadow login-card">
        <div className="card-header text-center bg-white py-3">
          <h3 className="m-0">Login</h3>
        </div>

        <div className="card-body">
          <form onSubmit={enviar}>
            <CampoFormulario
              id="email"
              rotulo="E-mail:"
              tipo="email"
              placeholder="Digite seu e-mail"
              valor={email}
              erro={erros.email}
              aoMudar={setEmail}
            />

            <CampoFormulario
              id="cpf"
              rotulo="CPF:"
              tipo="text"
              placeholder="000.000.000-00"
              maxLength={14}
              valor={cpf}
              erro={erros.cpf}
              aoMudar={setCpf}
            />

            <CampoFormulario
              id="senha"
              rotulo="Senha:"
              tipo="password"
              placeholder="Digite sua senha"
              valor={senha}
              erro={erros.senha}
              aoMudar={setSenha}
            />

            {mensagemErro && (
              <div className="alert alert-danger">
                {mensagemErro}
              </div>
            )}

            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={carregando}
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
