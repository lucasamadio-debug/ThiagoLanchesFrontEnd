
import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { AuthContext } from "../../contexts/AuthContext";
import { cpfSchema, senhaSchema } from "../../schemas/usuario";

const EditarUsuario = () => {
  const auth = useContext(AuthContext);

  const [nome, setNome] = useState(auth.usuario?.nome || "");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});

  // TODO: Quando a API estiver pronta,
  // buscar os dados do usuário logado, incluindo o CPF.

  const salvarUsuario = (evento: FormEvent) => {
    evento.preventDefault();

    const novosErros: Record<string, string> = {};

    if (nome.trim() === "") {
      novosErros.nome = "Informe o nome.";
    }

    const cpfValidado = cpfSchema.safeParse(cpf);

    if (!cpfValidado.success) {
      novosErros.cpf = cpfValidado.error.issues[0].message;
    }

    if (senha !== "" || confirmarSenha !== "") {
      const senhaValidada = senhaSchema.safeParse(senha);

      if (!senhaValidada.success) {
        novosErros.senha = senhaValidada.error.issues[0].message;
      }

      if (senha !== confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem.";
      }
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    // TODO: Conectar com a API para editar o usuário.
    // Enviar nome, CPF e nova senha, se preenchida.
    // Não enviar o e-mail para alteração.

    // TODO: Após a API confirmar a alteração,
    // atualizar os dados do usuário no AuthContext.
  };

  return (
    <div
      className="card shadow-sm mb-4"
      style={{ marginTop: "40px" }}
    >
      <div className="card-header bg-white py-3">
        <h3 className="m-0">Editar Usuário</h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarUsuario}>
          <CampoFormulario
            id="nome"
            rotulo="Nome completo:"
            tipo="text"
            placeholder="Digite seu nome"
            valor={nome}
            erro={erros.nome}
            aoMudar={setNome}
          />

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail:
            </label>

            <input
              id="email"
              type="email"
              className="form-control"
              value={auth.usuario?.email || ""}
              disabled
            />
          </div>

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
            rotulo="Nova senha:"
            tipo="password"
            placeholder="Digite a nova senha (opcional)"
            valor={senha}
            erro={erros.senha}
            aoMudar={setSenha}
          />

          <CampoFormulario
            id="confirmarSenha"
            rotulo="Confirmar nova senha:"
            tipo="password"
            placeholder="Digite a senha novamente"
            valor={confirmarSenha}
            erro={erros.confirmarSenha}
            aoMudar={setConfirmarSenha}
          />

          <button
            type="submit"
            className="btn btn-success me-2"
          >
            Salvar Alterações
          </button>

          <Link
            to="/admin/usuarios"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
