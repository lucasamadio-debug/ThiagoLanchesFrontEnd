
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { buscarProdutos } from "../../services/produtosService";

import {
  buscarEstoquePorId,
  cadastrarEstoque,
  editarEstoque,
} from "../../services/estoqueService";

import type { Produto } from "../../types/Produto";

import {
  alertaSucesso,
  alertaErro,
} from "../../utils/alertas";

const FormularioEstoque = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = id !== undefined;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [idProduto, setIdProduto] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [quantidade, setQuantidade] = useState("");

  const [erroProduto, setErroProduto] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome
      .toLowerCase()
      .includes(pesquisaProduto.trim().toLowerCase())
  );

  useEffect(() => {
    let ativo = true;

    const carregarDados = async () => {
      try {
        if (editando) {
          const item = await buscarEstoquePorId(Number(id));

          if (ativo) {
            setIdProduto(String(item.id_produto));
            setNomeProduto(item.produto);
            setQuantidade(String(item.quantidade));
          }
        } else {
          const lista = await buscarProdutos();

          if (ativo) {
            setProdutos(lista);
          }
        }
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(true);
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar os dados."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    };

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [id, editando]);

  const selecionarProduto = (produto: Produto) => {
    setIdProduto(String(produto.id));
    setPesquisaProduto(produto.nome);
    setMostrarSugestoes(false);
    setErroProduto("");
  };

  const salvarEstoque = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (salvando) return;

    setErroProduto("");
    setErroQuantidade("");
    setMensagemErro("");

    let formularioValido = true;

    if (!editando) {
      const produtoValido = produtos.some(
        (produto) => produto.id === Number(idProduto)
      );

      if (!produtoValido) {
        setErroProduto(
          "Selecione um produto na lista de sugestões."
        );
        formularioValido = false;
      }
    }

    const numeroQuantidade = Number(quantidade);

    if (
      quantidade.trim() === "" ||
      !Number.isSafeInteger(numeroQuantidade) ||
      numeroQuantidade < 0
    ) {
      setErroQuantidade(
        "Informe uma quantidade inteira maior ou igual a zero."
      );
      formularioValido = false;
    }

    if (!formularioValido) return;

    setSalvando(true);

    try {
      if (editando) {
        await editarEstoque(
          Number(id),
          numeroQuantidade
        );
      } else {
        await cadastrarEstoque(
          Number(idProduto),
          numeroQuantidade
        );
      }

      await alertaSucesso(
        editando
          ? "Estoque atualizado com sucesso!"
          : "Estoque cadastrado com sucesso!"
      );

      navigate("/admin/estoque");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar o estoque."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoDados) {
    return <p>Carregando dados do estoque...</p>;
  }

  if (erroCarregamento) {
    return (
      <div style={{ marginTop: "100px" }}>
        <div className="alert alert-danger">
          {mensagemErro}
        </div>

        <Link
          to="/admin/estoque"
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
        <form onSubmit={salvarEstoque} noValidate>
          <div className="mb-3">
            <label htmlFor="produto" className="form-label">
              Produto:
            </label>

            {editando ? (
              <input
                type="text"
                id="produto"
                className="form-control"
                value={nomeProduto}
                readOnly
              />
            ) : (
              <div
                className="position-relative"
                onBlur={(evento) => {
                  if (
                    !evento.currentTarget.contains(
                      evento.relatedTarget
                    )
                  ) {
                    setMostrarSugestoes(false);
                  }
                }}
              >
                <input
                  type="text"
                  id="produto"
                  className={
                    erroProduto
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Digite para buscar um produto"
                  autoComplete="off"
                  value={pesquisaProduto}
                  disabled={salvando}
                  onFocus={() => setMostrarSugestoes(true)}
                  onChange={(evento) => {
                    setPesquisaProduto(evento.target.value);
                    setIdProduto("");
                    setErroProduto("");
                    setMostrarSugestoes(true);
                  }}
                  onKeyDown={(evento) => {
                    if (evento.key === "Escape") {
                      setMostrarSugestoes(false);
                    }
                  }}
                />

                {mostrarSugestoes && !salvando && (
                  <div
                    className="list-group position-absolute w-100 shadow-sm"
                    style={{
                      zIndex: 10,
                      maxHeight: "220px",
                      overflowY: "auto",
                    }}
                  >
                    {produtosFiltrados.map((produto) => (
                      <button
                        key={produto.id}
                        type="button"
                        className="list-group-item list-group-item-action text-start"
                        onClick={() =>
                          selecionarProduto(produto)
                        }
                      >
                        {produto.nome}
                      </button>
                    ))}

                    {produtosFiltrados.length === 0 && (
                      <div className="list-group-item text-muted">
                        Nenhum produto encontrado.
                      </div>
                    )}
                  </div>
                )}

                {erroProduto && (
                  <div className="text-danger small mt-1">
                    {erroProduto}
                  </div>
                )}

                {produtos.length === 0 && (
                  <div className="alert alert-warning mt-3">
                    Nenhum produto cadastrado.
                    Cadastre um lanche antes de
                    adicionar estoque.
                  </div>
                )}
              </div>
            )}
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
              className={
                erroQuantidade
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="Digite a quantidade"
              min="0"
              step="1"
              value={quantidade}
              disabled={salvando}
              onChange={(evento) => {
                setQuantidade(evento.target.value);
                setErroQuantidade("");
              }}
            />

            {erroQuantidade && (
              <div className="invalid-feedback">
                {erroQuantidade}
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={
                salvando ||
                (!editando && produtos.length === 0)
              }
            >
              {salvando ? "Salvando..." : "Salvar"}
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
