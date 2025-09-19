// src/pages/CartPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./CartPage.css";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import OkMessage from "../../components/OkMessage/OkMessage";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";

const CartPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const { user, cart, removeFromCart } = useAuth();
  const navigate = useNavigate();

  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    } else {
      setLoading(false);
    }
  }, [user, navigate, cart]);

  const handleSelect = (productId: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (!user) return;
    try {
      await removeFromCart(productId);
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      setShowErrorMessage(true);
    }
  };

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      setShowErrorMessage(true);
      return;
    }

    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    const itemsForPayment = selectedProducts.map((item) => ({
      title: item.titulo,
      unit_price: Number(item.preco),
      quantity: 1,
    }));

    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsForPayment,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar preferência de pagamento.");
      }

      const paymentData = await response.json();

      navigate(`/status?payment_id=${paymentData.id}`);
    } catch (error) {
      console.error("Erro no checkout:", error);
      setShowErrorMessage(true);
    }
  };

  const okMessage = `Finalizando a compra de R$ ${calculateTotal()}`;

  return loading ? (
    <Loading />
  ) : (
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
          <div className="cart-summary">
            <h2>Resumo da Compra</h2>
            <div className="summary-item">
              <span>Total de itens selecionados:</span>
              <span>{selectedItems.length}</span>
            </div>
            <div className="summary-item total">
              <span>Valor total:</span>
              <span>R$ {calculateTotal()}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
