
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { buscarProdutos } from "../../services/produtosService";

interface Ingrediente {
  id: number;
  nome: string;
}

const FormularioLanche = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);

  const [quantidades, setQuantidades] = useState<
    Record<number, number>
  >({});

  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  // TODO: Buscar todos os ingredientes na API do backend.
  // Substituir esta lista vazia pelos ingredientes reais.
  const ingredientes: Ingrediente[] = [];

  useEffect(() => {
    const carregar = async () => {
      try {
        const produtos = await buscarProdutos();

        const listaCategorias = produtos.map(
          (produto) => produto.categoria
        );

        setCategorias([...new Set(listaCategorias)]);

        if (editando) {
          const produto = produtos.find(
            (produto) => produto.id === Number(id)
          );

          if (produto) {
            setNome(produto.nome);
            setCategoria(produto.categoria);
            setPreco(String(produto.preco));

            // TODO: Buscar os ingredientes deste lanche na API.
            // Preencher as quantidades já cadastradas na receita.
          } else {
            setMensagemErro("Lanche não encontrado.");
          }
        }

        // TODO: Carregar os ingredientes cadastrados no banco.
      } catch {
        setMensagemErro("Não foi possível carregar os dados.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id, editando]);

  const alterarQuantidade = (
    idIngrediente: number,
    valor: number
  ) => {
    setQuantidades((quantidadesAtuais) => {
      const quantidadeAtual =
        quantidadesAtuais[idIngrediente] || 0;

      const novaQuantidade = Math.max(
        0,
        quantidadeAtual + valor
      );

      return {
        ...quantidadesAtuais,
        [idIngrediente]: novaQuantidade,
      };
    });
  };

  const salvarLanche = (evento: FormEvent) => {
    evento.preventDefault();

    if (
      nome.trim() === "" ||
      categoria === "" ||
      preco.trim() === "" ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) <= 0
    ) {
      alert("Preencha os campos corretamente.");
      return;
    }

    // TODO: Ao integrar a API, montar a lista
    // dos ingredientes com quantidade maior que zero.
    //
    // Cada item deverá ter:
    // - ID do ingrediente
    // - Quantidade utilizada no lanche

    if (editando) {
      // TODO: Enviar alterações do lanche e da receita.
    } else {
      // TODO: Cadastrar lanche e associar ingredientes.
    }

    // TODO: Redirecionar após confirmação da API.
  };

  if (carregando) {
    return <p>Carregando formulário...</p>;
  }

  if (mensagemErro) {
    return (
      <div>
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
        <form onSubmit={salvarLanche}>
          <CampoFormulario
            id="nome"
            rotulo="Nome do Lanche:"
            tipo="text"
            placeholder="Digite o nome do lanche"
            valor={nome}
            aoMudar={setNome}
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
              className="form-control"
              value={categoria}
              onChange={(evento) =>
                setCategoria(evento.target.value)
              }
              required
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
          </div>

          <CampoFormulario
            id="preco"
            rotulo="Preço (R$):"
            tipo="number"
            placeholder="0,00"
            valor={preco}
            aoMudar={setPreco}
          />

          <hr className="my-4" />

          <h4 className="mb-3">
            Ingredientes do Lanche
          </h4>

          <div className="table-responsive mb-4">
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

                {/* TODO: Listar ingredientes reais da API */}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="btn btn-success me-2"
          >
            Salvar
          </button>

          <Link
            to="/admin/lanches"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioLanche;
