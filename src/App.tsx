// src/App.tsx

import "./App.css";
import "./AppMobile.css";
import About from "./pages/About.tsx";
import Footer from "./pages/Footer.tsx";
import Header from "./pages/Header.tsx";
import Home from "./pages/Home.tsx";
import Outdoor from "./pages/Outdoor.tsx";

function App() {
  const handleSearch = (query: string) => {
    // Esta função será passada para o Header e executada quando a busca for acionada
    console.log(`Buscando por: "${query}"`);
    // Lógica para filtrar produtos ou redirecionar para uma página de resultados
  };
  return (
    <>
      <Header onSearch={handleSearch} />
      <Outdoor />
      <Home />
      <About />
      <Footer />
    </>
  );
}

export default App;
