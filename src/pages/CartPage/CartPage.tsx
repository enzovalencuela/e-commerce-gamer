/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./CartPage.css";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import OkMessage from "../../components/OkMessage/OkMessage";
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const CartPage: React.FC = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const { user, cart, removeFromCart, selectedItems, setSelectedItems } =
    useAuth();
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";

  const handleSelect = (productId: number): void => {
    setSelectedItems((prevSelected: number[]) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (!user) return;
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      setShowErrorMessage(true);
    }
  };

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const okMessage = `Finalizando a compra de R$ ${calculateTotal()}`;

  return (
    <div className="cart-page-container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          message={errorMessage}
        />
      )}
      {showOkMessage && (
        <OkMessage
          onClose={() => setShowOkMessage(false)}
          message={okMessage}
        />
      )}

      <BackButton />
      <h1>Seu Carrinho</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
                <Link to={`/product/${item.id}`} className="cart-item-link">
                  <img
                    src={item.img}
                    alt={item.titulo}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.titulo}</h3>
                    <span>R$ {item.preco}</span>
                  </div>
                </Link>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <FontAwesomeIcon icon={faTrashCan} /> Remover
                </button>
              </div>
            ))}
          </div>
          <Link to={"/checkout"}>
            <Button
              disabled={selectedItems.length <= 0}
              child="Ir para Checkout"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
