export interface RespostaLogin {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}