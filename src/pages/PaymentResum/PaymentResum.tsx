/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import { Payment } from "@mercadopago/sdk-react";
import "./PaymentResum.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { initMercadoPago } from "@mercadopago/sdk-react";
import FormDados from "../../components/FormDados/FormDados";
import SpanMessage from "../../components/SpanMessage/SpanMessage";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: "pt-BR",
});

const PaymentResum = () => {
  const { user, cart, selectedItems, setAtualizarQuery } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const spanMessage = "Operação, realizada com sucesso.";

  const navigate = useNavigate();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!user) return;

  const calculateTotal = () => {
    if (!cart || !selectedItems) {
      return 0;
    }
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const totalAmount = calculateTotal();

  if (totalAmount <= 1) {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  const initialization = {
    amount: totalAmount,
  };

  const customization = {
    paymentMethods: {
      ticket: [],
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      maxInstallments: 12,
    },
  };

  const onSubmit = async ({ formData }: { formData: Record<string, any> }) => {
    if (!user || totalAmount <= 0) {
      setShowErrorMessage(true);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product_ids: selectedItems,
          user_id: user.id,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro no pagamento");
          return response.json();
        })
        .then((data) => {
          console.log("Pagamento processado:", data);
          setLoading(false);
          const id = data.payment.id;
          navigate(`/status?payment_id=${id}`);
          setAtualizarQuery(true);
          resolve();
        })
        .catch((error) => {
          setLoading(false);
          setShowErrorMessage(true);
          console.error("Erro ao processar pagamento", error);
          reject();
        });
    });
  };

  const onError = async (error: any) => {
    setLoading(false);
    console.log("Erro:", error);
  };

  const onReady = async () => {
    setLoading(false);
  };

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return loading ? (
    <Loading />
  ) : (
    <div className="cart-resum-container">
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      <BackButton />
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => (setShowErrorMessage(false), navigate("/carrinho"))}
        />
      )}
      {formSubmit ? (
        <FormDados
          setShowErrorMessage={setShowErrorMessage}
          setFormSubmit={setFormSubmit}
          setShowOkMessage={setShowOkMessage}
        />
      ) : (
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
          <button className="submit-button" onClick={() => setFormSubmit(true)}>
            Atualizar dados pessoais
          </button>
          {totalAmount > 0 && (
            <Payment
              initialization={initialization}
              customization={customization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentResum;
