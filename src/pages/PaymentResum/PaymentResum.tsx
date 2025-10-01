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
import { usePayment } from "../../contexts/PaymentContext";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: "pt-BR",
});

const PaymentResum = () => {
  const { selectedItems, loading } = useAuth();
  const {
    totalAmount,
    showErrorMessage,
    onSubmit,
    onError,
    onReady,
    setShowErrorMessage,
  } = usePayment();
  const [formSubmit, setFormSubmit] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const spanMessage = "Operação, realizada com sucesso.";

  const navigate = useNavigate();

  if (totalAmount <= 1) {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  const initialization = {
    amount: parseFloat(totalAmount.toFixed(2)),
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
        <>
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
            <button
              className="submit-button"
              onClick={() => setFormSubmit(true)}
            >
              Atualizar dados pessoais
            </button>
          </div>
          <div>
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
        </>
      )}
    </div>
  );
};

export default PaymentResum;
