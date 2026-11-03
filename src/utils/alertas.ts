
import Swal from "sweetalert2";

export const alertaSucesso = (mensagem: string) => {
  return Swal.fire({
    icon: "success",
    title: "Sucesso!",
    text: mensagem,
    confirmButtonText: "OK",
    confirmButtonColor: "#198754",
  });
};

export const alertaErro = (mensagem: string) => {
  return Swal.fire({
    icon: "error",
    title: "Erro!",
    text: mensagem,
    confirmButtonText: "OK",
    confirmButtonColor: "#dc3545",
  });
};

export const confirmarExclusao = async (
  nome: string
): Promise<boolean> => {
  const resultado = await Swal.fire({
    icon: "warning",
    title: "Confirmar exclusão",
    text: "Deseja realmente excluir " + nome + "?",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true,
  });

  return resultado.isConfirmed;
};
