// src/pages/Account.tsx

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redireciona para a página de login após o logout
  };

  // Se o usuário não existir (proteção adicional), redireciona
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="account-container">
      <h2>Minha Conta</h2>
      <div className="user-info">
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Sair
      </button>
    </div>
  );
};

export default Account;
