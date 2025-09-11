// src/pages/Success.tsx

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";

const SuccessPage = () => {
  const location = useLocation();

  // Esta função irá recarregar a página principal quando o usuário voltar
  // garantindo que o saldo seja buscado novamente.
  useEffect(() => {
    // Isso é um truque para forçar a atualização do saldo no dashboard
    // quando o usuário retorna.
    if (location.pathname === "/success") {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 3000); // Redireciona após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="container">
      <header className="header">
        <h1>Pagamento Aprovado!</h1>
      </header>
      <main className="main">
        <p>O seu saldo será atualizado em breve. Obrigado!</p>
        <Link to="/" className="button-pay">
          Voltar para o Dashboard
        </Link>
      </main>
    </div>
  );
};

export default SuccessPage;
