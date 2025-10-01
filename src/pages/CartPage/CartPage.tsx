import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./CartPage.css";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import { usePayment } from "../../contexts/PaymentContext";

const CartPage: React.FC = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    user,
    cart,
    removeFromCart,
    selectedItems,
    setSelectedItems,
    loading,
  } = useAuth();
  const { totalAmount } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowErrorMessage(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  const handleSelect = (productId: number): void => {
    setSelectedItems((prevSelected: number[]) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      setShowErrorMessage(true);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="cart-page-container">
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
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
              <span>R$ {totalAmount.toFixed(2).replace(".", ",")}</span>
            </div>
            {totalAmount > 0 && (
              <Link to={"/checkout"}>
                <Button
                  disabled={selectedItems.length <= 0}
                  child="Ir para Checkout"
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
