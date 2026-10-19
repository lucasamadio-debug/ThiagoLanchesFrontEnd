import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UsuarioLogado } from "../types/UsuarioLogado";
import type { RespostaLogin } from "../types/RespostaLogin";

interface AuthProviderProps {
  children: ReactNode;
}

const lerUsuarioSalvo = (): UsuarioLogado | null => {
  const texto = localStorage.getItem("usuario");

  if (texto === null) {
    return null;
  }

  return JSON.parse(texto);
};

const AuthProvider = (props: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(lerUsuarioSalvo());

  const entrar = (resposta: RespostaLogin) => {
    localStorage.setItem("token", resposta.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.user));
    setToken(resposta.token);
    setUsuario(resposta.user);
  };

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token: token, usuario: usuario, entrar: entrar, sair: sair }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;