// src/pages/Admin/Dashboard.tsx

import React, { useState } from "react";
import "./Dashboard.css";
import BackButton from "../../components/BackButton/BackButton";
import ProdutosDashboard from "./Produtos/Produtos";
import Vendas from "./Vendas/Vendas";
import { useProduct } from "../../contexts/ProductContext";

const Dashboard: React.FC = () => {
  const { produtos, setProdutos } = useProduct();
  const [vendas, setVendas] = useState(false);

  return (
    <div className="dashboard-container">
      <BackButton />
      <h1>Painel Dashboard</h1>
      <div className="dashboard-buttons">
        <button
          onClick={() => {
            setProdutos(!produtos);
            setVendas(false);
          }}
        >
          Produtos
        </button>
        <button
          onClick={() => {
            setVendas(!vendas);
            setProdutos(false);
          }}
        >
          Vendas
        </button>
      </div>
      <div>
        {produtos && <ProdutosDashboard />}
        {vendas && <Vendas />}
      </div>
    </div>
  );
};

export default Dashboard;
