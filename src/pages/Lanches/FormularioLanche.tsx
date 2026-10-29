
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { buscarProdutos } from "../../services/produtosService";
import { buscarIngredientes } from "../../services/ingredientesService";
import type { Ingrediente } from "../../services/ingredientesService";

interface ErrosFormulario {
  nome?: string;
  categoria?: string;
  preco?: string;
  ingredientes?: string;
}

const FormularioLanche = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [popular, setPopular] = useState(false);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});

  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const [produtos, ingredientesApi] = await Promise.all([
          buscarProdutos(),
          buscarIngredientes(),
        ]);

        if (!ativo) return;

        setIngredientes(ingredientesApi);

        // TODO: Substituir pela API de categorias quando estiver pronta.
        // Por enquanto, utiliza as categorias dos produtos existentes.
        const categoriasExistentes = produtos
          .map((produto) => produto.categoria)
          .filter((valor): valor is string => Boolean(valor));

        setCategorias([...new Set(categoriasExistentes)]);

        if (editando) {
          const produto = produtos.find(
            (item) => item.id === Number(id)
          );

          if (!produto) {
            setMensagemErro("Lanche não encontrado.");
            return;
          }

          setNome(produto.nome);
          setCategoria(produto.categoria);
          setPreco(String(produto.preco));
          setPopular(Boolean(produto.popular));

          // TODO: Quando a API de produtos retornar
          // as quantidades dos ingredientes,
          // preencher o estado quantidades aqui.
        }
      } catch (erro) {
        if (ativo) {
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

    carregar();

    return () => {
      ativo = false;
    };
  }, [id, editando]);

  const alterarQuantidade = (
    idIngrediente: number,
    valor: number
  ) => {
    setQuantidades((quantidadesAtuais) => {
      const atual = quantidadesAtuais[idIngrediente] || 0;

      return {
        ...quantidadesAtuais,
        [idIngrediente]: Math.max(0, atual + valor),
      };
    });

    setErros((atuais) => ({
      ...atuais,
      ingredientes: undefined,
    }));
  };

  const salvarLanche = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const novosErros: ErrosFormulario = {};

    const nomeTratado = nome.trim();
    const precoNormalizado = preco.trim().replace(",", ".");
    const valorPreco = Number(precoNormalizado);

    // Validação do nome
    if (nomeTratado === "") {
      novosErros.nome = "Informe o nome do lanche.";
    } else if (nomeTratado.length > 100) {
      novosErros.nome =
        "O nome deve ter no máximo 100 caracteres.";
    }

    // Validação da categoria
    if (
      categoria === "" ||
      !categorias.includes(categoria)
    ) {
      novosErros.categoria =
        "Selecione uma categoria válida.";
    }

    // Validação do preço
    if (
      !/^\d+(\.\d{1,2})?$/.test(precoNormalizado) ||
      !Number.isFinite(valorPreco) ||
      valorPreco <= 0
    ) {
      novosErros.preco =
        "Digite um preço maior que zero (ex.: 15,50).";
    }

    // Ingredientes selecionados no formulário
    const ingredientesSelecionados = Object.entries(quantidades)
      .filter(([, quantidade]) => quantidade > 0)
      .map(([idIngrediente, quantidade]) => ({
        idIngrediente: Number(idIngrediente),
        quantidade,
      }));

    // Validação dos ingredientes
    if (ingredientesSelecionados.length === 0) {
      novosErros.ingredientes =
        "Selecione pelo menos um ingrediente.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    // TODO: Integrar cadastro e edição de lanches com a API.
    //
    // Dados preparados:
    // nomeTratado
    // valorPreco
    // popular
    // categoria
    // ingredientesSelecionados
    //
    // Quando o backend estiver pronto:
    //
    // 1. Buscar as categorias com seus IDs reais.
    //
    // 2. Substituir a categoria em texto
    // pelo ID correspondente.
    //
    // 3. Enviar os ingredientes selecionados
    // com suas respectivas quantidades.
    //
    // 4. No cadastro, chamar cadastrarLanche().
    //
    // 5. Na edição, chamar a função de atualização
    // e carregar a receita existente.
    //
    // 6. Redirecionar para /admin/lanches somente
    // quando o backend confirmar o salvamento.
    //
    // O botão Salvar permanece desativado
    // enquanto essa integração não estiver pronta.
  };

  if (carregando) {
    return <p>Carregando formulário...</p>;
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
          {editando
            ? "Editar Lanche"
            : "Cadastrar Novo Lanche"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarLanche} noValidate>
          {/* Nome do lanche */}
          <CampoFormulario
            id="nome"
            rotulo="Nome do Lanche:"
            tipo="text"
            placeholder="Digite o nome do lanche"
            valor={nome}
            aoMudar={(valor) => {
              setNome(valor);

              setErros((atuais) => ({
                ...atuais,
                nome: undefined,
              }));
            }}
            erro={erros.nome}
          />

          {/* Categoria */}
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

                setErros((atuais) => ({
                  ...atuais,
                  categoria: undefined,
                }));
              }}
            >
              <option value="">
                Selecione uma categoria
              </option>

              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {erros.categoria && (
              <div className="invalid-feedback">
                {erros.categoria}
              </div>
            )}
          </div>

          {/* Preço */}
          <CampoFormulario
            id="preco"
            rotulo="Preço (R$):"
            tipo="text"
            placeholder="Ex.: 15,50"
            valor={preco}
            aoMudar={(valor) => {
              setPreco(valor);

              setErros((atuais) => ({
                ...atuais,
                preco: undefined,
              }));
            }}
            erro={erros.preco}
          />

          {/* Lanche popular */}
          <div className="form-check mb-3">
            <input
              id="popular"
              type="checkbox"
              className="form-check-input"
              checked={popular}
              onChange={(evento) => {
                setPopular(evento.target.checked);
              }}
            />

            <label
              htmlFor="popular"
              className="form-check-label"
            >
              Marcar como lanche popular
            </label>
          </div>

          <hr className="my-4" />

          {/* Tabela de ingredientes */}
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
                        {/* Diminuir quantidade */}
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          disabled={
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

                        {/* Quantidade selecionada */}
                        <span
                          className="text-center fw-bold"
                          style={{ minWidth: "30px" }}
                        >
                          {quantidades[ingrediente.id] || 0}
                        </span>

                        {/* Aumentar quantidade */}
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
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

          {/* Botões do formulário */}
          <div className="mt-4">
            {/* TODO: Habilitar após integrar
                cadastro e edição com a API */}
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled
            >
              Salvar
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
