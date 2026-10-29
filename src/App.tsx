
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import RotasAdmin from "./RotasAdmin";

import Home from "./pages/Home/Home";
import Cardapio from "./pages/Cardapio/Cardapio";
import Sobre from "./pages/Sobre/Sobre";
import Login from "./pages/Login/Login";
import Erro from "./pages/Erro/Erro";

const App = () => {
  return (
    <Routes>

      {/* Site público */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Erro />} />
      </Route>

      {/* Área administrativa */}
      <Route
        path="/admin/*"
        element={<RotasAdmin />}
      />

    </Routes>
  );
};

export default App;
