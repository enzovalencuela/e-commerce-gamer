// src/pages/Status.tsx

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import "./Status.css";

const StatusPagamento: React.FC = () => {
  const [status, setStatus] = useState("Carregando...");
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const urlStatus = searchParams.get("status");

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const checkPaymentStatus = async () => {
      if (!paymentId) return;

      try {
        const res = await fetch(
          `${VITE_BACKEND_URL}/api/payments/status/${paymentId}`
        );
        const data = await res.json();

        const paymentStatus = data.status;
        setStatus(paymentStatus);

        if (paymentStatus === "approved" || paymentStatus === "rejected") {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        setStatus("Erro ao verificar pagamento");
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    if (urlStatus === "approved") {
      setStatus("approved");
    } else {
      checkPaymentStatus();
      intervalId = setInterval(checkPaymentStatus, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentId, VITE_BACKEND_URL, urlStatus]);

  return (
    <div className="status-container">
      <h1>Status do Pagamento</h1>
      {status === "approved" && <p>✅ Pagamento aprovado!</p>}
      {status === "pending" && <p>⏳ Pagamento pendente...</p>}
      {status === "rejected" && <p>❌ Pagamento rejeitado.</p>}
      {status === "Carregando..." && <Loading />}
    </div>
  );
};

export default StatusPagamento;
