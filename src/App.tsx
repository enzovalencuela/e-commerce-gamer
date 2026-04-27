import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop.tsx";

function App() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <ScrollToTop />
      <Header />
      <main className="w-full pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
