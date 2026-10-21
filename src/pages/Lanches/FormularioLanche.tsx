
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";
import { buscarProdutos } from "../../services/produtosService";

const FormularioLanche = () => {
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

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
          } else {
            setMensagemErro("Lanche não encontrado.");
          }
        }
      } catch {
        setMensagemErro("Não foi possível carregar os dados.");
      }

      setCarregando(false);
    };

    carregar();
  }, [id, editando]);

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

    alert(
      "Formulário preenchido! A função de salvar será integrada ao backend posteriormente."
    );
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

        <Link to="/admin/lanches" className="btn btn-secondary">
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
            <label htmlFor="categoria" className="form-label">
              Categoria:
            </label>

            <select
              id="categoria"
              className="form-control"
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>

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

          <button type="submit" className="btn btn-success me-2">
            Salvar
          </button>

          <Link to="/admin/lanches" className="btn btn-secondary">
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioLanche;
