import type { ZodError } from "zod";

export const pegarErros = (erro: ZodError): Record<string, string> => {
  const erros: Record<string, string> = {};

  erro.issues.forEach((problema) => {
    const campo = String(problema.path[0]);

    if (erros[campo] === undefined) {
      erros[campo] = problema.message;
    }
  });

  return erros;
};