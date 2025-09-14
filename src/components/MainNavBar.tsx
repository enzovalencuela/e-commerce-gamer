// src/components/MainNavbar.tsx

import React from "react";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface MainNavbarProps {
  onSearch: (query: string) => void;
  onMenuClick: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ onSearch, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="div-search">
      <img
        id="img-menu"
        src="./img/menu.svg"
        alt="Menu"
        onClick={onMenuClick}
      />
      <img src="/LOGO_MARCA.png" alt="Logo" className="logo_marca" />
      <SearchBar onSearch={onSearch} />
      <Link to={user ? "/account" : "/login"} className="div-user">
        <img
          id="icon_person"
          src="./img/icon_person.svg"
          alt="Ícone de perfil"
        />
        <p>
          Olá,
          <br />
          {user ? user.name : "Faça login!"}
        </p>
      </Link>
      <img src="./img/car.svg" alt="Ícone de carrinho" />
    </div>
  );
};

export default MainNavbar;
