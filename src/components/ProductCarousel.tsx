// src/components/ProductCarousel.tsx

import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

interface ProductCarouselProps {
  children: React.ReactNode;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ children }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        loop: false,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        },
      });
    }
  }, []); // Executa apenas uma vez

  return (
    <div className="card-wrapper" ref={swiperRef}>
      <div className="card-list swiper-wrapper">{children}</div>
      <div className="swiper-pagination"></div>
      <div>
        <img
          className="swiper-button swiper-button-prev"
          src="./img/arrowLeft.svg"
          alt=""
        />
      </div>
      <div>
        <img
          className="swiper-button swiper-button-next"
          src="./img/arrowRight.svg"
          alt=""
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
