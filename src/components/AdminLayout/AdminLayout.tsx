   import { useContext } from "react";
   import { NavLink, Outlet, useNavigate } from "react-router-dom";
   import { AuthContext } from "../../contexts/AuthContext";
   import "./AdminLayout.css";

   const linksAdmin = [
  { texto: "Dashboard", para: "/admin" },
  { texto: "Lanches", para: "/admin/lanches" },
  { texto: "Categorias", para: "/admin/categorias" },
  { texto: "Estoque", para: "/admin/estoque" },
  { texto: "Usuários", para: "/admin/usuarios" },
   { texto: "Ingredientes", para: "/admin/Ingredientes" },
];

   const AdminLayout = () => {
     const auth = useContext(AuthContext);
     const navigate = useNavigate();

     const sair = () => {
       auth.sair();
       navigate("/login");
     };

     let nome = "Admin";
     if (auth.usuario !== null) {
       nome = auth.usuario.nome;
     }

     return (
       <div>
         <div className="bg-dark text-white p-3 mb-4">
           <div className="container d-flex justify-content-between align-items-center">
             <div>
               <span className="badge bg-warning text-dark fs-6 me-3">Thiago Lanches</span>
               {linksAdmin.map((link) => (
                 <NavLink key={link.para} to={link.para} end className="admin-link text-white text-decoration-none me-3">
                   {link.texto}
                 </NavLink>
               ))}
             </div>

             <div>
               <span className="me-3">Olá, <strong>{nome}</strong></span>
               <button type="button" className="btn btn-outline-danger btn-sm" onClick={sair}>
                 Sair
               </button>
             </div>
           </div>
         </div>

         <div className="container mb-5">
           <Outlet />
         </div>
       </div>
     );
   };

   export default AdminLayout;