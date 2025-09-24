import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faUser,
  faDashboard,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import "./Menu.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Menu() {
  const [showMenu, setShowMenu] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      setUserAdmin(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`${showMenu} menu-container`}
      onClick={() => setShowMenu("true")}
    >
      <div className="div-menu">
        {userAdmin && (
          <Link to={"/dashboard"}>
            <button>
              <FontAwesomeIcon icon={faDashboard} />
              Dashboard
            </button>
          </Link>
        )}
        <Link to={"/account"}>
          <button>
            <FontAwesomeIcon icon={faUser} />
            Minha Conta
          </button>
        </Link>
        <Link to={"/minhas-compras"}>
          <button>
            <FontAwesomeIcon icon={faBagShopping} />
            Minha Compras
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
