/* eslint-disable react-refresh/only-export-components */
// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import App from "./App.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import Account from "./pages/Account/Account.tsx";
import Carrinho from "./pages/CartPage/CartPage.tsx";
import ProductPage from "./pages/ProductPage/ProductPage.tsx";
import Home from "./pages/Home/Home.tsx";

// ... (register swiper/element/bundle)

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas que não precisam de autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductPage />} />

            {/* Rotas privadas que precisam de autenticação */}
            <Route
              path="account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="carrinho"
              element={
                <PrivateRoute>
                  <Carrinho />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
