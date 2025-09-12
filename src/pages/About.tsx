import Foto from "../assets/jogos.jpg";
import Foto2 from "../assets/pc_gamer.png";
import Foto3 from "../assets/fundo_pc.jpg";

function About() {
  return (
    <>
      <section className="section-foto">
        <div className="div-foto__img">
          <img src={Foto} alt="" />
        </div>
        <div className="div-foto__text">
          <h2>Lorem ipsum</h2>
          <p>
            Duis consectetur metus nec lacus auctor dignissim. Mauris vitae
            finibus dui. Mauris laoreet lacus ut eleifend viverra. Cras
            efficitur volutpat dui, in lobortis metus lacinia sit amet. Sed
            lacinia pharetra magna, vel pulvinar ligula hendrerit a. Maecenas
            fringilla porttitor tortor eget lacinia. Donec sollicitudin euismod
            orci, auctor fringilla magna consequat interdum. Fusce sagittis elit
            a libero commodo egestas efficitur id augue.
          </p>
          <p>
            Duis consectetur metus nec lacus auctor dignissim. Mauris vitae
            finibus dui. Mauris laoreet lacus ut eleifend viverra. Cras
            efficitur volutpat dui, in lobortis metus lacinia sit amet. Sed
            lacinia pharetra magna, vel pulvinar ligula hendrerit a. Maecenas
            fringilla porttitor tortor eget lacinia. Donec sollicitudin euismod
            orci, auctor fringilla magna consequat interdum. Fusce sagittis elit
            a libero commodo egestas efficitur id augue.
          </p>
        </div>
      </section>
      <section className="section-foto2">
        <div className="div-foto__text2">
          <h2>Lorem ipsum</h2>
          <div className="div-text-location">
            <img src="./img/circulo_location.svg" alt="" />
            <p>
              Aenean massa. Cum sociis natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Donec quam felis,
              ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
          </div>
          <div className="div-text-location">
            <img src="./img/circulo_location.svg" alt="" />
            <p>
              Aenean massa. Cum sociis natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Donec quam felis,
              ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
          </div>
          <div className="div-text-location">
            <img src="./img/circulo_location.svg" alt="" />
            <p>
              Aenean massa. Cum sociis natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Donec quam felis,
              ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
          </div>
        </div>
        <div className="div-foto__img2">
          <img src={Foto2} alt="" />
        </div>
      </section>
      <section className="section-foto">
        <div className="div-foto__img">
          <img src={Foto3} alt="" />
        </div>
        <div className="div-foto__text">
          <h2>Lorem ipsum</h2>
          <p>
            Duis consectetur metus nec lacus auctor dignissim. Mauris vitae
            finibus dui. Mauris laoreet lacus ut eleifend viverra. Cras
            efficitur volutpat dui, in lobortis metus lacinia sit amet. Sed
            lacinia pharetra magna, vel pulvinar ligula hendrerit a. Maecenas
            fringilla porttitor tortor eget lacinia. Donec sollicitudin euismod
            orci, auctor fringilla magna consequat interdum. Fusce sagittis elit
            a libero commodo egestas efficitur id augue.
          </p>
          <p>
            Duis consectetur metus nec lacus auctor dignissim. Mauris vitae
            finibus dui. Mauris laoreet lacus ut eleifend viverra. Cras
            efficitur volutpat dui, in lobortis metus lacinia sit amet. Sed
            lacinia pharetra magna, vel pulvinar ligula hendrerit a. Maecenas
            fringilla porttitor tortor eget lacinia. Donec sollicitudin euismod
            orci, auctor fringilla magna consequat interdum. Fusce sagittis elit
            a libero commodo egestas efficitur id augue.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
