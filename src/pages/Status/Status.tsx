// src/pages/StatusPagamento.tsx (ou o nome que você deu ao arquivo)

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function StatusPagamento() {
  const [status, setStatus] = useState("Carregando...");
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (paymentId) {
      fetch(`/api/payments/status/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          const paymentStatus = data.database?.status || data.provider?.status;
          setStatus(paymentStatus);
        })
        .catch(() => setStatus("Erro ao verificar pagamento"));
    }
  }, [paymentId]);

  return (
    <div>
      <h1>Status do Pagamento</h1>
      {status === "approved" && <p>✅ Pagamento aprovado!</p>}
      {status === "pending" && <p>⏳ Pagamento pendente...</p>}
      {status === "rejected" && <p>❌ Pagamento rejeitado.</p>}
      {status === "Carregando..." && <p>Carregando...</p>}
      {status &&
        status !== "approved" &&
        status !== "pending" &&
        status !== "rejected" &&
        status !== "Carregando..." && <p>Status desconhecido: {status}</p>}
    </div>
  );
}

export default StatusPagamento;
