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
    img: "https://cdn.awsli.com.br/2500x2500/1307/1307157/produto/138258516/cd9356d94a.jpg",
  },
  {
    id: 2,
    titulo: "Mouse Gamer",
    preco: "149,99",
    precoOriginal: "160,00",
    parcelamento: "5x de R$ 30,00",
    img: "https://img.terabyteshop.com.br/produto/g/mouse-gamer-razer-cobra-rgb-6-botoes-programaveis-8500-dpi-black-rz0104650100r3u_180092.jpg",
  },
  {
    id: 3,
    titulo: "Teclado Mecânico",
    preco: "250,00",
    precoOriginal: "280,00",
    parcelamento: "6x de R$ 41,67",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7v4_hBRpFke1LOCdKc_wpQk8rkIifTQiNw&s",
  },
  {
    id: 4,
    titulo: "Monitor Ultrawide",
    preco: "1.500,00",
    precoOriginal: "1.700,00",
    parcelamento: "10x de R$ 150,00",
    img: "https://images.kabum.com.br/produtos/fotos/525503/monitor-gamer-aoc-23-8-full-hd-100hz-1ms-ips-displayport-e-hdmi-adaptive-sync-24g2e1_1710771975_gg.jpg",
  },
  {
    id: 5,
    titulo: "Webcam HD",
    preco: "89,90",
    precoOriginal: "100,00",
    parcelamento: "3x de R$ 30,00",
    img: "https://m.media-amazon.com/images/I/61-K2lXmHQL._UF894,1000_QL80_.jpg",
  },
];

const Home: React.FC = () => {
  // Funções de callback para as ações da página

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

      const response = await fetch(
        "https://back-end-pagamento.vercel.app/api/payments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

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
              img={product.img}
              handleBuy={() => handleBuyProduct(product.id)}
            />
          </div>
        ))}
      </ProductCarousel>
    </section>
  );
};

export default Home;
