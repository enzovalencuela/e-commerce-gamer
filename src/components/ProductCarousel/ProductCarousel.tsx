// src/components/ProductCarousel.tsx

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./ProductCarousel.css";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Product } from "../../types/Product";
import ProductCard from "../ProductCard/ProductCard";

interface ProductCarouselProps {
  products: Product[];
  sectionTitle?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  sectionTitle,
}) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card_container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          buttonContent="Ir Para Login"
          onClick={() => navigate("/login")}
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
          <SwiperSlide key={index}>
            <ProductCard product={product} sectionTitle={sectionTitle} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
