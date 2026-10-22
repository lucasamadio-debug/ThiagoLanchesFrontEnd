
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import RotaProtegida from "./components/RotaProtegida/RotaProtegida";
import AdminLayout from "./components/AdminLayout/AdminLayout";

import Home from "./pages/Home/Home";
import Cardapio from "./pages/Cardapio/Cardapio";
import Sobre from "./pages/Sobre/Sobre";
import Login from "./pages/Login/Login";
import Erro from "./pages/Erro/Erro";

import Dashboard from "./pages/Dashboard/Dashboard";

import Lanches from "./pages/Lanches/Lanches";
import FormularioLanche from "./pages/Lanches/FormularioLanche";

import Categorias from "./pages/Categorias/Categorias";
import FormularioCategoria from "./pages/Categorias/FormularioCategoria";

import Cadastro from "./pages/Cadastro/Cadastro";

import Estoque from "./pages/Estoque/Estoque";
import FormularioEstoque from "./pages/Estoque/FormularioEstoque";

import Ingredientes from "./pages/Ingredientes/Ingredientes";
import FormularioIngrediente from "./pages/Ingredientes/FormularioIngrediente";

import Usuarios from "./pages/Usuarios/Usuarios";
import EditarUsuario from "./pages/Usuarios/EditarUsuario";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Erro />} />
      </Route>

      <Route element={<RotaProtegida />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />

          <Route
            path="/admin/lanches"
            element={<Lanches />}
          />

          <Route
            path="/admin/lanches/novo"
            element={<FormularioLanche />}
          />

          <Route
            path="/admin/lanches/editar/:id"
            element={<FormularioLanche />}
          />

          <Route
            path="/admin/categorias"
            element={<Categorias />}
          />

          <Route
            path="/admin/categorias/novo"
            element={<FormularioCategoria />}
          />

          <Route
            path="/admin/categorias/editar/:id"
            element={<FormularioCategoria />}
          />

          <Route
            path="/admin/usuarios"
            element={<Usuarios />}
          />

          <Route
            path="/admin/usuarios/novo"
            element={<Cadastro />}
          />

          <Route
            path="/admin/usuarios/editar"
            element={<EditarUsuario />}
          />

          <Route
            path="/admin/estoque"
            element={<Estoque />}
          />

          <Route
            path="/admin/estoque/novo"
            element={<FormularioEstoque />}
          />

          <Route
            path="/admin/estoque/editar/:id"
            element={<FormularioEstoque />}
          />

          <Route
            path="/admin/ingredientes"
            element={<Ingredientes />}
          />

          <Route
            path="/admin/ingredientes/novo"
            element={<FormularioIngrediente />}
          />

          <Route
            path="/admin/ingredientes/editar/:id"
            element={<FormularioIngrediente />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
