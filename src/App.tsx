// src/App.tsx

import "./App.css";
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop.tsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
