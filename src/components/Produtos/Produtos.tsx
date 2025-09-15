// src/components/Produtos/Produtos.tsx

import React, { useState } from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import "./Produtos.css";
import OkMessage from "../OkMessage/OkMessage";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Product {
  id: number;
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  img: string;
}

interface ProdutosProps {
  products: Product[];
  sectionTitle: string;
}

const Produtos: React.FC<ProdutosProps> = ({ products, sectionTitle }) => {
  const handleBuyProduct = async (productId: number) => {
    try {
      const productToBuy = products.find((p) => p.id === productId);

      if (!productToBuy) {
        alert("Produto não encontrado.");
        return;
      }

      const productData = {
        title: productToBuy.titulo,
        unit_price: parseFloat(productToBuy.preco.replace(",", ".")),
        quantity: 1,
      };

      const response = await fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a preferência de pagamento.");
      }

      const data = await response.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Erro na compra:", error);
      alert("Ocorreu um erro ao processar seu pagamento. Tente novamente.");
    }
  };

  const emBreveMessage =
    "Essa sessão estará disponível em breve. Agredeço a compreensão!";
  const [showEmBreveMessage, setShowEmBreveMessage] = useState(false);

  return (
    <section className="section-produtos">
      {showEmBreveMessage && (
        <OkMessage
          message={emBreveMessage}
          onClose={() => setShowEmBreveMessage(false)}
        />
      )}
      <div className="div-produtos__title">
        <h2>{sectionTitle}</h2>
        <button onClick={() => setShowEmBreveMessage(true)}>Ver mais</button>
      </div>
      <ProductCarousel
        handleBuyProduct={handleBuyProduct}
        products={products}
        sectionTitle={sectionTitle}
      />
    </section>
  );
};

export default Produtos;
