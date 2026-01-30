import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>

      {(user.roles.includes("Administrateur") ||
        user.roles.includes("Secretaire")) && (
        <>
          <Link to="/patients/add">Ajouter patient</Link>
          <Link to="/rendezvous/add">Ajouter RDV</Link>
        </>
      )}

      <button onClick={logout}>Déconnexion</button>
    </nav>
  );
}
