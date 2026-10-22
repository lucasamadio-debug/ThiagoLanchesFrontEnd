import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { cadastroSchema } from "../../schemas/usuario";
import { cadastrarUsuario } from "../../services/authService";
import { pegarErros } from "../../utils/erros";
import "../Login/Login.css";

const Cadastro = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setMensagemErro("");

    const resultado = cadastroSchema.safeParse({
      nome,
      email,
      cpf,
      senha,
      confirmarSenha,
    });

    if (!resultado.success) {
      setErros(pegarErros(resultado.error));
      return;
    }

    setErros({});
    setCarregando(true);

    try {
      await cadastrarUsuario(
        nome.trim(),
        email.trim().toLowerCase(),
        cpf.replace(/\D/g, ""),
        senha
      );

      navigate("/login", { replace: true });
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
    <div
      className="d-flex justify-content-center"
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div
        className="card shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-header text-center bg-white py-3">
          <h3 className="m-0">Cadastro de Usuário</h3>

          <Link
            to="/admin/usuarios/editar"
            className="btn btn-outline-dark btn-sm mt-3"
          >
            Editar meus dados
          </Link>
        </div>

        <div className="card-body">
          <form onSubmit={enviar}>
            <CampoFormulario
              id="nome"
              rotulo="Nome completo:"
              tipo="text"
              placeholder="Digite seu nome completo"
              valor={nome}
              erro={erros.nome}
              aoMudar={setNome}
            />

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

            <CampoFormulario
              id="confirmarSenha"
              rotulo="Confirmar senha:"
              tipo="password"
              placeholder="Digite sua senha novamente"
              valor={confirmarSenha}
              erro={erros.confirmarSenha}
              aoMudar={setConfirmarSenha}
            />

            {mensagemErro && (
              <div className="alert alert-danger">
                {mensagemErro}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success w-100 mt-2"
              disabled={carregando}
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;