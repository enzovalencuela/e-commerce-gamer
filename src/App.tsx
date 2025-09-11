// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Função para buscar o saldo do back-end
  const fetchBalance = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/balance");
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      } else {
        console.error("Erro ao buscar saldo:", data.error);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  // Chama a função de busca de saldo quando o componente é montado
  useEffect(() => {
    fetchBalance();
  }, []);

  const handlePayment = async () => {
    if (amount <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/payments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.init_point;
      } else {
        alert(`Erro ao criar pagamento: ${data.error}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao se conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Dashboard de Pagamentos</h1>
      </header>
      <div className="balance-card">
        <h2>Seu Saldo Atual</h2>
        <p>
          {balance !== null
            ? `R$ ${Number(balance).toFixed(2).replace(".", ",")}`
            : "Carregando..."}
        </p>
      </div>
      <main className="main">
        <p>Insira o valor que deseja adicionar ao seu saldo:</p>
        <div className="input-group">
          <span>R$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            step="0.01"
            placeholder="0,00"
            className="input-amount"
          />
        </div>
        <button
          className="button-pay"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? "Redirecionando..." : "Pagar com Mercado Pago"}
        </button>
      </main>
    </div>
  );
}

export default App;
