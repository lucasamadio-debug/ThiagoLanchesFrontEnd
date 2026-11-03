
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import {
  buscarIngredientePorId,
  cadastrarIngrediente,
  editarIngrediente,
} from "../../services/ingredientesService";

import {
  alertaSucesso,
  alertaErro,
} from "../../utils/alertas";

const FormularioIngrediente = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(editando);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useEffect(() => {
    if (!editando) {
      setCarregandoDados(false);
      return;
    }

    let ativo = true;

    const carregarIngrediente = async () => {
      try {
        const ingrediente = await buscarIngredientePorId(
          Number(id)
        );

        if (ativo) {
          setNome(ingrediente.nome);
        }
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(true);

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

  const salvarIngrediente = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (carregando) return;

    setMensagemErro("");

    const nomeTratado = nome.trim();

    if (nomeTratado === "") {
      setMensagemErro("Preencha o nome do ingrediente.");
      return;
    }

    if (nomeTratado.length > 100) {
      setMensagemErro(
        "O nome deve ter no máximo 100 caracteres."
      );
      return;
    }

    setCarregando(true);

    try {
      if (editando) {
        await editarIngrediente(Number(id), nomeTratado);
      } else {
        await cadastrarIngrediente(nomeTratado);
      }

      await alertaSucesso(
        editando
          ? "Ingrediente editado com sucesso!"
          : "Ingrediente cadastrado com sucesso!"
      );

      navigate("/admin/ingredientes");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar o ingrediente."
      );
    } finally {
      setCarregando(false);
    }
  };

  if (carregandoDados) {
    return <p>Carregando ingrediente...</p>;
  }

  if (erroCarregamento) {
    return (
      <div style={{ marginTop: "100px" }}>
        <div className="alert alert-danger">
          {mensagemErro}
        </div>

        <Link
          to="/admin/ingredientes"
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
            aoMudar={(valor) => {
              setNome(valor);
              setMensagemErro("");
            }}
            maxLength={100}
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
