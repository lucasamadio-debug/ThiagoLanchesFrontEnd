
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

const FormularioCategoria = () => {
  const { id } = useParams();

  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  // TODO: Na edição, buscar a categoria pelo ID
  // e preencher o campo nome com os dados da API.

  const alterarNome = (valor: string) => {
    setNome(valor);

    if (valor.trim() === "") {
      setMensagemErro("Informe o nome da categoria.");
    } else if (valor.trim().length > 100) {
      setMensagemErro(
        "O nome deve ter no máximo 100 caracteres."
      );
    } else {
      setMensagemErro("");
    }
  };

  const salvarCategoria = (evento: FormEvent) => {
    evento.preventDefault();

    if (nome.trim() === "") {
      setMensagemErro("Informe o nome da categoria.");
      return;
    }

    if (nome.trim().length > 100) {
      setMensagemErro(
        "O nome deve ter no máximo 100 caracteres."
      );
      return;
    }

    setMensagemErro("");

    // TODO: Conectar com a API.
    //
    // Se estiver cadastrando:
    // Enviar o nome com POST.
    //
    // Se estiver editando:
    // Enviar o ID e o nome com PUT.
    //
    // Redirecionar somente após salvar no banco.
  };

  return (
    <div
      className="card shadow-sm mb-4"
      style={{ marginTop: "100px" }}
    >
      <div className="card-header bg-white py-3">
        <h3 className="m-0">
          {editando
            ? "Editar Categoria"
            : "Cadastrar Nova Categoria"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarCategoria} noValidate>
          <CampoFormulario
            id="nome"
            rotulo="Nome da Categoria:"
            tipo="text"
            placeholder="Digite o nome da categoria"
            valor={nome}
            aoMudar={alterarNome}
            erro={mensagemErro}
          />

          {/* TODO: Habilitar após conectar a API */}
          <button
            type="submit"
            className="btn btn-success me-2"
            disabled
          >
            Salvar
          </button>

          <Link
            to="/admin/categorias"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioCategoria;
