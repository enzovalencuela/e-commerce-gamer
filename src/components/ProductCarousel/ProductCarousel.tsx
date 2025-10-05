// src/components/ProductCarousel.tsx

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./ProductCarousel.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SpanMessage from "../SpanMessage/SpanMessage";
import type { Product } from "../../types/Product";

interface ProductCarouselProps {
  products: Product[];
  sectionTitle?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  sectionTitle,
}) => {
  const isPromotionSection = sectionTitle === "Em Promoção";
  const isReleasesSection = sectionTitle === "Lançamentos";
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSpanOkMessage, setShowSpanOkMessage] = useState(false);
  const [showSpanErrorMessage, setShowSpanErrorMessage] = useState(false);
  const { user, addToCart, cart } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setShowErrorMessage(true);
      return;
    }

    const status = await addToCart(product);
    if (status === "error") {
      setShowSpanErrorMessage(true);
    } else {
      setShowSpanOkMessage(true);
    }
  };


  return (
    <div className="card_container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          buttonContent="Ir Para Login"
          onClick={() => navigate("/login")}
        />
      )}
      {showSpanOkMessage && (
        <SpanMessage message="Produto adicionado ao carrinho!" status="ok" />
      )}
      {showSpanErrorMessage && (
        <SpanMessage
          message="Produto já adicionado ao carrinho!"
          status="error"
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
        {products.map((product, index) => {
          const isProductInCart = cart.some((item) => item.id === product.id);
          const desconto =
            100 - (product.preco * 100) / (product.preco_original || 1);
          const parcela = product.preco / product.max_parcelas * (1 + product.taxa_parcela / 100);

          return (
            <SwiperSlide key={index} className="product">
              <div>
                {isReleasesSection && <span className="span-new">novo</span>}
                {isPromotionSection && (
                  <span className="off">{desconto.toFixed(0)}% off</span>
                )}
                <Link to={`/product/${product.id}`}>
                  <img src={product.img} alt={product.titulo} />
                </Link>
                <div className="produto__text">
                  <h3>{product.titulo}</h3>
                  <p>R${product.preco_original} </p>
                  <h4>
                    R$ {product.preco} <span>Ou</span>
                  </h4>
                  <span>
                    em até <b>{product.max_parcelas}x de R${Number(parcela).toFixed(2)}</b>
                  </span>
                </div>
                {/* Lógica para o botão */}
                <button
                  onClick={() =>
                    isProductInCart
                      ? navigate("/carrinho")
                      : handleAddToCart(product)
                  }
                  className={
                    isProductInCart ? "added-to-cart-btn" : "add-to-cart-btn"
                  }
                >
                  {isProductInCart ? "Ver no Carrinho" : "Add ao Carrinho"}
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
