/*
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type PixFormProps = {
  onSuccess: (paymentId: string) => void;
  onError: () => void;
};

const PixForm: React.FC<PixFormProps> = ({ onSuccess, onError }) => {
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const { user, selectedItems } = useAuth();

  const handlePixPayment = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            email,
            cpf: cpf.replace(/\D/g, ""),
            payment_method: "pix",
            product_ids: selectedItems,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.id) {
        onSuccess(data.id);
      } else {
        onError();
      }
    } catch (err) {
      console.error("Erro no pagamento PIX:", err);
      onError();
    }
  };

  return (
    <div className="payment-methods">
      <div className="input_container">
        <label className="input_label">CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
          className="input_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          className="input_field"
        />
      </div>
      <button
        className="purchase--btn"
        disabled={cpf.length < 11 || cpf.length > 11 || !email}
        onClick={handlePixPayment}
      >
        Finalizar Compra PIX
      </button>
    </div>
  );
};

export default PixForm;
*/
