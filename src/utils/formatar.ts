import { NUMERO_WHATSAPP } from "./constantes";

export const gerarLinkWhatsapp = (nomeLanche: string): string => {
  const mensagem = "Olá, gostaria de pedir " + nomeLanche;
  return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
};

export const formatarPreco = (preco: number): string => {
  return "R$ " + preco.toFixed(2).replace(".", ",");
};