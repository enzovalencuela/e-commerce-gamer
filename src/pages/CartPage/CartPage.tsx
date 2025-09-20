/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

  useEffect(() => {
    if (!user || !window.MercadoPago) return;

    const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
      locale: "pt-BR",
    });

    const cardForm = mp.cardForm({
      amount: `${calculateTotal()}`,
      autoMount: true,
      form: {
        id: "form-checkout",
        cardholderName: { id: "form-checkout__cardholderName" },
        cardNumber: { id: "form-checkout__cardNumber" },
        cardExpirationMonth: { id: "form-checkout__cardExpirationMonth" },
        cardExpirationYear: { id: "form-checkout__cardExpirationYear" },
        securityCode: { id: "form-checkout__securityCode" },
        installments: { id: "form-checkout__installments" },
        identificationType: { id: "form-checkout__identificationType" },
        identificationNumber: { id: "form-checkout__identificationNumber" },
        issuer: { id: "form-checkout__issuer" },
        email: { id: "form-checkout__email" },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) console.error("Erro ao montar CardForm:", error);
        },
        onSubmit: async (event: any) => {
          event.preventDefault();

          const formData = cardForm.getCardFormData();

          const selectedProducts = cart.filter((item) =>
            selectedItems.includes(item.id)
          );

          const itemsForPayment = selectedProducts.map((item) => ({
            title: item.titulo,
            unit_price: Number(item.preco),
            quantity: 1,
          }));

          try {
            const res = await fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user?.id,
                email: formData.email,
                payment_method: "card",
                card_token: formData.token,
                card_brand: formData.card?.issuer?.name?.toLowerCase(),
                items: itemsForPayment,
              }),
            });

            const data = await res.json();

            if (data?.payment?.status === "approved") {
              setShowOkMessage(true);
              navigate(`/status?payment_id=${data.payment.id}`);
            } else {
              console.error("Pagamento não aprovado:", data);
              setShowErrorMessage(true);
            }
          } catch (err) {
            console.error("Erro no checkout de cartão:", err);
            setShowErrorMessage(true);
          }
        },
      },
    });
  }, [user, cart, selectedItems]);

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
