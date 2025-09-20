import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import PixForm from "../../components/PixForm/PixForm";
import CardForm from "../../components/CardForm/CardForm";
import "./PaymentResum.css";

const PaymentResum = () => {
  const { cart, selectedItems } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | null>(
    null
  );
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  return (
    <div className="cart-resum-container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          message={errorMessage}
        />
      )}
      <BackButton />
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

        {/* Seleção do método de pagamento */}
        <div className="payment-methods">
          <h3>Escolha a forma de pagamento</h3>
          <button
            className={`method-btn ${paymentMethod === "pix" ? "active" : ""}`}
            onClick={() => setPaymentMethod("pix")}
          >
            Pagar com PIX
          </button>
          <button
            className={`method-btn ${paymentMethod === "card" ? "active" : ""}`}
            onClick={() => setPaymentMethod("card")}
          >
            Pagar com Cartão
          </button>
        </div>

        {paymentMethod === "pix" && (
          <PixForm
            onSuccess={(paymentId) =>
              navigate(`/status?payment_id=${paymentId}`)
            }
            onError={() => setShowErrorMessage(true)}
          />
        )}

        {paymentMethod === "card" && (
          <CardForm
            total={calculateTotal()}
            selectedItems={selectedItems}
            onSuccess={(paymentId) =>
              navigate(`/status?payment_id=${paymentId}`)
            }
            onError={() => setShowErrorMessage(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentResum;
