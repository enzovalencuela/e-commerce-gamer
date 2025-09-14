import React from "react";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import "./Produtos.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
    preco: "1500,00",
    precoOriginal: "1700,00",
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
  {
    id: 6,
    titulo: "PlayStation 5",
    preco: "3189,90",
    precoOriginal: "3500,00",
    parcelamento: "10x de R$ 320,00",
    img: "https://m.media-amazon.com/images/I/41bsdF9lMPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 7,
    titulo: "Óculos VR Quest",
    preco: "4950,90",
    precoOriginal: "5500,00",
    parcelamento: "12x de R$ 480,00",
    img: "https://m.media-amazon.com/images/I/51pdPTbbjzL._UF894,1000_QL80_.jpg",
  },
];

const Home: React.FC = () => {
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

  return (
    <section className="section-produtos">
      <div className="div-produtos__title">
        <h2>Lançamentos</h2>
        <button>Ver mais</button>
      </div>
      <ProductCarousel handleBuyProduct={handleBuyProduct} />
    </section>
  );
};

export default Home;
