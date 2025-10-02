// src/pages/Home/Home.tsx
import React, { useEffect, useState } from "react";
import Outdoor from "../../components/Outdoor/Outdoor.tsx";
import Produtos from "../../components/Produtos/Produtos.tsx";
import Banner from "../../components/Banner/Banner.tsx";
import About from "../../components/About/About.tsx";
import AttentionMessage from "../../components/AttentionMessage/AttentionMessage.tsx";

const Home: React.FC = () => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const welcomeMessage =
    "Este site é um projeto de estudo e os produtos expostos são fictícios e não estão à venda. Todos os direitos são de seus respectivos proprietários. Aproveite o site!";

  useEffect(() => {
    const messageShownKey = "welcomeMessageShown";
    const hasShownMessage = sessionStorage.getItem(messageShownKey);

    if (!hasShownMessage) {
      setShowWelcomeMessage(true);
      sessionStorage.setItem(messageShownKey, "true");
    }
  }, []);

  return (
    <>
      {showWelcomeMessage && (
        <AttentionMessage
          message={welcomeMessage}
          onClose={() => setShowWelcomeMessage(false)}
        />
      )}

      <Outdoor />

      {/* Sessões especiais */}
      <Produtos tipoSessao="maisVendidos" />
      <Produtos tipoSessao="recomendados" />
      <Produtos tipoSessao="emPromocao" />

      {/* Sessões por categoria */}
      <Produtos categoria="Setups" />
      <Produtos categoria="Periféricos" />

      <Banner />
      <About />
    </>
  );
};

export default Home;
