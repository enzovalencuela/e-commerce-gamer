// src/App.tsx

import "./App.css";
import About from "./components/About/About.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Header from "./components/Header/Header.tsx";
import Produtos from "./components/Produtos/Produtos.tsx";
import Outdoor from "./components/Outdoor/Outdoor.tsx";
import Banner from "./components/Banner/Banner.tsx";
import { useEffect, useState } from "react";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage.tsx";

function App() {
  const handleSearch = (query: string) => {
    console.log(`Buscando por: "${query}"`);
  };
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
        <ErrorMessage
          message={welcomeMessage}
          onClose={() => setShowWelcomeMessage(false)}
        />
      )}
      <Header onSearch={handleSearch} />
      <Outdoor />
      <Produtos />
      <About />
      <Produtos />
      <Banner />
      <Footer />
    </>
  );
}

export default App;
