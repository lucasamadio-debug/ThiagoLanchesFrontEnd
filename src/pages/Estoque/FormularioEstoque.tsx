
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

const FormularioEstoque = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  // TODO: Ao editar, buscar o estoque pelo ID na API.
  // Preencher o nome do produto e a quantidade.

  const salvar = (evento: FormEvent) => {
    evento.preventDefault();

    if (!editando && produto.trim() === "") {
      setMensagemErro("Informe o nome do produto.");
      return;
    }

    const numero = Number(quantidade);

    if (
      quantidade.trim() === "" ||
      !Number.isInteger(numero) ||
      numero < 0
    ) {
      setMensagemErro(
        "Informe uma quantidade válida (número inteiro, zero ou mais)."
      );
      return;
    }

    setMensagemErro("");

    if (editando) {
      // TODO: Conectar com a API para editar o estoque.
      // Enviar o ID e a quantidade.
    } else {
      // TODO: Conectar com a API para cadastrar o estoque.
      // Enviar os dados do produto e sua quantidade.
    }

    // TODO: Após a API confirmar o salvamento,
    // redirecionar para /admin/estoque.
  };

  return (
    <div
      className="card shadow-sm mb-4"
      style={{ marginTop: "100px" }}
    >
      <div className="card-header bg-white py-3">
        <h3 className="m-0">
          {editando
            ? "Editar Estoque"
            : "Cadastrar Novo Estoque"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvar}>
          <div className="mb-3">
            <label
              htmlFor="produto"
              className="form-label"
            >
              Produto:
            </label>

            <input
              type="text"
              id="produto"
              className="form-control"
              placeholder="Digite o nome do produto"
              value={produto}
              onChange={(evento) =>
                setProduto(evento.target.value)
              }
              disabled={editando}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="quantidade"
              className="form-label"
            >
              Quantidade em estoque:
            </label>

            <input
              type="number"
              id="quantidade"
              className="form-control"
              placeholder="Digite a quantidade"
              min="0"
              step="1"
              value={quantidade}
              onChange={(evento) =>
                setQuantidade(evento.target.value)
              }
            />
          </div>

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
            to="/admin/estoque"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioEstoque;
