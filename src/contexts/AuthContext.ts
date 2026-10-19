import { createContext } from "react";
import type { UsuarioLogado } from "../types/UsuarioLogado";
import type { RespostaLogin } from "../types/RespostaLogin";

export interface AuthContextTipo {
  token: string | null;
  usuario: UsuarioLogado | null;
  entrar: (resposta: RespostaLogin) => void;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextTipo>({
  token: null,
  usuario: null,
  entrar: () => {},
  sair: () => {},
});