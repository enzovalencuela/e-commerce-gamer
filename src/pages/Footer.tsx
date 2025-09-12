function Footer() {
  return (
    <footer>
      <div className="footer1">
        <div className="div-footer">
          <div className="div-logo-social">
            <img className="logo_marca" src="/LOGO_MARCA.png" alt="" />
            <div className="social-media">
              <a href="">
                <img src="./img/instagram.svg" alt="" />
              </a>
              <a href="">
                <img src="./img/facebook.svg" alt="" />
              </a>
              <a href="">
                <img src="./img/youtube.svg" alt="" />{" "}
              </a>
              <a href="">
                <img src="./img/tiktok.svg" alt="" />{" "}
              </a>
            </div>
          </div>
          <div id="div-links" className="div-links institucional">
            <h3>
              Institucional <img src="./img/arrow-more.svg" />
            </h3>
            <p>Sobre Nós</p>
            <p>Nossas Lojas</p>
            <p>Privacidade e Segurança</p>
            <p>Termos e Condições</p>
          </div>
          <div id="div-links" className="div-links central-ajuda">
            <h3>
              Central de ajuda <img src="./img/arrow-more.svg" />
            </h3>
            <p>Fale Conosco</p>
            <p>Frete e Entrega</p>
            <p>Trocas e Devoluções</p>
            <p>Formas de Pagamento</p>
            <p>FAQ</p>
          </div>
          <div id="div-links" className="div-links atendimento">
            <h3>
              Atendimento <img src="./img/arrow-more.svg" />
            </h3>
            <p>
              <b>Telefone:</b> (67) 99846-8831
            </p>
            <p>
              <b>E-mail:</b> esilvavalencuela@gmail.com
            </p>
            <p>
              <b>Horário de atendimento:</b>
            </p>
            <p>Segunda a Sábado: 07h00 às 23h00</p>
            <p>Domingos e Feriados: 07h00 às 21h00</p>
          </div>
        </div>
        <div className="meios-pagamento">
          <img src="./img/amex.svg" alt="" />
          <img src="./img/mastercard.svg" alt="" />
          <img src="./img/visa.svg" alt="" />
          <img src="./img/hipercard.svg" alt="" />
          <img src="./img/elo.svg" alt="" />
          <img src="./img/b.svg" alt="" />
          <img src="./img/paypal.svg" alt="" />
          <img src="./img/pix.svg" alt="" />
          <img src="./img/boleto.svg" alt="" />
        </div>
      </div>
      <div className="div-footer2">
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        </p>
        <div className="parceiros">
          <img className="lets-encrypt" src="./img/lets-encrypt.svg" alt="" />
          <img className="vtex-pci" src="./img/vtex-pci.svg" alt="" />
          <img className="logo" src="/LOGO_MARCA.png" alt="" />
          <img className="vtex-logo" src="./img/VTEX_Logo.svg" alt="" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
