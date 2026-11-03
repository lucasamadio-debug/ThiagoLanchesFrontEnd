
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import {
  buscarLanchePorId,
  cadastrarLanche,
  editarLanche,
} from "../../services/produtosService";

import { buscarIngredientes } from "../../services/ingredientesService";
import { buscarCategorias } from "../../services/categoriasService";

import type { Ingrediente } from "../../services/ingredientesService";
import type { Categoria } from "../../services/categoriasService";
import { alertaSucesso } from "../../utils/alertas";

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

  const [mensagemErro, setMensagemErro] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const [categoriasApi, ingredientesApi] = await Promise.all([
          buscarCategorias(),
          buscarIngredientes(),
        ]);

        if (!ativo) return;

        setCategorias(categoriasApi);
        setIngredientes(ingredientesApi);

        if (editando) {
          const produto = await buscarLanchePorId(Number(id));

          if (!ativo) return;

          setNome(produto.nome);
          setCategoria(String(produto.id_categoria));
          setPreco(String(produto.preco));
          setPopular(Boolean(produto.popular));

          const quantidadesReceita: Record<number, number> = {};

          produto.ingredientesDetalhados.forEach((ingrediente) => {
            quantidadesReceita[ingrediente.id_ingrediente] =
              ingrediente.quantidade;
          });

          setQuantidades(quantidadesReceita);
        }
      } catch (erro) {
        if (ativo) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar o formulário."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };


    carregar();

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

    setErroSalvar("");

    const novosErros: ErrosFormulario = {};

    const nomeTratado = nome.trim();
    const precoNormalizado = preco.trim().replace(",", ".");
    const valorPreco = Number(precoNormalizado);

    if (nomeTratado === "") {
      novosErros.nome = "Informe o nome do lanche.";
    } else if (nomeTratado.length > 100) {
      novosErros.nome =
        "O nome deve ter no máximo 100 caracteres.";
    }

    if (
      categoria === "" ||
      !categorias.some(
        (item) => item.id === Number(categoria)
      )
    ) {
      novosErros.categoria = "Selecione uma categoria válida.";
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

    if (ingredientesSelecionados.length === 0) {
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
      ingredientes: ingredientesSelecionados,
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
          ? "Lanche editado com sucesso!"
          : "Lanche cadastrado com sucesso!"
      );

      navigate("/admin/lanches");
    } catch (erro) {
      setErroSalvar(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar o lanche."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div style={{ marginTop: "100px" }}>
        <p>Carregando formulário...</p>
      </div>
    );
  }

  if (mensagemErro) {
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
          {editando ? "Editar Lanche" : "Cadastrar Novo Lanche"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarLanche} noValidate>
          <CampoFormulario
            id="nome"
            rotulo="Nome do Lanche:"
            tipo="text"
            placeholder="Digite o nome do lanche"
            valor={nome}
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
            <label htmlFor="categoria" className="form-label">
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
                }));
              }}
            >
              <option value="">Selecione uma categoria</option>

              {categorias.map((item) => (
                <option key={item.id} value={String(item.id)}>
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
              onChange={(evento) =>
                setPopular(evento.target.checked)
              }
            />

            <label
              htmlFor="popular"
              className="form-check-label"
            >
              Marcar como lanche popular
            </label>
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">
            Ingredientes do Lanche
          </h4>

          <div className="table-responsive mb-2">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Ingrediente</th>
                  <th className="text-end pe-3">Quantidade</th>
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
                            (quantidades[ingrediente.id] || 0) === 0
                          }
                          onClick={() =>
                            alterarQuantidade(ingrediente.id, -1)
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
                          onClick={() =>
                            alterarQuantidade(ingrediente.id, 1)
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

          {erroSalvar && (
            <div className="alert alert-danger">
              {erroSalvar}
            </div>
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
