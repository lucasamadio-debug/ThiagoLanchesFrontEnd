import { z } from "zod";
import { validarCpf } from "../utils/cpf";

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .min(1, "Informe o e-mail")
  .regex(regexEmail, "E-mail inválido");

export const cpfSchema = z
  .string()
  .min(1, "Informe o CPF")
  .refine(validarCpf, "CPF inválido");

export const senhaSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha precisa ter uma letra maiúscula")
  .regex(/[a-z]/, "A senha precisa ter uma letra minúscula")
  .regex(/[0-9]/, "A senha precisa ter um número")
  .regex(/[^A-Za-z0-9]/, "A senha precisa ter um caractere especial");

export const loginSchema = z.object({
  email: emailSchema,
  cpf: cpfSchema,
  senha: z.string().min(1, "Informe a senha"),
});


export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  email: emailSchema,
  cpf: cpfSchema,
  senha: senhaSchema,
  confirmarSenha: z.string().min(1, "Confirme a senha"),
}).refine(
  (dados) => dados.senha === dados.confirmarSenha,
  {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  }
);
