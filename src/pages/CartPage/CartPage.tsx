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
import CardForm from "../../components/CardForm/CardForm";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const CartPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const { user, cart, removeFromCart } = useAuth();
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";

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
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  // Checkout PIX
  const checkoutPix = async () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) return;

    const itemsForPayment = selectedProducts.map((item) => {
      const precoLimpo = String(item.preco).replace(",", ".");
      const price = Number(precoLimpo);

      return {
        title: item.titulo,
        unit_price: price,
        quantity: 1,
      };
    });

    try {
      const res = await fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsForPayment,
          user_id: user?.id,
          email: user?.email,
          payment_method: "pix",
        }),
      });

      const data = await res.json();

      if (data?.payment?.point_of_interaction?.transaction_data?.qr_code) {
        setQrCodeUrl(
          data.payment.point_of_interaction.transaction_data.qr_code
        );
        navigate(`/status?payment_id=${data.payment.id}`);
      } else {
        console.error("Resposta PIX inválida:", data);
        setShowErrorMessage(true);
      }
    } catch (err) {
      console.error("Erro no checkout PIX:", err);
      setShowErrorMessage(true);
    }
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

          <div className="cart-summary">
            <h2>Resumo da Compra</h2>
            <div className="summary-item">
              <span>Total de itens selecionados:</span>
              <span>{selectedItems.length}</span>
            </div>
            <div className="summary-item total">
              <span>Valor total:</span>
              <span>R$ {calculateTotal().toFixed(2).replace(".", ",")}</span>
            </div>

            <button
              className="checkout-btn"
              disabled={selectedItems.length === 0}
              onClick={checkoutPix}
            >
              Finalizar Compra PIX
            </button>
            <div id="card-form">
              <CardForm selectedItems={selectedItems} />
            </div>
          </div>

          {qrCodeUrl && (
            <div className="pix-qr-code">
              <h3>Escaneie o QR Code para pagar via PIX</h3>
              <img src={qrCodeUrl} alt="QR Code PIX" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
