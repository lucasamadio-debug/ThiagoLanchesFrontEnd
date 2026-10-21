
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

const FormularioCategoria = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");

  // TODO: Ao editar, buscar a categoria pelo ID na API
  // e preencher o campo nome com os dados recebidos.

  const salvarCategoria = (evento: FormEvent) => {
    evento.preventDefault();

    if (nome.trim() === "") {
      alert("Preencha o nome da categoria.");
      return;
    }

    // TODO: Conectar com a API do backend.
    // Se for cadastro, enviar os dados com POST.
    // Se for edição, atualizar com PUT.
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
        <form onSubmit={salvarCategoria}>
          <CampoFormulario
            id="nome"
            rotulo="Nome da Categoria:"
            tipo="text"
            placeholder="Digite o nome da categoria"
            valor={nome}
            aoMudar={setNome}
          />

          <button
            type="submit"
            className="btn btn-success me-2"
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
