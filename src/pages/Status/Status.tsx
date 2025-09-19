/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Status.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import "./Status.css";

const StatusPagamento: React.FC = () => {
  const [status, setStatus] = useState<
    "loading" | "approved" | "pending" | "rejected" | "error"
  >("loading");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | null>(
    null
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5); // contador regressivo em segundos

  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const urlStatus = searchParams.get("status");

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    try {
      const res = await fetch(
        `${VITE_BACKEND_URL}/api/payments/status/${paymentId}`
      );
      const data = await res.json();

      const dbStatus = data.database?.status;
      const providerPayment = data.provider;

      if (
        paymentMethod === "pix" &&
        providerPayment?.point_of_interaction?.transaction_data?.qr_code
      ) {
        setQrCodeUrl(
          providerPayment.point_of_interaction.transaction_data.qr_code
        );
      }

      if (
        paymentMethod === "pix" &&
        providerPayment?.point_of_interaction?.transaction_data?.qr_code
      ) {
        setQrCodeUrl(
          providerPayment.point_of_interaction.transaction_data.qr_code
        );
      }

      if (dbStatus === "approved") setStatus("approved");
      else if (dbStatus === "rejected") setStatus("rejected");
      else setStatus("pending");
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatus("error");
    }
  };

  // Polling com contador regressivo
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let countdownId: NodeJS.Timeout | null = null;

    if (urlStatus === "approved") {
      setStatus("approved");
      setPaymentMethod("card");
    } else if (urlStatus === "rejected") {
      setStatus("rejected");
      setPaymentMethod("card");
    } else {
      checkPaymentStatus();
      intervalId = setInterval(() => {
        checkPaymentStatus();
        setCountdown(5); // reseta o contador a cada verificação
      }, 5000);

      // contador regressivo visual
      countdownId = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 5));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (countdownId) clearInterval(countdownId);
    };
  }, [paymentId, urlStatus, VITE_BACKEND_URL, paymentMethod]);

  const renderMessage = () => {
    switch (status) {
      case "loading":
        return <Loading />;
      case "approved":
        return <p>✅ Pagamento aprovado! Seu saldo foi atualizado.</p>;
      case "pending":
        if (paymentMethod === "pix") {
          return (
            <>
              <p>
                ⏳ Pagamento via PIX pendente. Escaneie o QR Code abaixo para
                pagar. Assim que confirmado, seu saldo será atualizado
                automaticamente.
              </p>
              {qrCodeUrl && (
                <div className="pix-qr-code">
                  <img src={qrCodeUrl} alt="QR Code PIX" />
                </div>
              )}
              <p>Verificando status em {countdown} segundos...</p>
              <Loading />
            </>
          );
        } else {
          return (
            <>
              <p>⏳ Pagamento pendente...</p>
              <Loading />
            </>
          );
        }
      case "rejected":
        return (
          <p>❌ Pagamento rejeitado. Tente novamente ou use outro método.</p>
        );
      case "error":
        return (
          <p>⚠️ Erro ao verificar pagamento. Tente recarregar a página.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="status-container">
      <h1>Status do Pagamento</h1>
      {renderMessage()}
    </div>
  );
};

export default StatusPagamento;
