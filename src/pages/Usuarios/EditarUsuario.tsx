
import { useContext, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import { AuthContext } from "../../contexts/AuthContext";

import {
  cpfSchema,
  senhaSchema,
} from "../../schemas/usuario";

import {
  buscarMeuUsuario,
  editarMeuUsuario,
} from "../../services/usuariosService";

import {
  alertaSucesso,
  alertaErro,
} from "../../utils/alertas";

const EditarUsuario = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemErro, setMensagemErro] = useState("");

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    const carregarUsuario = async () => {
      try {
        const dados = await buscarMeuUsuario();

        if (ativo) {
          setNome(dados.nome);
          setEmail(dados.email);
          setCpf(dados.cpf || "");
        }
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(true);

          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar seus dados."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    };

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  const salvarUsuario = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (salvando) return;

    const novosErros: Record<string, string> = {};

    if (nome.trim() === "") {
      novosErros.nome = "Informe o nome.";
    }

    const cpfValidado = cpfSchema.safeParse(cpf);

    if (!cpfValidado.success) {
      novosErros.cpf =
        cpfValidado.error.issues[0]?.message || "CPF inválido.";
    }

    if (senha !== "" || confirmarSenha !== "") {
      const senhaValidada = senhaSchema.safeParse(senha);

      if (!senhaValidada.success) {
        novosErros.senha =
          senhaValidada.error.issues[0]?.message ||
          "Senha inválida.";
      }

      if (senha !== confirmarSenha) {
        novosErros.confirmarSenha =
          "As senhas não coincidem.";
      }
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setSalvando(true);
    setMensagemErro("");

    try {
      const usuarioAtualizado = await editarMeuUsuario(
        nome,
        cpf,
        senha || undefined
      );

      auth.atualizarUsuario({
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
      });

      await alertaSucesso(
        "Seus dados foram atualizados com sucesso!"
      );

      navigate("/admin/usuarios");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar seus dados."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoDados) {
    return <p>Carregando seus dados...</p>;
  }

  if (erroCarregamento) {
    return (
      <div style={{ marginTop: "40px" }}>
        <div className="alert alert-danger">
          {mensagemErro}
        </div>

        <Link
          to="/admin/usuarios"
          className="btn btn-secondary"
        >
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div
      className="card shadow-sm mb-4"
      style={{ marginTop: "40px" }}
    >
      <div className="card-header bg-white py-3">
        <h3 className="m-0">Editar Meus Dados</h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarUsuario} noValidate>
          <CampoFormulario
            id="nome"
            rotulo="Nome completo:"
            tipo="text"
            placeholder="Digite seu nome"
            valor={nome}
            erro={erros.nome}
            aoMudar={(valor) => {
              setNome(valor);

              setErros((atual) => ({
                ...atual,
                nome: "",
              }));
            }}
          />

          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
            >
              E-mail:
            </label>

            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              disabled
            />

            <small className="text-muted">
              O e-mail não pode ser alterado.
            </small>
          </div>

          <CampoFormulario
            id="cpf"
            rotulo="CPF:"
            tipo="text"
            placeholder="000.000.000-00"
            maxLength={14}
            valor={cpf}
            erro={erros.cpf}
            aoMudar={(valor) => {
              setCpf(valor);

              setErros((atual) => ({
                ...atual,
                cpf: "",
              }));
            }}
          />

          <hr className="my-4" />

          <h5 className="mb-3">
            Alterar Senha
          </h5>

          <p className="text-muted small">
            Deixe os campos abaixo vazios se não quiser
            alterar sua senha.
          </p>

          <CampoFormulario
            id="senha"
            rotulo="Nova senha:"
            tipo="password"
            placeholder="Digite a nova senha"
            valor={senha}
            erro={erros.senha}
            aoMudar={(valor) => {
              setSenha(valor);

              setErros((atual) => ({
                ...atual,
                senha: "",
              }));
            }}
          />

          <CampoFormulario
            id="confirmarSenha"
            rotulo="Confirmar nova senha:"
            tipo="password"
            placeholder="Digite a senha novamente"
            valor={confirmarSenha}
            erro={erros.confirmarSenha}
            aoMudar={(valor) => {
              setConfirmarSenha(valor);

              setErros((atual) => ({
                ...atual,
                confirmarSenha: "",
              }));
            }}
          />

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : "Salvar Alterações"}
            </button>

            <Link
              to="/admin/usuarios"
              className="btn btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
