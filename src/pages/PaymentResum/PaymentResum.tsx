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
import SpanMessage from "../../components/SpanMessage/SpanMessage";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: "pt-BR",
});

const PaymentResum = () => {
  const { user, cart, selectedItems } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  });

  const navigate = useNavigate();
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";
  const spanMessage = "Operação, realizada com sucesso.";

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!user) return;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setFormSubmit(false);
    }, 1000);

    try {
      const res = await fetch(
        `${VITE_BACKEND_URL}/api/users/${user.id}/update-checkout-info`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao salvar dados do usuário");
      }

      setShowOkMessage(true);
    } catch (error) {
      console.error("Erro ao atualizar dados de checkout:", error);
      setShowErrorMessage(true);
    }
  };

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

  return (
    <div className="cart-resum-container">
      <BackButton />

      {loading && <Loading />}
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => (setShowErrorMessage(false), navigate("/carrinho"))}
          message={errorMessage}
        />
      )}
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      {formSubmit ? (
        <form onSubmit={handleSubmit} className="input_container">
          <input
            name="phone"
            placeholder="Telefone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Endereço"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            name="number"
            placeholder="Número"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <input
            name="neighborhood"
            placeholder="Bairro"
            value={formData.neighborhood}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            name="state"
            placeholder="Estado"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            name="zip"
            placeholder="CEP"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="submit-button"
            disabled={
              !formData.address ||
              !formData.city ||
              !formData.neighborhood ||
              !formData.number ||
              !formData.phone ||
              !formData.state ||
              !formData.zip
            }
          >
            Salvar informações
          </button>
          <button className="add-to-cart-btn" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </form>
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
