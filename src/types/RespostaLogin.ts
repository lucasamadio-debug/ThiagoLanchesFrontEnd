import type { UsuarioLogado } from "./UsuarioLogado";

export interface RespostaLogin {
  token: string;
  user: UsuarioLogado;
}