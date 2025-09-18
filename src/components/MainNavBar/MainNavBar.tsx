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
  const { user, cart } = useAuth();
  const qtdItemsCart = cart.length;

  return (
    <div className="div-search">
      <Link to={"/"} className="logo_marca">
        <img src="/LOGO_MARCA.png" alt="Logo" />
      </Link>
      <SearchBar onSearch={onSearch} />

      <Link to={"/carrinho"}>
        <div className="cart">
          <img src="./img/car.svg" alt="Ícone de carrinho" />
          <span>{qtdItemsCart}</span>
        </div>
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
