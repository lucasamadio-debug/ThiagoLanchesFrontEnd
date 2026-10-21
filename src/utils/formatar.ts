import { NUMERO_WHATSAPP } from "./constantes";

export const gerarLinkWhatsapp = (nomeLanche: string): string => {
  const mensagem = "Olá, gostaria de pedir " + nomeLanche;
  return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
};

export const formatarPreco = (preco: number): string => {
  return "R$ " + preco.toFixed(2).replace(".", ",");
};

export const classeBadgeEstoque = (quantidade: number): string => {
  if (quantidade < 5) {
    return "badge bg-danger";
  }

  return "badge bg-success";
};