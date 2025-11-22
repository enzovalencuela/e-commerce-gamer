/* eslint-disable react-hooks/exhaustive-deps */
// src/App.tsx

import "./App.css";
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop.tsx";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig.ts";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setIsAuthenticated(!!currentUser);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          localStorage.setItem("jwt_token", idToken);
        } catch (error) {
          console.error("Erro ao obter Firebase ID Token:", error);
          auth.signOut();
        }
      } else {
        localStorage.removeItem("jwt_token");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Redirecionando para dashboard");
      navigate("/");
    } else {
      navigate("/login");
      console.log("Redirecionando para login");
    }
  }, [isAuthenticated]);

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
