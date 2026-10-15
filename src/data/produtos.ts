import type { Produto } from "../types/Produto";

// Dados de exemplo, iguais aos do banco antigo.
// Quando a API ficar pronta, isso vai ser trocado por uma chamada ao back-end.
export const lanches: Produto[] = [
  { id: 1, nome: "x-salada", preco: 22, popular: false, ingredientes: "Pão, queijo, presunto, tomate, hamburguer e alface", categoria: "PRENSADOS" },
  { id: 2, nome: "x-bacon", preco: 30, popular: false, ingredientes: "Pão, queijo, presunto, tomate, hamburguer, bacon e alface", categoria: "PRENSADOS" },
  { id: 9, nome: "dog Carne", preco: 22, popular: false, ingredientes: "Pão, salsicha, carne e batata palha", categoria: "HOT DOGS" },
  { id: 10, nome: "dog Bacon", preco: 27, popular: false, ingredientes: "Pão, 2 salsichas, milho, queijo, tomate, bacon e batata palha", categoria: "HOT DOGS" },
  { id: 15, nome: "gourme-cheddar", preco: 30, popular: false, ingredientes: "Pão brioche, hamburguer, queijo, tomate, alface, cheddar, molho da casa e cebola roxa", categoria: "LANCHES GOURMET" },
  { id: 18, nome: "smash Burguer", preco: 16, popular: false, ingredientes: "Pão brioche, hamburguer e queijo", categoria: "LANCHES GOURMET" },
  { id: 39, nome: "Coca-Cola Lata", preco: 6, popular: false, ingredientes: "Refrigerante 350ml", categoria: "BEBIDAS" },
  { id: 41, nome: "Suco Natural", preco: 8, popular: false, ingredientes: "Suco de fruta natural 300ml", categoria: "BEBIDAS" },
];