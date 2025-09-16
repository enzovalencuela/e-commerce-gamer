// src/App.tsx

import "./App.css";
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router-dom";

function App() {
  const handleSearch = (query: string) => {
    console.log(`Buscando por: "${query}"`);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
