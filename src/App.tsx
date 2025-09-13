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

function App() {
  const handleSearch = (query: string) => {
    console.log(`Buscando por: "${query}"`);
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
