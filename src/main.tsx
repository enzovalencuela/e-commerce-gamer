// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import Account from "./pages/Account/Account.tsx";
import Carrinho from "./pages/CartPage/CartPage.tsx";
import ProductPage from "./pages/ProductPage/ProductPage.tsx";
import Home from "./pages/Home/Home.tsx";
import Dashboard from "./pages/Admin/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage.tsx";
import StatusPagamento from "./pages/Status/Status.tsx";
import PaymentResum from "./pages/PaymentResum/PaymentResum.tsx";
import MinhasCompras from "./pages/MinhasCompras/MinhasCompras.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="account" element={<Account />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="minhas-compras" element={<MinhasCompras />} />
            <Route path="/produtos/search" element={<SearchResultsPage />} />
            <Route
              path="/produtos/categoria/:categoria"
              element={<SearchResultsPage />}
            />
            <Route path="status" element={<StatusPagamento />} />
            <Route path="checkout" element={<PaymentResum />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
