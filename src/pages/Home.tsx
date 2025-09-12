import React from "react";

// Importando os componentes
import ProductCarousel from "../components/ProductCarousel";
import ProdutoCard from "../components/ProdutoCard";

// Dados de produtos de exemplo para o carrossel (pode vir de uma API no futuro)
const products = [
  {
    id: 1,
    titulo: "Fone de Ouvido",
    preco: "99,90",
    precoOriginal: "110,00",
    parcelamento: "3x de R$ 33,30",
  },
  {
    id: 2,
    titulo: "Mouse Gamer",
    preco: "149,99",
    precoOriginal: "160,00",
    parcelamento: "5x de R$ 30,00",
  },
  {
    id: 3,
    titulo: "Teclado Mecânico",
    preco: "250,00",
    precoOriginal: "280,00",
    parcelamento: "6x de R$ 41,67",
  },
  {
    id: 4,
    titulo: "Monitor Ultrawide",
    preco: "1.500,00",
    precoOriginal: "1.700,00",
    parcelamento: "10x de R$ 150,00",
  },
  {
    id: 5,
    titulo: "Webcam HD",
    preco: "89,90",
    precoOriginal: "100,00",
    parcelamento: "3x de R$ 30,00",
  },
];

const Home: React.FC = () => {
  // Funções de callback para as ações da página

  const handleBuyProduct = async (productId: number) => {
    try {
      // 1. Encontre o produto pelo ID
      const productToBuy = products.find((p) => p.id === productId);

      if (!productToBuy) {
        alert("Produto não encontrado.");
        return;
      }

      // 2. Chama a API do back-end para criar a preferência de pagamento
      const response = await fetch(
        "https://back-end-pagamento.vercel.app/api/payments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: productToBuy.id,
            title: productToBuy.titulo,
            price: parseFloat(productToBuy.preco.replace(",", ".")),
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar a preferência de pagamento.");
      }

      const data = await response.json();
      const preferenceId = data.id; // Supondo que a API retorna o ID da preferência

      // 3. Redireciona o usuário para a URL de pagamento do Mercado Pago
      window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${preferenceId}`;
    } catch (error) {
      console.error("Erro na compra:", error);
      alert("Ocorreu um erro ao processar seu pagamento. Tente novamente.");
    }
  };

  return (
    <section className="section-produtos swiper" id="section-produtos2">
      <div className="div-produtos__title">
        <h2>Lançamentos</h2>
        <button>Ver mais</button>
      </div>
      <ProductCarousel>
        {products.map((product) => (
          <div key={product.id}>
            <ProdutoCard
              titulo={product.titulo}
              preco={product.preco}
              precoOriginal={product.precoOriginal}
              parcelamento={product.parcelamento}
              handleBuy={() => handleBuyProduct(product.id)}
            />
          </div>
        ))}
      </ProductCarousel>
    </section>
  );
};

export default Home;
