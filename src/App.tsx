// src/App.tsx

import "./App.css";
import "./AppMobile.css";
import About from "./pages/About.tsx";
import Footer from "./pages/Footer.tsx";
import Header from "./pages/Header.tsx";
import Produtos from "./pages/Produtos.tsx";
import Outdoor from "./pages/Outdoor.tsx";
import Banner from "./pages/Banner.tsx";

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
      <Produtos />
      <About />
      <Produtos />
      <Banner />
      <Footer />
    </>
  );
}

export default App;
