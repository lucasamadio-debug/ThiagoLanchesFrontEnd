   import type { LinkAdmin } from "../types/LinkAdmin";

   export const linksAdmin: LinkAdmin[] = [
     { texto: "Dashboard", para: "/admin" },
     { texto: "Lanches", para: "/admin/lanches" },
     { texto: "Categorias", para: "/admin/categorias" },
     { texto: "Estoque", para: "/admin/estoque" },
     { texto: "Usuários", para: "/admin/usuarios" },
   ];