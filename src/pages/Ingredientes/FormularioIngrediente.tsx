
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

const FormularioIngrediente = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  // TODO: Ao editar, buscar o ingrediente pelo ID na API.
  // Preencher o nome com os dados recebidos.

  const salvarIngrediente = (evento: FormEvent) => {
    evento.preventDefault();

    if (nome.trim() === "") {
      setMensagemErro("Preencha o nome do ingrediente.");
      return;
    }

    setMensagemErro("");

    if (editando) {
      // TODO: Conectar com a API para editar o ingrediente.
    } else {
      // TODO: Conectar com a API para cadastrar o ingrediente.
    }

    // TODO: Após salvar na API,
    // redirecionar para /admin/ingredientes.
  };

  return (
    <div
      className="card shadow-sm mb-4"
      style={{ marginTop: "100px" }}
    >
      <div className="card-header bg-white py-3">
        <h3 className="m-0">
          {editando
            ? "Editar Ingrediente"
            : "Cadastrar Novo Ingrediente"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarIngrediente}>
          <CampoFormulario
            id="nome"
            rotulo="Nome do Ingrediente:"
            tipo="text"
            placeholder="Digite o nome do ingrediente"
            valor={nome}
            aoMudar={setNome}
          />

          {mensagemErro && (
            <div className="alert alert-danger">
              {mensagemErro}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success me-2"
          >
            Salvar
          </button>

          <Link
            to="/admin/ingredientes"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioIngrediente;
