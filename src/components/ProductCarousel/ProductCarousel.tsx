// src/components/ProductCarousel.tsx

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./ProductCarousel.css";

interface Product {
  id: number;
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  img: string;
}

const products: Product[] = [
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

interface ProductCarouselProps {
  handleBuyProduct: (productId: number) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  handleBuyProduct,
}) => {
  return (
    <div className="card_container">
      <Swiper
        modules={[Pagination]}
        grabCursor
        loop={true}
        initialSlide={2}
        speed={800}
        slideToClickedSlide
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 2 },
          660: { slidesPerView: 3 },
          950: { slidesPerView: 4 },
          1290: { slidesPerView: 5 },
        }}
        spaceBetween={20}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index} className="product">
            <div>
              <span className="span-new">novo</span>
              <span className="off">10% off</span>
              <img src={product.img} alt="" />
              <div className="produto__text">
                <h3>{product.titulo}</h3>
                <p>R${product.precoOriginal} </p>
                <h4>
                  R$ {product.preco} <span>Ou</span>
                </h4>
                <span>
                  em até <b>{product.parcelamento}</b>
                </span>
              </div>
              <button onClick={() => handleBuyProduct(product.id)}>
                Comprar
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
