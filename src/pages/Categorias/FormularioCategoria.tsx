
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CampoFormulario from "../../components/CampoFormulario/CampoFormulario";

import {
  buscarCategoriaPorId,
  cadastrarCategoria,
  editarCategoria,
} from "../../services/categoriasService";

import {
  alertaSucesso,
  alertaErro,
} from "../../utils/alertas";

const FormularioCategoria = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = id !== undefined;

  const [nome, setNome] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useEffect(() => {
    if (!id) return;

    let ativo = true;

    const carregar = async () => {
      try {
        const categoria = await buscarCategoriaPorId(Number(id));

        if (ativo) {
          setNome(categoria.nome);
        }
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(true);
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : "Erro ao carregar categoria."
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
  }, [id]);

  const salvarCategoria = async (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    if (salvando) return;

    setMensagemErro("");

    const nomeTratado = nome.trim();

    if (nomeTratado === "") {
      setMensagemErro("Informe o nome da categoria.");
      return;
    }

    if (nomeTratado.length > 100) {
      setMensagemErro(
        "O nome deve ter no máximo 100 caracteres."
      );
      return;
    }

    setSalvando(true);

    try {
      if (editando) {
        await editarCategoria(Number(id), nomeTratado);
        await alertaSucesso("Categoria editada com sucesso!");
      } else {
        await cadastrarCategoria(nomeTratado);
        await alertaSucesso("Categoria cadastrada com sucesso!");
      }

      navigate("/admin/categorias");
    } catch (erro) {
      await alertaErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar a categoria."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <p>Carregando categoria...</p>;
  }

  if (erroCarregamento) {
    return (
      <div style={{ marginTop: "100px" }}>
        <div className="alert alert-danger">
          {mensagemErro}
        </div>

        <Link
          to="/admin/categorias"
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
            ? "Editar Categoria"
            : "Cadastrar Nova Categoria"}
        </h3>
      </div>

      <div className="card-body">
        <form onSubmit={salvarCategoria} noValidate>
          <CampoFormulario
            id="nome"
            rotulo="Nome da Categoria:"
            tipo="text"
            placeholder="Digite o nome da categoria"
            valor={nome}
            aoMudar={(valor) => {
              setNome(valor);
              setMensagemErro("");
            }}
            erro={mensagemErro}
            maxLength={100}
          />

          <button
            type="submit"
            className="btn btn-success me-2"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>

          <Link
            to="/admin/categorias"
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default FormularioCategoria;
