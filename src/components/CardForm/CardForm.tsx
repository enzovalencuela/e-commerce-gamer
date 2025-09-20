/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/CardForm/CardForm.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./CardForm.css";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

type CardFormProps = {
  selectedItems: number[];
  calculateTotal: () => number;
  cpf: string;
};

const CardForm: React.FC<CardFormProps> = ({
  selectedItems,
  calculateTotal,
  cpf,
}) => {
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.MercadoPago) {
      const mp = new window.MercadoPago("YOUR_PUBLIC_KEY", {
        locale: "pt-BR",
      });

      const cardForm = mp.cardForm({
        amount: calculateTotal().toFixed(2), // Use a função para obter o valor
        iframe: true,
        form: {
          id: "form-checkout",
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Nome do titular",
          },
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número do cartão",
          },
          cardExpirationMonth: {
            id: "form-checkout__cardExpirationMonth",
            placeholder: "MM",
          },
          cardExpirationYear: {
            id: "form-checkout__cardExpirationYear",
            placeholder: "YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "CVV",
          },
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
        },
        callbacks: {
          onReady: () => {
            console.log("Formulário de cartão pronto!");
          },
          onSubmit: async (event: any) => {
            event.preventDefault();

            try {
              const cardData = await cardForm.get; // O `get` é um método assíncrono
              const { token, installments, paymentMethodId, issuerId } =
                cardData;

              const response = await fetch(
                `${VITE_BACKEND_URL}/api/payments/create`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token,
                    installments,
                    payment_method: "card",
                    card_brand: paymentMethodId,
                    issuer_id: issuerId,
                    product_ids: selectedItems,
                    user_id: user?.id,
                    email: user?.email,
                    cpf: cpf,
                    amount: calculateTotal(),
                    description: "Sua compra no E-commerce",
                  }),
                }
              );

              const data = await response.json();
              if (response.ok && data?.payment?.id) {
                navigate(`/status?payment_id=${data.payment.id}`);
              } else {
                console.error("Erro ao criar pagamento:", data.error); // Exiba uma mensagem de erro na tela
              }
            } catch (error) {
              console.error("Erro no checkout do cartão:", error);
            }
          },
          onError: (error: any) => {
            console.error("Erro no formulário de cartão:", error);
          },
        },
      });
    }
  }, [cpf, selectedItems, navigate, VITE_BACKEND_URL, calculateTotal, user]);

  return (
    <form id="form-checkout">
      <div className="input_container">
        <label className="input_label">Número do Cartão</label>
        <input
          type="text"
          id="form-checkout__cardNumber"
          className="input_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">Nome do Titular</label>
        <input
          type="text"
          id="form-checkout__cardholderName"
          className="input_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">Data de Validade</label>
        <div className="split">
          <input
            type="text"
            id="form-checkout__cardExpirationMonth"
            placeholder="MM"
            className="input_field"
          />
          <input
            type="text"
            id="form-checkout__cardExpirationYear"
            placeholder="YY"
            className="input_field"
          />
        </div>
      </div>
      <div className="input_container">
        <label className="input_label">CVV</label>
        <input
          type="text"
          id="form-checkout__securityCode"
          placeholder="CVV"
          className="input_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">Tipo de Documento</label>
        <select
          id="form-checkout__identificationType"
          className="input_field"
        ></select>
      </div>
      <div className="input_container">
        <label className="input_label">Número do Documento</label>
        <input
          type="text"
          id="form-checkout__identificationNumber"
          className="input_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">Parcelas</label>
        <select
          id="form-checkout__installments"
          className="input_field"
        ></select>
      </div>
      <button className="purchase--btn" type="submit">
        Pagar
      </button>
    </form>
  );
};

export default CardForm;
