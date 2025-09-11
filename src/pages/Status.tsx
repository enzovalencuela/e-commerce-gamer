// src/pages/Status.tsx

import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const StatusPage = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState("Pendente...");
  const [balance, setBalance] = useState<number | null>(null);

  const API_BASE_URL = "https://sua-api.vercel.app"; // URL da sua API na Vercel

  const fetchPaymentStatus = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/status/${id}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentStatus(data.status);
      } else {
        setPaymentStatus("Erro ao verificar status.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setPaymentStatus("Erro ao verificar status.");
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/balance`);
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("payment_id");

    if (paymentId) {
      // Verifica o status a cada 3 segundos
      const interval = setInterval(() => {
        fetchPaymentStatus(paymentId);
      }, 3000);

      // Limpa o intervalo quando o componente é desmontado
      return () => clearInterval(interval);
    }
  }, [location]);

  // Atualiza o saldo quando o status do pagamento for aprovado
  useEffect(() => {
    if (paymentStatus === "approved") {
      fetchBalance();
    }
  }, [paymentStatus]);

  return (
    <div className="container">
      <header className="header">
        <h1>Status do Pagamento</h1>
      </header>
      <main className="main">
        <p>Status: {paymentStatus}</p>
        {balance !== null && (
          <div className="balance-card">
            <h2>Seu Novo Saldo</h2>
            <p>R$ {Number(balance).toFixed(2).replace(".", ",")}</p>
          </div>
        )}
        <Link to="/" className="button-pay" style={{ marginTop: "20px" }}>
          Voltar para o Dashboard
        </Link>
      </main>
    </div>
  );
};

export default StatusPage;
