
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import {
  buscarIngredientes,
  cadastrarIngrediente,
  editarIngrediente,
} from "../../services/ingredientesService";

const FormularioIngrediente = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(editando);

  useEffect(() => {
    if (!editando) {
      return;
    }

    let ativo = true;

    const carregarIngrediente = async () => {
      try {
        const ingredientes = await buscarIngredientes();

        const ingrediente = ingredientes.find(
          (item) => item.id === Number(id)
        );

        if (!ativo) return;

        if (ingrediente) {
          setNome(ingrediente.nome);
        } else {
          setMensagemErro("Ingrediente não encontrado.");
        }
      } catch (erro) {
        if (ativo) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Erro ao carregar ingrediente."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    };

    carregarIngrediente();

    return () => {
      ativo = false;
    };
  }, [id, editando]);

  const salvarIngrediente = async (evento: FormEvent) => {
    evento.preventDefault();
    setMensagemErro("");

    const nomeTratado = nome.trim();

    if (nomeTratado === "") {
      setMensagemErro("Preencha o nome do ingrediente.");
      return;
    }

    if (nomeTratado.length > 100) {
      setMensagemErro("O nome deve ter no máximo 100 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      if (editando) {
        await editarIngrediente(Number(id), nomeTratado);
      } else {
        await cadastrarIngrediente(nomeTratado);
      }

      navigate("/admin/ingredientes");

    } catch (erro) {
      if (erro instanceof Error) {
        setMensagemErro(erro.message);
      } else {
        setMensagemErro("Erro ao salvar ingrediente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  if (carregandoDados) {
    return <p>Carregando ingrediente...</p>;
  }

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
            disabled={carregando || nome.trim() === ""}
          >
            {carregando ? "Salvando..." : "Salvar"}
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
