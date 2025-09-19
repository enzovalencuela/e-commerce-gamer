// src/components/MainNavbar.tsx

import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./MainNavBar.css";
import Menu from "../Menu/Menu";

const MainNavbar: React.FC = () => {
  const [menu, setMenu] = useState(false);
  const { user, cart } = useAuth();
  const qtdItemsCart = cart.length;

  return (
    <>
      {menu && <Menu />}
      <div className="div-search">
        <Link to={"/"} className="logo_marca">
          <img src="/LOGO_MARCA.png" alt="Logo" />
        </Link>
        <SearchBar />

        <Link to={"/carrinho"}>
          <div className="cart">
            <img src="./img/car.svg" alt="Ícone de carrinho" />
            <span>{qtdItemsCart}</span>
          </div>
        </Link>
        <div onClick={() => setMenu(!menu)} className="div-user">
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
        </div>
      </div>
    </>
  );
};

export default MainNavbar;
