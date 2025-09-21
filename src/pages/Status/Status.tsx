// src/pages/Status/Status.tsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Status.css";
import BackButton from "../../components/BackButton/BackButton";

interface PixInfo {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
}

interface PaymentStatus {
  id: number;
  status: string;
  status_detail?: string;
  total_amount?: number;
  payment_type?: string;
  payment_method?: string;
  date_approved?: string;
  pix?: PixInfo;
}

const StatusPagamento: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get("payment_id");

    if (!paymentId || !user) {
      navigate("/");
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/payments/${paymentId}/status`
        );

        const data = await response.json();
        if (response.ok && data.payment) {
          setPaymentStatus(data.payment);
        } else {
          console.error("Erro ao obter status do pagamento:", data.error);
          setPaymentStatus(null);
        }
      } catch (error) {
        console.error("Erro de rede ao buscar status:", error);
        setPaymentStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [location.search, navigate, user, VITE_BACKEND_URL]);

  if (loading) {
    return (
      <div className="status-container">
        <h1>Carregando status do pagamento...</h1>
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="status-container">
        <h1>Erro ao carregar o status do pagamento.</h1>
        <p>Tente novamente mais tarde ou entre em contato com o suporte.</p>
      </div>
    );
  }

  return (
    <div className="status-container">
      <BackButton />
      {paymentStatus.payment_type === "pix" &&
        paymentStatus.status === "pending" && (
          <div className="status-pending">
            <h2>Pagamento Pendente</h2>
            <p>Seu pagamento via PIX está aguardando a confirmação.</p>
            {paymentStatus.pix?.qr_code_base64 && (
              <div className="pix-qr-code">
                <h3>Escaneie o QR Code</h3>
                <img
                  src={`data:image/png;base64,${paymentStatus.pix.qr_code_base64}`}
                  alt="QR Code PIX"
                />
                <p>Valor: R$ {paymentStatus.total_amount?.toFixed(2)}</p>
              </div>
            )}
            <p>Você pode copiar o código PIX abaixo para pagar no seu banco.</p>
            <div className="pix-code-container">
              <span>{paymentStatus.pix?.qr_code}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    paymentStatus.pix?.qr_code || ""
                  )
                }
              >
                Copiar código
              </button>
            </div>
            {paymentStatus.pix?.ticket_url && (
              <p>
                Ou <a href={paymentStatus.pix.ticket_url}>clique aqui</a> para
                abrir no app do seu banco.
              </p>
            )}
          </div>
        )}

      {/* Caso seja cartão aprovado */}
      {paymentStatus.payment_type === "credit_card" &&
        paymentStatus.status === "approved" && (
          <div className="status-approved">
            <h2>Pagamento Aprovado!</h2>
            <p>
              Obrigado pela sua compra. Seu pedido será processado em breve.
            </p>
            <p>
              Cartão: {paymentStatus.payment_method?.toUpperCase()} <br />
              Data: {new Date(paymentStatus.date_approved!).toLocaleString()}
            </p>
          </div>
        )}

      {/* Caso rejeitado */}
      {paymentStatus.status === "rejected" && (
        <div className="status-rejected">
          <h2>Pagamento Rejeitado</h2>
          <p>Detalhes: {paymentStatus.status_detail}</p>
          <p>Tente novamente ou use outro método de pagamento.</p>
        </div>
      )}
    </div>
  );
};

export default StatusPagamento;
