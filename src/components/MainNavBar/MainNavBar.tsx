// src/components/MainNavbar.tsx

import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./MainNavBar.css";

interface MainNavbarProps {
  onSearch: (query: string) => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ onSearch }) => {
  const { user } = useAuth();

  return (
    <div className="div-search">
      <img src="/LOGO_MARCA.png" alt="Logo" className="logo_marca" />
      <SearchBar onSearch={onSearch} />

      <Link to={"/carrinho"}>
        <img src="./img/car.svg" alt="Ícone de carrinho" />
      </Link>
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
    </div>
  );
};

export default MainNavbar;
