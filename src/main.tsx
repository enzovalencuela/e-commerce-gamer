// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Importe a página de sucesso que vamos criar

import SuccessPage from "./pages/Success.tsx";
import StatusPage from "./pages/Status.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
