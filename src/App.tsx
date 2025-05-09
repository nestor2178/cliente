import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import AdvancedSearch from "./features/notes/AdvancedSearch"; 
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import PrintableNoteWrapper from "./features/notes/PrintableNoteWrapper";

function App() {
  useTitle("MC Tecnologias");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* rutas publicas */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                  <Route path="print/:id" element={<PrintableNoteWrapper />} />
                </Route>

                <Route path="search" element={<AdvancedSearch />} /> {/* Nueva ruta para la búsqueda avanzada */}
              </Route>
              {/* End Dash Fin del guion*/}
            </Route>
          </Route>
        </Route>
        {/* Fin de rutas protegidas */}
      </Route>
    </Routes>
  );
}

export default App;
