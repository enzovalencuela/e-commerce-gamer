import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faUser,
  faDashboard,
} from "@fortawesome/free-solid-svg-icons";
import "./Menu.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import { useState } from "react";

export default function Menu() {
  const [showMenu, setShowMenu] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${showMenu} menu-container`}
      onClick={() => setShowMenu("true")}
    >
      <div className="div-menu">
        <ProtectedRoute requiredRole="admin">
          <Link to={"/dashboard"}>
            <button>
              <FontAwesomeIcon icon={faDashboard} />
              Dashboard
            </button>
          </Link>
        </ProtectedRoute>
        <Link to={"/account"}>
          <button>
            <FontAwesomeIcon icon={faUser} />
            Minha Conta
          </button>
        </Link>
        <button onClick={() => handleLogout()}>
          <FontAwesomeIcon icon={faDoorOpen} />
          Sair
        </button>
      </div>
    </div>
  );
}
