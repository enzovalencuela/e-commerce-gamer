// src/pages/Status/Status.tsx

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Status.css";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
const StatusPagamento: React.FC = () => {
  const { paymentStatus, purchasedProducts, loading } = useAuth();
  const navigate = useNavigate();

  if (!paymentStatus) {
    return (
      <div className="status-container">
        <BackButton />
        <h1>Erro ao carregar o status do pagamento.</h1>
        <p>Tente novamente mais tarde ou entre em contato com o suporte.</p>
      </div>
    );
  }

  return loading ? (
    <Loading />
  ) : (
    <div className="status-container">
      {purchasedProducts.length > 0 && (
        <>
          <h3>Produtos:</h3>
          <div className="card_container_comprados">
            {purchasedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="product_comprados"
              >
                <img src={product.img} alt={product.titulo} />
                <div className="produto__text">
                  <h3>{product.titulo}</h3>
                  <p>R${product.preco_original} </p>
                  <h4>R$ {product.preco}</h4>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <BackButton />
      {paymentStatus.status === "pending" && (
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
              <p>Valor: R$ {paymentStatus.total_amount}</p>
            </div>
          )}
          <p>Você pode copiar o código PIX abaixo para pagar no seu banco.</p>
          <div className="pix-code-container">
            <span>{paymentStatus.pix?.qr_code}</span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(paymentStatus.pix?.qr_code || "")
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

      <div className={`${paymentStatus.status}`}>
        {paymentStatus.status === "approved" ? (
          <>
            <h2>Pagamento Aprovado!</h2>
            <p>
              Obrigado pela sua compra. Seu pedido será processado em breve.
            </p>
          </>
        ) : (
          <>
            <h2>Pagamento Rejeitado!</h2>
            <p>Tente novamente ou use outro método de pagamento.</p>
          </>
        )}
        <p>Data: {new Date(paymentStatus.date_approved!).toLocaleString()}</p>
        <p>
          Método de pagamento: {paymentStatus.payment_method?.toUpperCase()}
        </p>
        <p>Detalhes: {paymentStatus.status_detail}</p>
        <p>Valor Total: R${paymentStatus.total_amount}</p>
        <p>Parcelamento: {paymentStatus.installments}</p>
      </div>
    </div>
  );
};

export default StatusPagamento;
