// src/App.tsx

import "./App.css";
import "./AppTablet.css";
import "./AppMobile.css";
import About from "./pages/About.tsx";
import Footer from "./pages/Footer.tsx";
import Header from "./pages/Header.tsx";
import Produtos from "./pages/Produtos.tsx";
import Outdoor from "./pages/Outdoor.tsx";
import Banner from "./pages/Banner.tsx";
import { useEffect, useState } from "react";
import ErrorMessage from "./components/ErrorMessage.tsx";

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
