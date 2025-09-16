// src/components/ProductCarousel.tsx

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./ProductCarousel.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import OkMessage from "../OkMessage/OkMessage";

export interface Product {
  id: number;
  titulo: string;
  preco: string;
  precoOriginal: string;
  parcelamento: string;
  img: string;
}

interface ProductCarouselProps {
  products: Product[];
  sectionTitle: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  sectionTitle,
}) => {
  const isPromotionSection = sectionTitle === "Em Promoção";
  const isReleasesSection = sectionTitle === "Lançamentos";
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const { user, addToCart } = useAuth();

  const errorMessage = "Ocorreu um erro, tente novamente mais tarde.";

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setShowErrorMessage(true);
      return;
    }

    await addToCart(product);
    setShowOkMessage(true);
  };

  const okMessage = `Produto adicionado ao carrinho!`;

  return (
    <div className="card_container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          message={errorMessage}
        />
      )}
      {showOkMessage && (
        <OkMessage
          onClose={() => setShowOkMessage(false)}
          message={okMessage}
        />
      )}
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
        spaceBetween={10}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index} className="product">
            <div>
              {isReleasesSection && <span className="span-new">novo</span>}
              {isPromotionSection && <span className="off">10% off</span>}
              <Link to={`/product/${product.id}`}>
                <img src={product.img} alt={product.titulo} />
              </Link>
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
              <button onClick={() => handleAddToCart(product)}>
                Add ao Carrinho
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
