import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CardForm from "../../components/CardForm/CardForm";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import "./PaymentResum.css";

const PaymentResum = () => {
  const [qrCodeUrl] = useState<string | null>(null);
  const [cpf, setCpf] = useState<string>("");
  const { user, cart, selectedItems } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";
  const navigate = useNavigate();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const checkoutPix = async () => {
    const productIdsForPayment = selectedItems;

    if (productIdsForPayment.length === 0 || !cpf) {
      setShowErrorMessage(true);
      return;
    }

    try {
      const res = await fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_ids: productIdsForPayment,
          user_id: user?.id,
          email: user?.email,
          cpf: cpf,
          payment_method: "pix",
        }),
      });

      const data = await res.json();

      if (res.ok && data?.payment?.id) {
        // A resposta do back-end é um sucesso, e ela contém o ID do pagamento
        navigate(`/status?payment_id=${data.payment.id}`);
      } else {
        console.error("Resposta inválida ou erro no back-end:", data);
        setShowErrorMessage(true);
      }
    } catch (err) {
      console.error("Erro no checkout PIX:", err);
      setShowErrorMessage(true);
    }
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
        <div className="input_container">
          <label className="input_label">CPF ( somente números )</label>
          <input
            placeholder="000.000.000-00"
            title=""
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="input_field"
            id="cpf-input"
            required
          />
        </div>
        <button
          className="purchase--btn"
          disabled={selectedItems.length === 0 || cpf.length < 11}
          onClick={checkoutPix}
        >
          Finalizar Compra PIX
        </button>
        <div id="card-form-container">
          <CardForm
            selectedItems={selectedItems}
            calculateTotal={calculateTotal}
            cpf={cpf}
          />
        </div>
      </div>

      {qrCodeUrl && (
        <div className="pix-qr-code">
          <h3>Escaneie o QR Code para pagar via PIX</h3>
          <img src={qrCodeUrl} alt="QR Code PIX" />
        </div>
      )}
    </div>
  );
};

export default PaymentResum;
