
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import {
  buscarLanchePorId,
  cadastrarLanche,
  editarLanche,
} from "../../services/produtosService";

import { buscarCategorias } from "../../services/categoriasService";
import type { Categoria } from "../../services/categoriasService";

import { buscarIngredientes } from "../../services/ingredientesService";
import type { Ingrediente } from "../../services/ingredientesService";

import {
  alertaSucesso,
  alertaErro,
} from "../../utils/alertas";

interface ErrosFormulario {
  nome?: string;
  categoria?: string;
  preco?: string;
  ingredientes?: string;
}

const FormularioLanche = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [popular, setPopular] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});

  const categoriaSelecionada = categorias.find(
    (item) => item.id === Number(categoria)
  );

  const nomeCategoria = categoriaSelecionada?.nome
    .trim()
    .toLowerCase();

  const ehBebida =
    nomeCategoria === "bebidas" ||
    nomeCategoria === "bebida";

  useEffect(() => {
    let ativo = true;

    const carregarDados = async () => {
      try {
        const [listaCategorias, listaIngredientes, lanche] =
          await Promise.all([
            buscarCategorias(),
            buscarIngredientes(),
            editando
              ? buscarLanchePorId(Number(id))
              : Promise.resolve(null),
          ]);

        if (!ativo) return;

        setCategorias(listaCategorias);
        setIngredientes(listaIngredientes);

        if (lanche) {
          setNome(lanche.nome);
          setCategoria(String(lanche.id_categoria));
          setPreco(String(lanche.preco));
          setPopular(Boolean(lanche.popular));

          const quantidadesSalvas: Record<number, number> = {};

          lanche.ingredientesDetalhados.forEach((ingrediente) => {
            quantidadesSalvas[ingrediente.id_ingrediente] =
              ingrediente.quantidade;
          });

          setQuantidades(quantidadesSalvas);
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
          setCarregando(false);
        }
      }
    };

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [id, editando]);

  const alterarQuantidade = (
    idIngrediente: number,
    valor: number
  ) => {
    setQuantidades((atual) => ({
      ...atual,
      [idIngrediente]: Math.max(
        0,
        (atual[idIngrediente] || 0) + valor
      ),
    }));

    setErros((atual) => ({
      ...atual,
      ingredientes: undefined,
    }));
  };

  const salvarLanche = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (salvando) return;

    const novosErros: ErrosFormulario = {};

    const nomeTratado = nome.trim();
    const precoNormalizado = preco.trim().replace(",", ".");
    const valorPreco = Number(precoNormalizado);

    if (nomeTratado === "") {
      novosErros.nome = "Informe o nome do produto.";
    } else if (nomeTratado.length > 100) {
      novosErros.nome =
        "O nome deve ter no máximo 100 caracteres.";
    }

    const categoriaValida = categorias.some(
      (item) => item.id === Number(categoria)
    );

    if (categoria === "" || !categoriaValida) {
      novosErros.categoria =
        "Selecione uma categoria válida.";
    }

    if (
      !/^\d+(\.\d{1,2})?$/.test(precoNormalizado) ||
      !Number.isFinite(valorPreco) ||
      valorPreco <= 0
    ) {
      novosErros.preco =
        "Digite um preço válido maior que zero.";
    }

    const ingredientesSelecionados = Object.entries(quantidades)
      .filter(([, quantidade]) => quantidade > 0)
      .map(([idIngrediente, quantidade]) => ({
        id_ingrediente: Number(idIngrediente),
        quantidade,
      }));

    if (!ehBebida && ingredientesSelecionados.length === 0) {
      novosErros.ingredientes =
        "Selecione pelo menos um ingrediente.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    const dadosLanche = {
      nome: nomeTratado,
      preco: valorPreco,
      popular,
      id_categoria: Number(categoria),
      ingredientes: ehBebida ? [] : ingredientesSelecionados,
    };

    setSalvando(true);

    try {
      if (editando) {
        await editarLanche(Number(id), dadosLanche);
      } else {
        await cadastrarLanche(dadosLanche);
      }

      await alertaSucesso(
        editando
          ? "Produto editado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );

      navigate("/admin/lanches");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar o produto."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <p>Carregando formulário...</p>;
  }

  if (erroCarregamento) {
    return (
      <div style={{ marginTop: "100px" }}>
        <div className="alert alert-danger">
          {mensagemErro}
        </div>

        <Link
          to="/admin/lanches"
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
            ? "Editar Produto"
            : "Cadastrar Novo Produto"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarLanche} noValidate>
          <CampoFormulario
            id="nome"
            rotulo="Nome do Produto:"
            tipo="text"
            placeholder="Digite o nome do produto"
            valor={nome}
            maxLength={100}
            aoMudar={(valor) => {
              setNome(valor);

              setErros((atual) => ({
                ...atual,
                nome: undefined,
              }));
            }}
            erro={erros.nome}
          />

          <div className="mb-3">
            <label
              htmlFor="categoria"
              className="form-label"
            >
              Categoria:
            </label>

            <select
              id="categoria"
              className={
                erros.categoria
                  ? "form-select is-invalid"
                  : "form-select"
              }
              value={categoria}
              onChange={(evento) => {
                setCategoria(evento.target.value);

                setErros((atual) => ({
                  ...atual,
                  categoria: undefined,
                  ingredientes: undefined,
                }));
              }}
              disabled={salvando}
            >
              <option value="">
                Selecione uma categoria
              </option>

              {categorias.map((item) => (
                <option
                  key={item.id}
                  value={String(item.id)}
                >
                  {item.nome}
                </option>
              ))}
            </select>

            {erros.categoria && (
              <div className="invalid-feedback">
                {erros.categoria}
              </div>
            )}
          </div>

          <CampoFormulario
            id="preco"
            rotulo="Preço (R$):"
            tipo="text"
            placeholder="Ex.: 15,50"
            valor={preco}
            aoMudar={(valor) => {
              setPreco(valor);

              setErros((atual) => ({
                ...atual,
                preco: undefined,
              }));
            }}
            erro={erros.preco}
          />

          <div className="form-check mb-3">
            <input
              id="popular"
              type="checkbox"
              className="form-check-input"
              checked={popular}
              disabled={salvando}
              onChange={(evento) => {
                setPopular(evento.target.checked);
              }}
            />

            <label
              htmlFor="popular"
              className="form-check-label"
            >
              Marcar como produto popular
            </label>
          </div>

          {!ehBebida && (
            <>
              <hr className="my-4" />

              <h4 className="mb-3">
                Ingredientes do Lanche
              </h4>

              <div className="table-responsive mb-2">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">
                        Ingrediente
                      </th>

                      <th className="text-end pe-3">
                        Quantidade
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {ingredientes.map((ingrediente) => (
                      <tr key={ingrediente.id}>
                        <td className="ps-3">
                          {ingrediente.nome}
                        </td>

                        <td className="text-end pe-3">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={
                                salvando ||
                                (quantidades[ingrediente.id] || 0) === 0
                              }
                              onClick={() =>
                                alterarQuantidade(
                                  ingrediente.id,
                                  -1
                                )
                              }
                            >
                              −
                            </button>

                            <span
                              className="text-center fw-bold"
                              style={{ minWidth: "30px" }}
                            >
                              {quantidades[ingrediente.id] || 0}
                            </span>

                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              disabled={salvando}
                              onClick={() =>
                                alterarQuantidade(
                                  ingrediente.id,
                                  1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {ingredientes.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center py-3"
                        >
                          Nenhum ingrediente cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {erros.ingredientes && (
                <div className="text-danger mb-3">
                  {erros.ingredientes}
                </div>
              )}
            </>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>

            <Link
              to="/admin/lanches"
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

export default FormularioLanche;
