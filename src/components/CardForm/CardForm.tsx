/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface CardFormProps {
  total: number;
  selectedItems: number[];
  onSuccess: (paymentId: string) => void;
  onError: () => void;
}

const CardForm: React.FC<CardFormProps> = ({
  total,
  selectedItems,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const mp = new window.MercadoPago(import.meta.env.VITE_PUBLIC_KEY, {
      locale: "pt-BR",
    });

    const cardForm = mp.cardForm({
      amount: total.toFixed(2),
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do cartão",
        },
        expirationDate: {
          id: "form-checkout__expirationDate",
          placeholder: "MM/AA",
        },
        securityCode: { id: "form-checkout__securityCode", placeholder: "CVV" },
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Nome no cartão",
        },
        issuer: { id: "form-checkout__issuer", placeholder: "Banco emissor" },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Número do documento",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "Email",
        },
      },
      callbacks: {
        onSubmit: async (event: { preventDefault: () => void }) => {
          event.preventDefault();
          const {
            token,
            issuerId,
            paymentMethodId,
            transactionAmount,
            installments,
            cardholderEmail,
            identificationType,
            identificationNumber,
          } = cardForm.getCardFormData();

          try {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/payments/card`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token,
                  issuerId,
                  paymentMethodId,
                  transactionAmount: transactionAmount,
                  installments,
                  email: cardholderEmail,
                  identificationType,
                  identificationNumber,
                  description: `Compra de ${selectedItems.length} itens`,
                  metadata: { user_id: user.id },
                }),
              }
            );

            const data = await res.json();
            if (data.id) {
              onSuccess(data.id);
            } else {
              onError();
            }
          } catch (err) {
            console.error("Erro pagamento cartão:", err);
            onError();
          }
        },
      },
    });
  }, [total, selectedItems]);

  return (
    <form id="form-checkout">
      <div id="form-checkout__cardNumber" className="container"></div>
      <div id="form-checkout__expirationDate" className="container"></div>
      <div id="form-checkout__securityCode" className="container"></div>
      <input
        type="text"
        id="form-checkout__cardholderName"
        placeholder="Nome impresso no cartão"
      />
      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>
      <select id="form-checkout__identificationType"></select>
      <input
        type="text"
        id="form-checkout__identificationNumber"
        placeholder="Documento"
      />
      <input
        type="email"
        id="form-checkout__cardholderEmail"
        placeholder="Email"
      />

      <button type="submit">Pagar</button>
      <progress value="0" className="progress-bar">
        Carregando...
      </progress>
    </form>
  );
};

export default CardForm;
