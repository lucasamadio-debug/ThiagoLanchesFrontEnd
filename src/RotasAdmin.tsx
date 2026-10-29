
import { Routes, Route } from "react-router-dom";

import RotaProtegida from "./components/RotaProtegida/RotaProtegida";
import AdminLayout from "./components/AdminLayout/AdminLayout";

import Dashboard from "./pages/Dashboard/Dashboard";

import Lanches from "./pages/Lanches/Lanches";
import FormularioLanche from "./pages/Lanches/FormularioLanche";

import Categorias from "./pages/Categorias/Categorias";
import FormularioCategoria from "./pages/Categorias/FormularioCategoria";

import Estoque from "./pages/Estoque/Estoque";
import FormularioEstoque from "./pages/Estoque/FormularioEstoque";

import Ingredientes from "./pages/Ingredientes/Ingredientes";
import FormularioIngrediente from "./pages/Ingredientes/FormularioIngrediente";

import Usuarios from "./pages/Usuarios/Usuarios";
import EditarUsuario from "./pages/Usuarios/EditarUsuario";
import Cadastro from "./pages/Cadastro/Cadastro";

import Erro from "./pages/Erro/Erro";

const RotasAdmin = () => {
  return (
    <Routes>
      <Route element={<RotaProtegida />}>
        <Route element={<AdminLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="lanches" element={<Lanches />} />
          <Route path="lanches/novo" element={<FormularioLanche />} />
          <Route path="lanches/editar/:id" element={<FormularioLanche />} />

          <Route path="categorias" element={<Categorias />} />
          <Route path="categorias/novo" element={<FormularioCategoria />} />
          <Route path="categorias/editar/:id" element={<FormularioCategoria />} />

          <Route path="estoque" element={<Estoque />} />
          <Route path="estoque/novo" element={<FormularioEstoque />} />
          <Route path="estoque/editar/:id" element={<FormularioEstoque />} />

          <Route path="ingredientes" element={<Ingredientes />} />
          <Route path="ingredientes/novo" element={<FormularioIngrediente />} />
          <Route path="ingredientes/editar/:id" element={<FormularioIngrediente />} />

          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/novo" element={<Cadastro />} />
          <Route path="usuarios/editar" element={<EditarUsuario />} />

          <Route path="*" element={<Erro />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default RotasAdmin;
