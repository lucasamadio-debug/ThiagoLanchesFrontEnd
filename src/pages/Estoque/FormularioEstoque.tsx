
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const FormularioEstoque = () => {
  const { id } = useParams();

  const editando = id !== undefined;

  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [erroProduto, setErroProduto] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");

  // TODO: Na edição, buscar o item pelo ID.
  // Preencher produto e quantidade com os dados da API.

  const validarProduto = () => {
    if (!editando && produto.trim() === "") {
      setErroProduto("Informe o nome do produto para estoque.");
    } else {
      setErroProduto("");
    }
  };

  const validarQuantidade = () => {
    const numero = Number(quantidade);

    if (
      quantidade.trim() === "" ||
      !Number.isInteger(numero) ||
      numero < 0
    ) {
      setErroQuantidade(
        "Informe uma quantidade positiva."
      );
    } else {
      setErroQuantidade("");
    }
  };

  // TODO: Conectar o cadastro e a edição com a API.
  // Habilitar o botão Salvar quando a API estiver pronta.
  // Redirecionar somente após salvar no banco.

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
        <form onSubmit={(evento) => evento.preventDefault()}>
          {/* Nome do produto */}
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
              className={
                erroProduto
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="Digite o nome do produto"
              value={produto}
              maxLength={100}
              disabled={editando}
              onChange={(evento) => {
                setProduto(evento.target.value);
                setErroProduto("");
              }}
              onBlur={validarProduto}
            />

            {erroProduto && (
              <div className="invalid-feedback">
                {erroProduto}
              </div>
            )}
          </div>

          {/* Quantidade */}
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
              className={
                erroQuantidade
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="Digite a quantidade"
              min="0"
              step="1"
              value={quantidade}
              onChange={(evento) => {
                setQuantidade(evento.target.value);
                setErroQuantidade("");
              }}
              onBlur={validarQuantidade}
            />

            {erroQuantidade && (
              <div className="invalid-feedback">
                {erroQuantidade}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="mt-4">
            {/* TODO: Habilitar após integrar com a API */}
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled
            >
              Salvar
            </button>

            <Link
              to="/admin/estoque"
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

export default FormularioEstoque;
