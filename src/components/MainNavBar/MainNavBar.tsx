// src/components/MainNavbar.tsx

import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./MainNavBar.css";
import Menu from "../Menu/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const MainNavbar: React.FC = () => {
  const [menu, setMenu] = useState(false);
  const { user, cart } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const qtdItemsCart = cart.length;
  const navigate = useNavigate();

  const displayName = user
    ? user.name || user.displayName || user.email || "Usuário"
    : "Faça login!";

  return (
    <>
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
      )}
      {menu && <Menu />}
      <div className="div-search">
        <Link to={"/"} className="logo_marca">
          <img src="/LOGO_MARCA.png" alt="Logo" />
        </Link>
        <SearchBar />

        <Link
          to={user ? "/carrinho" : ""}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              setShowErrorMessage(true);
            }
          }}
        >
          <div className="cart">
            <FontAwesomeIcon className="cart-icon" icon={faCartShopping} />
            <span>{qtdItemsCart}</span>
          </div>
        </Link>
        <div
          onClick={user ? () => setMenu(!menu) : () => navigate("/login")}
          className="div-user"
        >
          <FontAwesomeIcon className="user-icon" icon={faUser} />
          <p>
            Olá,
            <br />
            {displayName}
          </p>
        </div>
      </div>
    </>
  );
};

export default MainNavbar;
