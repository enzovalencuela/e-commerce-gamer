import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Img1 from "/fundo_pc_gamer.png";
import Img2 from "../assets/fone_fundo.png";

function Outdoor() {
  return (
    <section className="section-outdoor">
      <Swiper
        modules={[Pagination, Autoplay]}
        grabCursor
        loop={true}
        speed={800}
        slideToClickedSlide
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide className="outdoor slide1">
          <img src={Img1} alt="" />
          <div className="div-outdoor__text">
            <h2>
              <b>SUPER</b> SALE
            </h2>
            <p>Itens selecionados com até</p>
            <h3>50% off</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide className="outdoor slide2">
          <img src={Img2} alt="" />
          <div className="div-outdoor__text">
            <h2>
              <b>FONE</b> GAMER
            </h2>
            <p>selecionados com até</p>
            <h3>10% off</h3>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default Outdoor;
