/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import { Payment } from "@mercadopago/sdk-react";

import "./PaymentResum.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

interface PaymentResponse {
  payment: {
    payment_method_id: string;
    point_of_interaction: {
      transaction_data: {
        qr_code: string;
        qr_code_base64: string;
      };
    };
  };
}

interface PixResponse {
  qrCode: string;
  qrCodeBase64: string;
}

const PaymentResum = () => {
  const { user, cart, selectedItems } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState<PaymentResponse | null>(null);
  const [pixInfo, setPixInfo] = useState<PixResponse | null>(null);
  const navigate = useNavigate();
  const errorMessage = "Não foi possível fazer a operação. Tente novamente.";

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const calculateTotal = () => {
    if (!cart || !selectedItems) {
      return 0;
    }
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const totalAmount = calculateTotal();

  useEffect(() => {
    if (totalAmount <= 1) {
      setTimeout(() => {
        navigate("/carrinho");
      }, 3000);
    }
  }, [totalAmount, navigate]);

  const initialization = {
    amount: totalAmount,
  };
  const customization = {
    paymentMethods: {
      ticket: ["all"],
      bankTransfer: "all",
      creditCard: "all",
      prepaidCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };

  const onSubmit = async ({ formData }: { formData: Record<string, any> }) => {
    setLoading(true);
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
          setDataInfo(data);
          setLoading(false);
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
    console.log(error);
  };
  const onReady = async () => {
    setLoading(false);
  };

  useEffect(() => {
    if (dataInfo && dataInfo.payment.payment_method_id === "pix") {
      const transactionData =
        dataInfo.payment.point_of_interaction.transaction_data;
      setPixInfo({
        qrCode: transactionData.qr_code,
        qrCodeBase64: transactionData.qr_code_base64,
      });
    }
  }, [dataInfo]);

  if (totalAmount <= 1) {
    return null;
  }

  return (
    <div className="cart-resum-container">
      <BackButton />
      {loading ? (
        <Loading />
      ) : (
        <>
          {showErrorMessage && (
            <ErrorMessage
              onClose={() => setShowErrorMessage(false)}
              message={errorMessage}
            />
          )}
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
            {totalAmount > 0 && (
              <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
              />
            )}
            {pixInfo && (
              <div className="pix-qr-code">
                <h2>Pague com PIX</h2>
                <img
                  src={`data:image/png;base64,${pixInfo.qrCodeBase64}`}
                  alt="QR Code Pix"
                />
                <p>{pixInfo.qrCode}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(pixInfo.qrCode)}
                >
                  Copiar código PIX
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentResum;
